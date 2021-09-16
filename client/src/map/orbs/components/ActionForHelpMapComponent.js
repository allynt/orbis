import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { FeatureDetail, Popup } from 'components';
import { selectDataToken } from 'data-layers/data-layers.slice';
import { sendData } from 'utils/http';

import {
  clickedFeaturesSelector,
  setClickedFeatures,
  dataSelector,
  setData,
} from '../layers.slice';
import PopupStatusAndNote from './popup-status-and-note/popup-status-and-note.component';

const ActionForHelpMapComponent = ({ source }) => {
  const layerData = useSelector(state =>
    dataSelector(source?.source_id)(state?.orbs),
  );
  const pickedObjects = useSelector(state =>
    clickedFeaturesSelector(source?.source_id)(state?.orbs),
  );

  const dataToken = useSelector(selectDataToken);
  const dispatch = useDispatch();

  const updateNoteOrStatus = async ({ id, ...data }) => {
    const url = `${source?.metadata?.url.split(/\/?\?/)[0]}/${id}/`;

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${dataToken}`,
    };

    const response = await sendData(url, data, headers, 'PUT');
    const json = await response.json();

    const newData = {
      ...layerData,
      features: layerData?.features?.map(feat =>
        feat.id === id
          ? {
              ...feat,
              properties: {
                ...feat.properties,
                notes: json.notes,
                status: json.status,
              },
            }
          : feat,
      ),
    };

    return dispatch(
      setData({
        key: source?.source_id,
        data: newData,
      }),
    );
  };

  if (!pickedObjects?.length) return null;
  const isPersonFeatureType = 'Type' in pickedObjects[0].properties;
  return (
    <Popup
      longitude={pickedObjects[0]?.geometry.coordinates[0]}
      latitude={pickedObjects[0]?.geometry.coordinates[1]}
      onClose={() =>
        dispatch(
          setClickedFeatures({
            key: source.source_id,
            clickedFeatures: [],
          }),
        )
      }
      captureScroll
    >
      <FeatureDetail
        features={pickedObjects.map(obj => obj.properties)}
        title={isPersonFeatureType ? 'User Details' : 'Infrastructure Details'}
        propertiesToOmit={['Type', 'pk', 'status', 'notes']}
        postFeatureComponent={
          isPersonFeatureType
            ? feat => (
                <PopupStatusAndNote
                  key={feat.pk}
                  id={feat.pk}
                  note={feat.notes}
                  status={feat.status}
                  onSave={data => updateNoteOrStatus(data)}
                />
              )
            : null
        }
      />
    </Popup>
  );
};

export default ActionForHelpMapComponent;
