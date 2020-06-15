import React from 'react';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import styles from './customer-select-menu.module.css';

const CustomerSelectMenu = ({ userCustomers, setSelectedCustomer, setCustomerSelectMenu }) => {
  const handleClick = customer => {
    setSelectedCustomer(customer);
    setCustomerSelectMenu(false);
  };

  return (
    <div className={styles.buttonContainer}>
      {userCustomers.map(customer => (
        <Button key={customer.name} onClick={() => handleClick(customer)}>
          {customer.title}
        </Button>
      ))}
    </div>
  );
};

export default CustomerSelectMenu;
