import { sendData } from 'utils/http';
import { FeatureDetail, Popup } from 'components';

import PopupStatusAndNote from './popup-status-and-note/popup-status-and-note.component';

import { pickBy } from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clickedFeaturesSelector, setClickedFeatures } from '../layers.slice';
import { selectDataToken } from 'data-layers/data-layers.slice';

const ActionForHelpMapComponent = ({ source }) => {
  const pickedObjects = useSelector(state =>
    clickedFeaturesSelector(source?.source_id)(state?.orbs),
  );
  const dataToken = useSelector(selectDataToken);
  const dispatch = useDispatch();

  const updateNoteOrStatus = async ({ id, ...data }) => {
    const url = `https://app.testing.actionforhelp.co.uk/api/people/hourglass/${id}/`;

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${dataToken}`,
    };

    const response = await sendData(url, data, headers, 'PUT');
    return response.json();
  };

  if (!pickedObjects?.length) return null;
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
        features={pickedObjects.map(obj =>
          pickBy(
            obj.properties,
            (_, key) =>
              !key.toLowerCase().includes('type') &&
              !key.toLowerCase().includes('pk'),
          ),
        )}
        title={
          pickedObjects[0].properties.Type
            ? 'User Details'
            : 'Infrastructure Details'
        }
      />
      {pickedObjects?.map(feat => (
        <React.Fragment key={feat.properties.pk}>
          <PopupStatusAndNote
            id={feat.properties.pk}
            note={feat.properties.notes}
            status={feat.properties.status}
            onSave={data => updateNoteOrStatus(data)}
          />
        </React.Fragment>
      ))}
    </Popup>
  );
};

export default ActionForHelpMapComponent;
