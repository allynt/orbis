/*
  This is the old MapLayout before @Reignable carried out the
  Astrosat-UI conversion as part of .

  I'm leaving it here as the code is too complicated to just delete but 
  fairly certain we won't be handling multiple maps in the same way.

  It's quicker and easier to create carte blanche for myself in the real
  MapLayout to carry out the work I need to rather than trying to work around
  unused code.

  Below the component are also styles from the old map-layout.module.css
  which I considered pertinent to the component
*/

/*
import React, { useEffect, useState } from 'react';

import Measure from 'react-measure';
import { useDispatch, useSelector } from 'react-redux';

import ControlPanel from '../control-panel/control-panel.component';
import {
  fetchSources,
  selectPollingPeriod,
} from 'data-layers/data-layers.slice';

import { selectedPinnedScenesSelector } from 'satellites/satellites.slice';

import Map from './map.component';
import styles from './map-layout.module.css';
import { isCompareModeSelector } from './map.slice';
import { AnalysisPanel } from 'analysis-panel/analysis-panel.component';

const times = (n, fn) => {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(fn(i));
  }
  return result;
};

const MapLayout = () => {
  const dispatch = useDispatch();
  const pollingPeriod = useSelector(selectPollingPeriod);
  const isCompareMode = useSelector(isCompareModeSelector);
  const selectedPinnedScenes = useSelector(selectedPinnedScenesSelector);

  const mapCount = isCompareMode ? 2 : 1;

  const [compareRatio, setCompareRatio] = useState(0.5);
  const [bounds, setBounds] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const compareMove = event => {
    event = event.touches ? event.touches[0] : event;
    let x = event.clientX - bounds.left;
    if (x < 0) x = 0;
    if (x > bounds.width) x = bounds.width;
    const ratio = x / bounds.width;
    setCompareRatio(ratio);
  };

  const compareTouchEnd = () => {
    document.removeEventListener('touchmove', compareMove);
    document.removeEventListener('touchend', compareTouchEnd);
  };

  const compareMouseEnd = () => {
    document.removeEventListener('mousemove', compareMove);
    document.removeEventListener('mouseup', compareMouseEnd);
  };

  const compareDown = event => {
    event && event.preventDefault();
    if (event.touches) {
      document.addEventListener('touchmove', compareMove);
      document.addEventListener('touchend', compareTouchEnd);
    } else {
      document.addEventListener('mousemove', compareMove);
      document.addEventListener('mouseup', compareMouseEnd);
    }
  };

  useEffect(() => {
    // Poll API to get new Data token (expires every X seconds/mins etc)
    // this also fetches the list of data sources the user has access to.
    dispatch(fetchSources());
    const interval = setInterval(() => {
      dispatch(fetchSources());
    }, pollingPeriod);
    return () => {
      clearInterval(interval);
    };
  }, [pollingPeriod, dispatch]);

  return (
    <Measure bounds onResize={contentRect => setBounds(contentRect.bounds)}>
      {({ measureRef }) => (
        <div
          ref={measureRef}
          className={`${styles.layout} ${
            isCompareMode ? styles.compareMode : styles[`layout-${mapCount}`]
          }`}
        >
          <ControlPanel />
          <Map
            compareRatio={compareRatio}
            compare={isCompareMode}
            selectedPinnedScenes={selectedPinnedScenes}
          />
          <AnalysisPanel />
          {isCompareMode && (
            <div
              className={styles.compare}
              style={{
                transform: `translate(${compareRatio * bounds.width}px, 0px`,
              }}
              onMouseDown={compareDown}
              onTouchStart={compareDown}
            >
              <div className={styles.swiper} />
            </div>
          )}
        </div>
      )}
    </Measure>
  );
};

export default MapLayout;
*/

/*
.compare {
  display: unset;
  position: absolute;
  z-index: 10;
  top: 0;
  width: 2px;
  height: 100%;
  background-color: #fff;
}

.swiper {
  position: fixed;
  top: 50%;
  left: -30px;
  display: inline-block;

  width: 60px;
  height: 60px;
  margin: -30px 1px 0;

  cursor: ew-resize;

  color: #fff;
  border-radius: 50%;
  background-color: #3887be;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiICAgd2lkdGg9IjYwIiAgIGhlaWdodD0iNjAiICAgdmVyc2lvbj0iMS4xIiAgIHZpZXdCb3g9IjAgMCA2MCA2MCIgICBpZD0ic3ZnNTQzNCIgICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkxK2RldmVsK29zeG1lbnUgcjEyOTExIiAgIHNvZGlwb2RpOmRvY25hbWU9Imwtci5zdmciPiAgPG1ldGFkYXRhICAgICBpZD0ibWV0YWRhdGE1NDQ0Ij4gICAgPHJkZjpSREY+ICAgICAgPGNjOldvcmsgICAgICAgICByZGY6YWJvdXQ9IiI+ICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4gICAgICAgIDxkYzp0eXBlICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+ICAgICAgPC9jYzpXb3JrPiAgICA8L3JkZjpSREY+ICA8L21ldGFkYXRhPiAgPGRlZnMgICAgIGlkPSJkZWZzNTQ0MiIgLz4gIDxzb2RpcG9kaTpuYW1lZHZpZXcgICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIgICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IiAgICAgYm9yZGVyb3BhY2l0eT0iMSIgICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiICAgICBncmlkdG9sZXJhbmNlPSIxMCIgICAgIGd1aWRldG9sZXJhbmNlPSIxMCIgICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIgICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTI4NiIgICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9Ijc1MSIgICAgIGlkPSJuYW1lZHZpZXc1NDQwIiAgICAgc2hvd2dyaWQ9InRydWUiICAgICBpbmtzY2FwZTp6b29tPSI0IiAgICAgaW5rc2NhcGU6Y3g9IjI1Ljg4OTgzMSIgICAgIGlua3NjYXBlOmN5PSIzNC4zODE4MzMiICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIgICAgIGlua3NjYXBlOndpbmRvdy15PSIyMyIgICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjAiICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmc1NDM0IiAgICAgaW5rc2NhcGU6b2JqZWN0LW5vZGVzPSJ0cnVlIiAgICAgaW5rc2NhcGU6c25hcC1zbW9vdGgtbm9kZXM9InRydWUiPiAgICA8aW5rc2NhcGU6Z3JpZCAgICAgICB0eXBlPSJ4eWdyaWQiICAgICAgIGlkPSJncmlkNTk4OSIgLz4gIDwvc29kaXBvZGk6bmFtZWR2aWV3PiAgPHBhdGggICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjFweDtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2Utb3BhY2l0eToxIiAgICAgZD0iTSAyNSAyNCBMIDE2IDMwIEwgMjUgMzYgTCAyNSAyNCB6IE0gMzUgMjQgTCAzNSAzNiBMIDQ0IDMwIEwgMzUgMjQgeiAiICAgICBpZD0icGF0aDU5OTUiIC8+PC9zdmc+);
  box-shadow: inset 0 0 0 2px #fff;
}

.compareMode {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
*/
