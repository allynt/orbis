import React, { lazy, useCallback, useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {
  activeDataSourcesSelector,
  selectDataToken,
} from 'data-layers/data-layers.slice';
import { getData } from 'utils/http';
import { useMySupplyLynkOrb } from './mySupplyLynk/useMySupplyLynkOrb';
import { useMap } from 'MapContext';
import { LayerFactory } from '../deck.gl/LayerFactory';
import { useIsolationPlusOrb } from './isolationPlus/useIsolationPlusOrb';

const dataUrlFromId = source => {
  return source.data && typeof source.data === 'string'
    ? source.data
    : source.metadata.url;
};

export const useOrbs = () => {
  const { setViewState } = useMap();
  const dispatch = useDispatch();
  const authToken = useSelector(selectDataToken);
  /** @type {Source[]} */
  const activeSources = useSelector(activeDataSourcesSelector);
  const [data, setData] = useState({});
  const [stateLayers, setStateLayers] = useState([]);
  const [stateMapComponents, setStateMapComponents] = useState([]);
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
    /** @type {[string, JSX.Element][]} */
    const components = activeSources.map(source => {
      if (!source?.metadata?.application?.orbis?.sidebar_component?.name)
        return [source.source_id, null];
      const Component = lazy(() =>
        import(
          `./components/${source.metadata.application.orbis.sidebar_component.name}`
        ),
      );
      const props = source.metadata.application.orbis.sidebar_component.props;
      return [
        source.source_id,
        <Component selectedLayer={source} dispatch={dispatch} {...props} />,
      ];
    });
    setSidebarComponents(
      components.reduce(
        (acc, [source_id, component]) => ({
          ...acc,
          [source_id]: component,
        }),
        {},
      ),
    );
  }, [activeSources, dispatch]);

  useEffect(() => {
    const components = activeSources.map(source => {
      if (!source?.metadata?.application?.orbis?.map_component?.name)
        return null;
      const Component = lazy(() =>
        import(
          `./components/${source.metadata.application.orbis.map_component.name}`
        ),
      );
      const props = source.metadata.application.orbis.map_component.props;
      return <Component {...props} />;
    });
    setStateMapComponents(components);
  }, [activeSources, dispatch]);

  useEffect(() => {
    /**
     * @param {Source} source
     */
    const createLayer = async source => {
      if (!source?.metadata?.application?.orbis?.layer?.name) return undefined;
      const { props, name } = source.metadata.application.orbis.layer;
      let config = props;
      if (typeof config === 'string') {
        const imported = await import(`./configurations/${config}`);
        const configFn = imported.default;
        config = configFn({
          id: source.source_id,
          data: data[source.source_id],
          activeSources,
          dispatch,
          setViewState,
        });
      }
      const layer = LayerFactory(name, config);
      return layer;
    };
    const layerPromises = activeSources.map(createLayer);
    Promise.all(layerPromises).then(setStateLayers);
  }, [activeSources, data, dispatch, setViewState]);

  const {
    layers: mySupplyLynkLayers,
    mapComponents: mySupplyLynkMapComponents,
  } = useMySupplyLynkOrb(data, activeSources);
  const { layers: isolationPlusLayers } = useIsolationPlusOrb(
    data,
    activeSources,
    authToken,
  );

  let layers = [...stateLayers, ...mySupplyLynkLayers, ...isolationPlusLayers];

  let mapComponents = [...stateMapComponents, ...mySupplyLynkMapComponents];

  return {
    layers,
    mapComponents,
    sidebarComponents,
  };
};
