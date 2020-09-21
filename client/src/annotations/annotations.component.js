import React, { useState } from 'react';

import { Button, AnnotationsIcon } from '@astrosat/astrosat-ui';

import AnnotationsPanel from './annotations-panel.component';

import styles from './annotations.module.css';

const Annotations = ({ map }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.annotations}>
      <Button shape="round" onClick={() => setIsOpen(!isOpen)}>
        <AnnotationsIcon className={styles.icon} />
      </Button>

      {isOpen && <AnnotationsPanel map={map} />}
    </div>
  );
};

export default Annotations;
