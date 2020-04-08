import React, { useState } from 'react';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import styles from './terms-and-conditions.module.css';

const PRIVACY_POLICY = 'PRIVACY_POLICY';
const EULA = 'EULA';

const PrivacyPolicy = () => {
  return (
    <div className={styles.text}>
      <h1 className={styles.textHeader}>Privacy Policy</h1>
      <p className={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lobortis libero in nulla placerat, sed cursus
        tortor dictum. Sed blandit nisi pellentesque, finibus justo et, elementum ligula. Nullam congue egestas rutrum.
        Nullam id nulla convallis, tempor quam vitae, mattis nibh. Phasellus et consectetur ante, eget facilisis augue.
        Fusce sed laoreet nisi. Vestibulum posuere maximus nunc, a pellentesque mauris pellentesque quis. Sed vel cursus
        dui. Nam interdum eros ac venenatis interdum. Maecenas nisi risus, ultricies sit amet ante in, malesuada pretium
        nibh. Fusce lobortis arcu erat, sit amet sagittis velit rhoncus egestas. Quisque a enim non ante hendrerit
        blandit. Nam non ligula accumsan, vestibulum est et, volutpat libero. Fusce vel volutpat nisi, in convallis
        diam. Suspendisse accumsan dignissim enim, sed ullamcorper dui luctus ac. Donec sed massa laoreet, tincidunt
        arcu id, sodales sapien.
      </p>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>Title 1</h2>
        <p className={styles.description}>
          Nulla facilisi. Morbi a fringilla lectus. Sed nec posuere turpis. Phasellus pulvinar porta vulputate. Nulla id
          semper velit. Phasellus volutpat est suscipit, consectetur lorem at, eleifend sem. Vestibulum ligula tortor,
          venenatis a enim et, vehicula tincidunt sem. Nullam faucibus sem et arcu porta dictum. Fusce iaculis quam
          neque, sit amet pellentesque quam laoreet eu. Mauris sed convallis purus. In a placerat nibh. Ut sit amet
          tristique tortor, ac viverra risus. Duis a facilisis purus, eu viverra massa. Nunc ac nisi ipsum. Nulla sed
          magna sapien. Duis ultrices a justo ac pretium. Nam nibh magna, commodo et nisi nec, porttitor tincidunt
          tortor.
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>Title 2</h2>
        <p className={styles.description}>
          Nulla facilisi. Morbi a fringilla lectus. Sed nec posuere turpis. Phasellus pulvinar porta vulputate. Nulla id
          semper velit. Phasellus volutpat est suscipit, consectetur lorem at, eleifend sem. Vestibulum ligula tortor,
          venenatis a enim et, vehicula tincidunt sem. Nullam faucibus sem et arcu porta dictum. Fusce iaculis quam
          neque, sit amet pellentesque quam laoreet eu. Mauris sed convallis purus. In a placerat nibh. Ut sit amet
          tristique tortor, ac viverra risus. Duis a facilisis purus, eu viverra massa. Nunc ac nisi ipsum. Nulla sed
          magna sapien. Duis ultrices a justo ac pretium. Nam nibh magna, commodo et nisi nec, porttitor tincidunt
          tortor.
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>Title 3</h2>
        <p className={styles.description}>
          Nulla facilisi. Morbi a fringilla lectus. Sed nec posuere turpis. Phasellus pulvinar porta vulputate. Nulla id
          semper velit. Phasellus volutpat est suscipit, consectetur lorem at, eleifend sem. Vestibulum ligula tortor,
          venenatis a enim et, vehicula tincidunt sem. Nullam faucibus sem et arcu porta dictum. Fusce iaculis quam
          neque, sit amet pellentesque quam laoreet eu. Mauris sed convallis purus. In a placerat nibh. Ut sit amet
          tristique tortor, ac viverra risus. Duis a facilisis purus, eu viverra massa. Nunc ac nisi ipsum. Nulla sed
          magna sapien. Duis ultrices a justo ac pretium. Nam nibh magna, commodo et nisi nec, porttitor tincidunt
          tortor.
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>Title 4</h2>
        <p className={styles.description}>
          Nulla facilisi. Morbi a fringilla lectus. Sed nec posuere turpis. Phasellus pulvinar porta vulputate. Nulla id
          semper velit. Phasellus volutpat est suscipit, consectetur lorem at, eleifend sem. Vestibulum ligula tortor,
          venenatis a enim et, vehicula tincidunt sem. Nullam faucibus sem et arcu porta dictum. Fusce iaculis quam
          neque, sit amet pellentesque quam laoreet eu. Mauris sed convallis purus. In a placerat nibh. Ut sit amet
          tristique tortor, ac viverra risus. Duis a facilisis purus, eu viverra massa. Nunc ac nisi ipsum. Nulla sed
          magna sapien. Duis ultrices a justo ac pretium. Nam nibh magna, commodo et nisi nec, porttitor tincidunt
          tortor.
        </p>
      </div>
    </div>
  );
};

const EndUserLicenseAgreement = () => {
  return (
    <div className={styles.text}>
      <h1 className={styles.textHeader}>End User License Agreement</h1>
      <p className={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lobortis libero in nulla placerat, sed cursus
        tortor dictum. Sed blandit nisi pellentesque, finibus justo et, elementum ligula. Nullam congue egestas rutrum.
        Nullam id nulla convallis, tempor quam vitae, mattis nibh. Phasellus et consectetur ante, eget facilisis augue.
        Fusce sed laoreet nisi. Vestibulum posuere maximus nunc, a pellentesque mauris pellentesque quis. Sed vel cursus
        dui. Nam interdum eros ac venenatis interdum. Maecenas nisi risus, ultricies sit amet ante in, malesuada pretium
        nibh. Fusce lobortis arcu erat, sit amet sagittis velit rhoncus egestas. Quisque a enim non ante hendrerit
        blandit. Nam non ligula accumsan, vestibulum est et, volutpat libero. Fusce vel volutpat nisi, in convallis
        diam. Suspendisse accumsan dignissim enim, sed ullamcorper dui luctus ac. Donec sed massa laoreet, tincidunt
        arcu id, sodales sapien.
      </p>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>Title 1</h2>
        <p className={styles.description}>
          Nulla facilisi. Morbi a fringilla lectus. Sed nec posuere turpis. Phasellus pulvinar porta vulputate. Nulla id
          semper velit. Phasellus volutpat est suscipit, consectetur lorem at, eleifend sem. Vestibulum ligula tortor,
          venenatis a enim et, vehicula tincidunt sem. Nullam faucibus sem et arcu porta dictum. Fusce iaculis quam
          neque, sit amet pellentesque quam laoreet eu. Mauris sed convallis purus. In a placerat nibh. Ut sit amet
          tristique tortor, ac viverra risus. Duis a facilisis purus, eu viverra massa. Nunc ac nisi ipsum. Nulla sed
          magna sapien. Duis ultrices a justo ac pretium. Nam nibh magna, commodo et nisi nec, porttitor tincidunt
          tortor.
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>Title 2</h2>
        <p className={styles.description}>
          Nulla facilisi. Morbi a fringilla lectus. Sed nec posuere turpis. Phasellus pulvinar porta vulputate. Nulla id
          semper velit. Phasellus volutpat est suscipit, consectetur lorem at, eleifend sem. Vestibulum ligula tortor,
          venenatis a enim et, vehicula tincidunt sem. Nullam faucibus sem et arcu porta dictum. Fusce iaculis quam
          neque, sit amet pellentesque quam laoreet eu. Mauris sed convallis purus. In a placerat nibh. Ut sit amet
          tristique tortor, ac viverra risus. Duis a facilisis purus, eu viverra massa. Nunc ac nisi ipsum. Nulla sed
          magna sapien. Duis ultrices a justo ac pretium. Nam nibh magna, commodo et nisi nec, porttitor tincidunt
          tortor.
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>Title 3</h2>
        <p className={styles.description}>
          Nulla facilisi. Morbi a fringilla lectus. Sed nec posuere turpis. Phasellus pulvinar porta vulputate. Nulla id
          semper velit. Phasellus volutpat est suscipit, consectetur lorem at, eleifend sem. Vestibulum ligula tortor,
          venenatis a enim et, vehicula tincidunt sem. Nullam faucibus sem et arcu porta dictum. Fusce iaculis quam
          neque, sit amet pellentesque quam laoreet eu. Mauris sed convallis purus. In a placerat nibh. Ut sit amet
          tristique tortor, ac viverra risus. Duis a facilisis purus, eu viverra massa. Nunc ac nisi ipsum. Nulla sed
          magna sapien. Duis ultrices a justo ac pretium. Nam nibh magna, commodo et nisi nec, porttitor tincidunt
          tortor.
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>Title 4</h2>
        <p className={styles.description}>
          Nulla facilisi. Morbi a fringilla lectus. Sed nec posuere turpis. Phasellus pulvinar porta vulputate. Nulla id
          semper velit. Phasellus volutpat est suscipit, consectetur lorem at, eleifend sem. Vestibulum ligula tortor,
          venenatis a enim et, vehicula tincidunt sem. Nullam faucibus sem et arcu porta dictum. Fusce iaculis quam
          neque, sit amet pellentesque quam laoreet eu. Mauris sed convallis purus. In a placerat nibh. Ut sit amet
          tristique tortor, ac viverra risus. Duis a facilisis purus, eu viverra massa. Nunc ac nisi ipsum. Nulla sed
          magna sapien. Duis ultrices a justo ac pretium. Nam nibh magna, commodo et nisi nec, porttitor tincidunt
          tortor.
        </p>
      </div>
    </div>
  );
};

const TermsAndConditions = () => {
  const [info, setInfo] = useState(PRIVACY_POLICY);
  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <OrbisLogo className={styles.logo} />
      </div>
      <div className={styles.body}>
        <div className={styles.buttons}>
          <div>
            <Button
              theme="link"
              classNames={[`${styles.button} ${info !== PRIVACY_POLICY && styles.unselected}`]}
              onClick={() => setInfo(PRIVACY_POLICY)}
            >
              Privacy Policy
            </Button>
          </div>
          <div>
            <Button
              theme="link"
              classNames={[`${styles.button} ${info !== EULA && styles.unselected}`]}
              onClick={() => setInfo(EULA)}
            >
              End User License Agreement
            </Button>
          </div>
        </div>
        <div className={styles.infoContainer}>
          {info === PRIVACY_POLICY && <PrivacyPolicy />}
          {info === EULA && <EndUserLicenseAgreement />}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
