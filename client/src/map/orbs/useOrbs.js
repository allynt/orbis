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
import { useMySupplyLynkOrb } from './mysupplylynk/useMySupplyLynkOrb';

const dataUrlFromId = source => {
  return source.data && typeof source.data === 'string'
    ? source.data
    : source.metadata.url;
};

export const useOrbs = () => {
  const authToken = useSelector(selectDataToken);
  const activeSources = useSelector(activeDataSourcesSelector);
  const [data, setData] = useState({});

  console.log('Active Sources: ', activeSources);

  const fetchData = useCallback(
    async source => {
      const response = await fetch(dataUrlFromId(source), {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log('Response: ', response);
      if (!response.ok) console.error(response.status);
      const dataSet = await response.json();
      setData({ ...data, [source.source_id]: dataSet });
    },
    [authToken, data],
  );

  useEffect(() => {
    for (let source of activeSources) {
      if (!data[source.source_id]) {
        if (source.metadata.tiles)
          setData({ ...data, [source.source_id]: source.metadata.tiles });
        else fetchData(source);
      }
    }
  }, [activeSources, data, fetchData]);

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
  // const {
  //   layers: mySupplyLynkLayers,
  //   mapComponents: mySupplyLynkMapComponents,
  //   sidebarComponents: mySupplyLynkSidebarComponents,
  // } = useMySupplyLynkOrb(data, activeSources);

  let layers = [
    ...isoPlusLayers,
    ...hourglassLayers,
    ...riceLayers,
    // ...mySupplyLynkLayers,
  ];
  let mapComponents = [
    ...hourglassMapComponents,
    ...riceMapComponents,
    ...isoPlusMapComponents,
    // ...mySupplyLynkMapComponents,
  ];
  let sidebarComponents = {
    ...hourglassSidebarComponents,
    ...riceSidebarComponents,
    ...isoPlusSidebarComponents,
    // ...mySupplyLynkSidebarComponents,
  };

  return { layers, mapComponents, sidebarComponents };
};
