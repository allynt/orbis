import React from 'react';

import styles from './order.module.css';

const Order = () => (
  <>
    <p className={styles.p}>
      This Order Form (&quot;Order Form&quot;) is between{' '}
      <b>STEVENSON ASTROSAT LIMITED</b> a company incorporated in Scotland
      (Number SC423073) and whose Registered Office is at Copernicus Kirk, 200
      High Street, Musselburgh EH21 7DX and you, (
      <b>&quot;the Customer&quot;</b>) and relates to our Terms and Conditions
      which you have accepted (<b>the &quot;Agreement&quot;</b>)
    </p>
    <p className={styles.p}>
      This is a Click to Agree Contract from within the Orbis Software if the
      Customer wishes to be bound by this Order Form, the Customer must click to
      accept this Order Form. If the Customer does not agree to be bound by this
      Order Form, the Customer cannot order or use any Subscription Services or
      any Professional Services. The Customer must be at least 18 years old to
      order Subscription Services.
    </p>
    <p className={styles.p}>
      The parties hereby agree as follows:
      <ol className={styles.ol}>
        <li className={styles.li}>
          Order Form. This document constitutes an &quot;Order Form&quot; under
          the Agreement, and this Order Form and the Subscription Services and
          Professional Services contemplated herein are subject to the terms and
          provisions of the Agreement.
        </li>
        <li className={styles.li}>
          In this Order Form, unless specified otherwise, words and phrases
          shall have the same meanings as those in the Agreement.
        </li>
      </ol>
    </p>
    <h1 className={styles.h1}>Subscription Services</h1>
    <ol className={styles.ol}>
      <li className={styles.li}>
        Number of Users: 10 licenses that give access to the Orbis platform
        distributable at the discretion of the Customer.
      </li>
      <li className={styles.li}>
        Fees: These Services are being offered for free within the Subscription
        Term with costs subsidised by Astrosat and the European Space Agency.
      </li>
      <li className={styles.li}>
        Subscription Term: Access to the Orbis platform until the 30th April
        2021
      </li>
    </ol>
  </>
);

export default Order;
