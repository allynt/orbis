import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import DataLayersDialog from './data-layers-dialog.component';

import styles from './data-layers.module.css';

const DataLayers = () => {
  const { isVisible, toggle } = useModal(false);
  const ref = useRef(null);
  // console.log('IS VISIBLE: ', isVisible);

  return (
    <div className={styles.selectData} ref={ref}>
      <Button shape="round" onClick={toggle}>
        +
      </Button>
      <Button theme="link" classNames={[styles.categoryButton]} onClick={toggle}>
        Add New Category
      </Button>

      <DataLayersDialog isVisible={isVisible} title="Create New Map" close={toggle} ref={ref}></DataLayersDialog>
    </div>
  );
};

DataLayers.propTypes = {};

export default DataLayers;
