import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { OrbSelect } from './orb-select.component';

const setup = selectedDomain => {
  const handleOrbClick = jest.fn();
  const orbs = [
    { name: 'domain-one' },
    { name: 'domain-two' },
    { name: 'domain-three' },
  ];
  const utils = render(
    <OrbSelect
      orbs={orbs}
      selectedOrbName={selectedDomain}
      onOrbClick={handleOrbClick}
    />,
  );
  return {
    ...utils,
    domains: orbs,
    handleOrbClick,
  };
};

describe('OrbSelect', () => {
  it('should render the provided orb list', () => {
    const { getByRole, domains } = setup();
    for (let domain of domains) {
      expect(getByRole('button', { name: domain.name })).toBeInTheDocument();
    }
  });

  it('should call the handler function with the clicked domain on click', () => {
    const { handleOrbClick, getByRole, domains } = setup();
    fireEvent.click(getByRole('button', { name: 'domain-one' }));
    expect(handleOrbClick).toHaveBeenCalledWith(domains[0].name);
  });
});
