import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { OrbSelect } from './orb-select.component';

const setup = selectedDomain => {
  const handleDomainClick = jest.fn();
  const domains = [{ label: 'domain-one' }, { label: 'domain-two' }, { label: 'domain-three' }];
  const utils = render(
    <OrbSelect domains={domains} selectedDomain={selectedDomain} onDomainClick={handleDomainClick} />
  );
  return {
    ...utils,
    domains,
    handleDomainClick
  };
};

describe('OrbSelect', () => {
  it('should render the provided domain list', () => {
    const { getByTestId, domains } = setup();
    for (let domain of domains) {
      expect(getByTestId(`orb-select-${domain.label}`)).toBeInTheDocument();
      expect(getByTestId(`orb-select-${domain.label}`)).toHaveTextContent(domain.label);
    }
  });

  it('should provide all items with the selected class if no orb is selected', () => {
    const { getAllByRole } = setup();
    const listItems = getAllByRole('listitem');
    for (let item of listItems) {
      expect(item).toHaveClass('selected');
    }
  });

  it('should only give on item the selected class when an orb is selected', () => {
    const { getAllByRole } = setup({ label: 'domain-one' });
    const selectedListItems = getAllByRole('listitem').filter(item => item.classList.contains('selected'));
    expect(selectedListItems).toHaveLength(1);
  });

  it('should call the handler function with the clicked domain on click', () => {
    const { handleDomainClick, getByTestId, domains } = setup();
    fireEvent.click(getByTestId('orb-select-domain-one'));
    expect(handleDomainClick).toHaveBeenCalledWith(domains[0]);
  });
});
