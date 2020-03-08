import React, { useState, useEffect, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { searchSatellites } from './satellites.actions';

import Detail from '@astrosat/astrosat-ui/dist/containers/detail';
import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import InfoButton from '@astrosat/astrosat-ui/dist/buttons/info-button';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';
import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import { RESULTS } from './satellites-panel.component';
import SavedSearchList from './saved-search-list.component';

import useMap from '../map/use-map.hook';
import { fetchSavedSatellites, setCurrentSearchQuery } from './satellites.actions';

import { ReactComponent as InfoIcon } from './info.svg';
import { ReactComponent as DrawAoiIcon } from './draw-aoi.svg';

import styles from './search.module.css';
import sideMenuStyles from '../side-menu/side-menu.module.css';

const DATE_FORMAT = 'yyy-MM-dd';
const dateFormat = 'd MMM yyy';

const AOI_DRAW_MODE = 'RectangleMode';
const BBOX_NO_OF_POINTS = 5;

const resolutions = [
  {
    id: 'free',
    label: 'Free images',
    description: 'Some text describing the FREE images'
  },
  {
    id: 'mid',
    label: 'Mid-resolution',
    description: 'Some text describing the MID-RES images'
  },
  {
    id: 'high',
    label: 'High-resolution',
    description: 'Some text describing the HIGH-RES images'
  }
];

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <button className={styles.picker} onClick={onClick}>
    {value}
  </button>
));

// const initialState = {
//   selectedSatellites: [],
//   startDate: new Date(),
//   endDate: new Date(),
//   isInfoVisible: false,
//   info: null,
//   selectedSearch: {}
// };

// const SET_SELECTED_SATELLITES = 'SET_SELECTED_SATELLITES';
// const SET_START_DATE = 'SET_START_DATE';
// const SET_END_DATE = 'SET_END_DATE';
// const SET_IS_INFO_VISIBLE = 'SET_IS_INFO_VISIBLE';
// const SET_INFO = 'SET_INFO';
// const SET_SELECTED_SEARCH = 'SET_SELECTED_SEARCH';

// const reducer = (state, action) => {
//   switch (action.type) {
//     case SET_SELECTED_SATELLITES:
//       return { ...state, selectedSatellites: action.payload };
//     case SET_START_DATE:
//       return { ...state, startDate: action.payload };
//     case SET_END_DATE:
//       return { ...state, endDate: action.payload };
//     case SET_IS_INFO_VISIBLE:
//       return { ...state, isInfoVisible: action.payload };
//     case SET_INFO:
//       return { ...state, info: action.payload };
//     case SET_SELECTED_SEARCH:
//       return { ...state, selectedSearch: action.payload };
//     default:
//       throw new Error('Unknown Action Type: ', action.type);
//   }
// };

