import React, { useRef } from 'react';
import ReactDOM from 'react-dom';

import CloseButton from '@astrosat/astrosat-ui/dist/buttons/close-button';
import InfoButton from '@astrosat/astrosat-ui/dist/buttons/info-button';
import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Switch from '@astrosat/astrosat-ui/dist/buttons/switch';

import styles from './data-layers-dialog.module.css';

const DataLayersDialog = ({ isVisible, close, title }, ref) => {
  const overlayRef = useRef(null);
  console.log('is VISIBLE: ', isVisible, ref.current);

  return isVisible && ref.current
    ? ReactDOM.createPortal(
        <div
          className={styles.modal}
          onClick={event => {
            if (overlayRef.current === event.target) {
              close();
            }
          }}
          ref={overlayRef}
        >
          <div className={styles.dialog} tabIndex={-1} role="dialog" aria-label="Data Layer dialog">
            <div className={styles.content}>
              <div className={styles.categories}>
                <div className={styles.header}>
                  <h3 className={styles.title}>Select Your Categories</h3>
                </div>

                <div className={styles.content}>
                  <ul>
                    <li>TropoSphere</li>
                    <li>TropoSphere</li>
                    <li>TropoSphere</li>
                    <li>TropoSphere</li>
                  </ul>
                </div>
              </div>

              <div className={styles.subcategories}>
                <div className={styles.header}>
                  <h3 className={styles.title}>Select Your subcategories</h3>
                  <CloseButton onClick={close} ariaLabel="Close" />
                </div>

                <div className={`${styles.content} ${styles.subcategoryOptions}`}>
                  <ul>
                    <li className={styles.row}>
                      <Switch
                        name="layer1"
                        value="layer1"
                        label="Layer One"
                        onClick={() => console.log('Layer One Selected')}
                        ariaLabel="Layer One"
                      />

                      <InfoButton onClick={() => console.log('Info Clicked')} />
                    </li>
                    <li className={styles.row}>
                      <Switch
                        name="layer2"
                        value="layer2"
                        label="Layer Two"
                        onClick={() => console.log('Layer Two Selected')}
                        ariaLabel="Layer Two"
                      />

                      <InfoButton onClick={() => console.log('Info Clicked')} />
                    </li>
                    <li className={styles.row}>
                      <Switch
                        name="layer3"
                        value="layer3"
                        label="Layer Three"
                        onClick={() => console.log('Layer Three Selected')}
                        ariaLabel="Layer Three"
                      />

                      <InfoButton onClick={() => console.log('Info Clicked')} />
                    </li>
                    <li className={styles.row}>
                      <Switch
                        name="layer4"
                        value="layer4"
                        label="Layer Four"
                        onClick={() => console.log('Layer Four Selected')}
                        ariaLabel="Layer Four"
                      />

                      <InfoButton onClick={() => console.log('Info Clicked')} />
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.buttons}>
              <Button theme="primary" onClick={() => console.log('Add Category')}>
                Add
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
};

export default React.memo(React.forwardRef(DataLayersDialog));
