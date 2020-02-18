import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { searchSatellites } from './satellites.actions';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import InfoButton from '@astrosat/astrosat-ui/dist/buttons/info-button';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';

import { RESULTS } from './satellites-panel.component';

import { ReactComponent as InfoIcon } from './info.svg';

import styles from './search.module.css';
import sideMenuStyles from '../side-menu/side-menu.module.css';

const DATE_FORMAT = 'yyy-MM-dd';
const dateFormat = 'd MMM yyy';

const InfoBox = ({ info }) => <div className={styles.infoBox}>{info}</div>;

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <button className={styles.picker} onClick={onClick}>
    {value}
  </button>
));

const Search = ({ satellites, setVisiblePanel }) => {
  const dispatch = useDispatch();
  const [selectedSatellites, setSelectedSatellites] = useState([]);
  const [startDate, setStartDate] = useState(new Date('2019-12-22'));
  const [endDate, setEndDate] = useState(new Date('2019-12-23'));
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [info, setInfo] = useState(null);

  return (
    <div className={styles.search}>
      <div className={styles.filters}>
        <div>
          <h3>SEARCH</h3>

          <ul className={styles.satellites}>
            {satellites.map(satellite => (
              <li key={satellite.label} className={styles.satellite}>
                <Checkbox
                  name="satellite"
                  value="true"
                  checked={satellite.label === 'Sentinel-2' ? true : false}
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

                {isInfoVisible && info.label === satellite.label && <InfoBox info={satellite.description} />}
                <button
                  onClick={() => {
                    setIsInfoVisible(!isInfoVisible);
                    setInfo(satellite);
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
      </div>

      <div className={sideMenuStyles.buttons}>
        <Button
          theme="primary"
          classNames={[sideMenuStyles.button]}
          onClick={() => {
            dispatch(searchSatellites(selectedSatellites, startDate, endDate));
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
    </div>
  );
};

Search.propTypes = {};

export default Search;
