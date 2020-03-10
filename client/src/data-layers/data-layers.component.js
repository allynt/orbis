import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Detail from '@astrosat/astrosat-ui/dist/containers/detail';
import Slider from '@astrosat/astrosat-ui/dist/forms/slider';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import DataLayersDialog from './data-layers-dialog.component';

import { ReactComponent as RemoveIcon } from './remove.svg';
import { ReactComponent as ShowIcon } from './layer-visible.svg';
import { ReactComponent as HideIcon } from './layer-invisible.svg';
import { ReactComponent as AddNewCategoryIcon } from './add-more-categories.svg';

import { removeLayer } from './data-layers-dialog.actions';

import styles from './data-layers.module.css';

const DataLayers = () => {
  const [isVisible, toggle] = useModal(false);
  const ref = useRef(null);
  // console.log('IS VISIBLE: ', isVisible);
  const dispatch = useDispatch();
  const selectedLayers = useSelector(state => state.dataLayers.layers);
  console.log('SELECTED LAYERS: ', selectedLayers);

  return (
    <div className={styles.selectData} ref={ref}>
      <div className={styles.layers}>
        {selectedLayers.map(selectedLayer => {
          return (
            <Detail key={selectedLayer.name} title={selectedLayer.metadata.label}>
              <div>
                <h3>
                  Domain: <span className={styles.domain}>{selectedLayer.metadata.domain}</span>
                </h3>

                <Slider min={0} max={10} values={[1, 7]} onChange={() => console.log('Slider changed')} />

                <div className={styles.buttons}>
                  <Button
                    theme="primary"
                    classNames={[styles.button]}
                    onClick={() => console.log('Toggle Show/Hide Layer')}
                  >
                    <HideIcon className={styles.icon} />
                    {/* <ShowIcon className={styles.icon} /> */}
                  </Button>
                  <Button
                    theme="primary"
                    classNames={[styles.button]}
                    onClick={() => dispatch(removeLayer(selectedLayer))}
                  >
                    <RemoveIcon className={styles.icon} />
                  </Button>
                </div>
              </div>
            </Detail>
          );
        })}
      </div>

      <div className={styles.buttons}>
        <AddNewCategoryIcon className={styles.addNewCategoryIcon} onClick={toggle} />
        <Button theme="link" classNames={[styles.categoryButton]} onClick={toggle}>
          Add New Category
        </Button>
      </div>

      <DataLayersDialog isVisible={isVisible} title="Create New Map" close={toggle} ref={ref}></DataLayersDialog>
    </div>
  );
};

DataLayers.propTypes = {};

export default DataLayers;
