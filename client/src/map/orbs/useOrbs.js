import {
  activeLayersSelector,
  dataSourcesSelector,
  selectDataToken,
} from 'data-layers/data-layers.slice';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHourglassOrb } from './hourglass/useHourglassOrb';
import { useRiceOrb } from './rice/useRiceOrb';

const orbs = [useHourglassOrb, useRiceOrb];

const dataUrlFromId = (id, sources) => {
  const source = sources.find(source => source.source_id === id);
  if (!source) return;
  return source.data && typeof source.data === 'string'
    ? source.data
    : source.metadata.url;
};

export const useOrbs = () => {
  const authToken = useSelector(selectDataToken);
  const sources = useSelector(dataSourcesSelector);
  const activeLayers = useSelector(activeLayersSelector);
  const [data, setData] = useState({});

  const dataRequest = useCallback(
    url =>
      url &&
      new Promise(async (resolve, reject) => {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) reject(response.status);
        resolve(response.json());
      }),
    [authToken],
  );

  useEffect(() => {
    const fetchData = async layerId => {
      const dataSet = await dataRequest(dataUrlFromId(layerId, sources));
      setData({ ...data, [layerId]: dataSet });
    };
    for (let layerId of activeLayers) {
      if (!data[layerId]) {
        fetchData(layerId);
      }
    }
  }, [activeLayers, sources, dataRequest, data]);

  let layers = [];
  let mapComponents = [];

  for (let orbHook of orbs) {
    const { layers: orbLayers, mapComponents: orbMapComponents } = orbHook(
      data,
      activeLayers,
    );
    layers = [...layers, ...orbLayers];
    mapComponents = [...mapComponents, ...orbMapComponents];
  }

  return { layers, mapComponents };
};