const Search = ({ satellites, setVisiblePanel, map }) => {
  const globalDispatch = useDispatch();
  const [selectedSatellites, setSelectedSatellites] = useState([]);
  const [startDate, setStartDate] = useState(new Date('2019-12-22'));
  const [endDate, setEndDate] = useState(new Date('2019-12-23'));
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [info, setInfo] = useState(null);
  const savedSearches = useSelector(state => state.satellites.satelliteSearches);
  const [selectedResolutions, setSelectedResolutions] = useState([]);
  const [isSatelliteMoreInfoDialogVisible, toggleSatelliteMoreInfoDialog] = useModal(false);
  const [isResolutionMoreInfoDialogVisible, toggleResolutionMoreInfoDialog] = useModal(false);
  const ref = useRef(null);
  const [selectedSatelliteMoreInfo, setSelectedSatelliteMoreInfo] = useState(null);
  const [selectedResolutionMoreInfo, setSelectedResolutionMoreInfo] = useState(null);

  // const [state, dispatch] = useReducer(reducer, initialState);

  const [isAoiMode, setIsAoiMode] = useState(false);
  const [geometry, setGeometry] = useState(null);
  console.log('GEOMETRY STATE: ', isAoiMode, geometry);
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
            // console.log('SET GEOM: ', coordinates);
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
      globalDispatch(fetchSavedSatellites());
    }
  }, [savedSearches]);

  return (
    <div className={styles.search} ref={ref}>
      <div>
        <Detail title="Saved Searches">
          <SavedSearchList searches={savedSearches} />
        </Detail>
      </div>

      <div className={styles.filters}>
        <div>
          <h3>SEARCH</h3>

          <ul className={styles.satellites}>
            {satellites.map(satellite => (
              <li key={satellite.label} className={styles.satellite}>
                <Checkbox
                  name={satellite.id}
                  // value="true"
                  // checked={satellite.label === 'Sentinel-2' ? true : false}
                  label={satellite.label}
                  onChange={() => {
                    const result = selectedSatellites.find(sat => sat.label === satellite.label);

                    if (result) {
                      // Remove from selected list
                      setSelectedSatellites(selectedSatellites.filter(sat => sat.label !== satellite.label));
                    } else {
                      // Add to selected list
                      setSelectedSatellites([...selectedSatellites, satellite]);
                    }
                  }}
                />

                <button
                  onClick={() => {
                    console.log('Selected SATELLITE: ', satellite);
                    setSelectedSatelliteMoreInfo({ id: 1, description: 'desc' });
                    toggleSatelliteMoreInfoDialog();
                  }}
                >
                  <InfoIcon className={styles.icon} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>TIME RANGE</h3>

          <div className={styles.options}>
            <DatePicker
              dateFormat={DATE_FORMAT}
              selected={startDate}
              onChange={date => setStartDate(date)}
              dateFormat={dateFormat}
              customInput={<CustomInput />}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
            <span> to </span>
            <DatePicker
              dateFormat={DATE_FORMAT}
              selected={endDate}
              onChange={date => setEndDate(date)}
              dateFormat={dateFormat}
              customInput={<CustomInput />}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </div>
        </div>

        <div>
          <h3>Resolution</h3>

          <ul className={styles.resolutions}>
            {resolutions.map(resolution => {
              return (
                <li className={styles.resolution} key={resolution.id}>
                  <Checkbox
                    name={resolution.id}
                    // value={values.resolution || resolution.label}
                    label={resolution.label}
                    // onChange={handleChange}
                    // checked={state.selectedSearch.resolutions.includes(res.id)}
                    onChange={event => {
                      // console.log('CHECKBOX EVENT: ', event);
                      const result = selectedResolutions.find(res => res.id === resolution.id);

                      if (result) {
                        // Remove from selected list
                        setSelectedResolutions(selectedResolutions.filter(res => res.id !== resolution.id));
                      } else {
                        // Add to selected list
                        setSelectedResolutions([...selectedResolutions, resolution]);
                      }
                    }}
                  />

                  <button
                    // onBlur={() => dispatch({ type: SET_IS_INFO_VISIBLE, payload: false })}
                    onClick={() => {
                      setSelectedResolutionMoreInfo({ id: 1, description: 'desc' });
                      toggleResolutionMoreInfoDialog();
                      // dispatch({ type: SET_INFO, payload: resolution });
                      // dispatch({ type: SET_IS_INFO_VISIBLE, payload: !state.isInfoVisible });
                    }}
                  >
                    <InfoIcon className={styles.icon} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <div className={styles.noSavedSearches}>
            <p>There are no saved AOI yet</p>
            <div className={styles.drawAOI} onClick={() => setIsAoiMode(true)}>
              <DrawAoiIcon className={styles.drawAOIIcon} />
              <Button theme="link" classNames={[styles.AOIButton]}>
                Draw AOI
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={sideMenuStyles.buttons}>
        <Button
          theme="primary"
          classNames={[sideMenuStyles.button]}
          onClick={() => {
            globalDispatch(
              setCurrentSearchQuery({
                satellites: selectedSatellites,
                startDate,
                endDate,
                resolutions: selectedResolutions,
                geometry
              })
            );
            globalDispatch(searchSatellites(selectedSatellites, startDate, endDate));
            setVisiblePanel(RESULTS);
          }}
        >
          Search
        </Button>
        <Button
          classNames={[sideMenuStyles.button]}
          theme="tertiary"
          onClick={() => console.log('Task Satellite Button Clicked')}
        >
          Task Satellite
        </Button>
      </div>
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
