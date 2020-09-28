import React, { lazy, useCallback, useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import {
  activeDataSourcesSelector,
  selectDataToken,
} from 'data-layers/data-layers.slice';
import { getData } from 'utils/http';
import { useActionForHelpOrb } from './actionForHelp/useActionForHelpOrb';

const dataUrlFromId = source => {
  return source.data && typeof source.data === 'string'
    ? source.data
    : source.metadata.url;
};

export const useOrbs = () => {
  const authToken = useSelector(selectDataToken);
  const activeSources = useSelector(activeDataSourcesSelector);
  const [data, setData] = useState({});
  const [sidebarComponents, setSidebarComponents] = useState({});

  const fetchData = useCallback(
    async source => {
      const response = await getData(dataUrlFromId(source), {
        Authorization: `Bearer ${authToken}`,
      });
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

  useEffect(() => {
    const loadComponents = async () => {
      const componentPromises = activeSources.map(source => {
        const Component = lazy(() =>
          import(`./components/${source.metadata.sidebar_component}`),
        );
        return [source.source_id, <Component />];
      });
      Promise.all(componentPromises).then(components =>
        setSidebarComponents(
          components.reduce(
            (acc, [source_id, component]) => ({
              ...acc,
              [source_id]: component,
            }),
            {},
          ),
        ),
      );
    };
    loadComponents();
  }, [activeSources]);

  const {
    layers: actionForHelpLayers,
    mapComponents: actionForHelpMapComponents,
  } = useActionForHelpOrb(data, activeSources);

  let layers = [...actionForHelpLayers];
  let mapComponents = [...actionForHelpMapComponents];

  return {
    layers,
    mapComponents,
    sidebarComponents,
  };
};
