import { useCallback, useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import {
  activeDataSourcesSelector,
  selectDataToken,
} from 'data-layers/data-layers.slice';
import { getData } from 'utils/http';
import { useHourglassOrb } from './hourglass/useHourglassOrb';
import { useIsolationPlusOrb } from './isolationPlus/useIsolationPlusOrb';
import { useRiceOrb } from './rice/useRiceOrb';

const dataUrlFromId = source => {
  return source.data && typeof source.data === 'string'
    ? source.data
    : source.metadata.url;
};

export const useOrbs = () => {
  const authToken = useSelector(selectDataToken);
  const activeSources = useSelector(activeDataSourcesSelector);
  const [data, setData] = useState({});

  const dataRequest = useCallback(
    url =>
      url &&
      new Promise(async (resolve, reject) => {
        const response = await getData(url, {
          Authorization: `Bearer ${authToken}`,
        });
        if (!response.ok) reject(response.status);
        resolve(response.json());
      }),
    [authToken],
  );

  useEffect(() => {
    const fetchData = async source => {
      const dataSet = await dataRequest(dataUrlFromId(source));
      setData({ ...data, [source.source_id]: dataSet });
    };
    for (let source of activeSources) {
      if (!data[source.source_id]) {
        if (source.metadata.tiles)
          setData({ ...data, [source.source_id]: source.metadata.tiles });
        else fetchData(source);
      }
    }
  }, [activeSources, dataRequest, data]);

  // This needs to be more dynamic but it was breaking the rules of hooks when loading from the array
  const {
    layers: hourglassLayers,
    mapComponents: hourglassMapComponents,
    sidebarComponents: hourglassSidebarComponents,
  } = useHourglassOrb(data, activeSources);
  const {
    layers: riceLayers,
    mapComponents: riceMapComponents,
    sidebarComponents: riceSidebarComponents,
  } = useRiceOrb(data, activeSources);
  const {
    layers: isoPlusLayers,
    mapComponents: isoPlusMapComponents,
    sidebarComponents: isoPlusSidebarComponents,
  } = useIsolationPlusOrb(data, activeSources, authToken);

  let layers = [...isoPlusLayers, ...hourglassLayers, ...riceLayers];
  let mapComponents = [
    ...hourglassMapComponents,
    ...riceMapComponents,
    ...isoPlusMapComponents,
  ];
  let sidebarComponents = {
    ...hourglassSidebarComponents,
    ...riceSidebarComponents,
    ...isoPlusSidebarComponents,
  };

  return { layers, mapComponents, sidebarComponents };
};
