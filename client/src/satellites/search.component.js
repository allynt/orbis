import React, { useState, useEffect, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import Detail from '@astrosat/astrosat-ui/dist/containers/detail';
import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import SavedSearchList from './saved-search-list.component';

import SatelliteSearchForm from './satellite-search-form.component';

import useMap from '../map/use-map.hook';
import { fetchSavedSatellites } from './satellites.actions';

import { ReactComponent as DrawAoiIcon } from './draw-aoi.svg';

import styles from './search.module.css';
import sideMenuStyles from '../side-menu/side-menu.module.css';

const AOI_DRAW_MODE = 'RectangleMode';
const BBOX_NO_OF_POINTS = 5;

const Search = ({ satellites, setVisiblePanel, map }) => {
  const dispatch = useDispatch();

  const [geometry, setGeometry] = useState(null);

  const savedSearches = useSelector(state => state.satellites.satelliteSearches);

  const ref = useRef(null);
  const [isSatelliteMoreInfoDialogVisible, toggleSatelliteMoreInfoDialog] = useModal(false);
  const [isResolutionMoreInfoDialogVisible, toggleResolutionMoreInfoDialog] = useModal(false);
  const [selectedSatelliteMoreInfo, setSelectedSatelliteMoreInfo] = useState(null);
  const [selectedResolutionMoreInfo, setSelectedResolutionMoreInfo] = useState(null);

  const [isAoiMode, setIsAoiMode] = useState(false);

  useMap(
    map,
    mapInstance => {
      const drawCtrl = mapInstance._controls.find(ctrl => ctrl.changeMode);
      if (drawCtrl && isAoiMode) {
        // console.log('Enable Draw Mode');
        // Delete any existing AOI polygon.
        drawCtrl.deleteAll();
        // Enable draw mode
        drawCtrl.changeMode(AOI_DRAW_MODE, {});
      }
      return () => {
        // Reset local state variable.
        setIsAoiMode(false);
      };
    },
    [isAoiMode]
  );

  useEffect(() => {
    let drawCtrl = null;
    if (map) {
      // Get the map's bbox from the bounds.
      const bounds = map.getBounds();
      const northWestCoord = bounds.getNorthWest();
      const northEastCoord = bounds.getNorthEast();
      const southEastCoord = bounds.getSouthEast();
      const southWestCoord = bounds.getSouthWest();
      const geometry = [
        [northWestCoord.lng, northWestCoord.lat],
        [northEastCoord.lng, northEastCoord.lat],
        [southEastCoord.lng, southEastCoord.lat],
        [southWestCoord.lng, southWestCoord.lat],
        [northWestCoord.lng, northWestCoord.lat]
      ];

      setGeometry(geometry);

      drawCtrl = map._controls.find(ctrl => ctrl.changeMode);
    }

    if (drawCtrl) {
      map.on('draw.create', () => {
        const feature = drawCtrl.getAll().features[0];
        // Only set the geometry for Satellite Search AOI features.
        if (feature && feature.properties.drawType === 'AOI') {
          const coordinates = feature.geometry.coordinates;
          if (coordinates[0].length === BBOX_NO_OF_POINTS) {
            setGeometry(coordinates);
          }
        }
      });
      // Remove any drawn polygons when changing view
      return () => drawCtrl.deleteAll();
    }
  }, []);

  useEffect(() => {
    if (!savedSearches) {
      dispatch(fetchSavedSatellites());
    }
  }, [savedSearches]);

  return (
    <div className={styles.search} ref={ref}>
      <div>
        {savedSearches ? (
          <div>
            <Detail title="Saved Searches">
              <SavedSearchList searches={savedSearches} />
            </Detail>
          </div>
        ) : (
          <p>There are no saved AOI yet</p>
        )}

        <div className={styles.noSavedSearches}>
          <div className={styles.drawAOI} onClick={() => setIsAoiMode(true)}>
            <DrawAoiIcon className={styles.drawAOIIcon} />
            <Button theme="link" classNames={[styles.AOIButton]}>
              Draw AOI
            </Button>
          </div>
        </div>
      </div>

      <SatelliteSearchForm
        satellites={satellites}
        geometry={geometry}
        setVisiblePanel={setVisiblePanel}
        setSelectedSatelliteMoreInfo={setSelectedSatelliteMoreInfo}
        toggleSatelliteMoreInfoDialog={toggleSatelliteMoreInfoDialog}
        setSelectedResolutionMoreInfo={setSelectedResolutionMoreInfo}
        toggleResolutionMoreInfoDialog={toggleResolutionMoreInfoDialog}
      />
      <Button
        classNames={[sideMenuStyles.button]}
        theme="tertiary"
        onClick={() => console.log('Task Satellite Button Clicked')}
      >
        Task Satellite
      </Button>

      <Dialog
        isVisible={isSatelliteMoreInfoDialogVisible}
        title="Satellite Info"
        close={toggleSatelliteMoreInfoDialog}
        ref={ref}
      >
        <div>
          <h3>Satellite More Info</h3>
          <table className={styles.moreInfoContent}>
            <thead>
              <tr>
                <th scope="col">Label</th>
                <th scope="col">Value</th>
              </tr>
            </thead>

            <tbody>
              {selectedSatelliteMoreInfo &&
                Object.keys(selectedSatelliteMoreInfo).map(key => {
                  return (
                    <tr key={key}>
                      <td>{key}:</td>
                      <td>{selectedSatelliteMoreInfo[key]}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Dialog>

      <Dialog
        isVisible={isResolutionMoreInfoDialogVisible}
        title="Resolution Info"
        close={toggleResolutionMoreInfoDialog}
        ref={ref}
      >
        <div>
          <h3>Resolution More Info</h3>
          <table className={styles.moreInfoContent}>
            <thead>
              <tr>
                <th scope="col">Label</th>
                <th scope="col">Value</th>
              </tr>
            </thead>

            <thead>
              {selectedResolutionMoreInfo &&
                Object.keys(selectedResolutionMoreInfo).map(key => {
                  return (
                    <tr key={key}>
                      <td>{key}:</td>
                      <td>{selectedResolutionMoreInfo[key]}</td>
                    </tr>
                  );
                })}
            </thead>
          </table>
        </div>
      </Dialog>
    </div>
  );
};

Search.propTypes = {};

export default Search;
