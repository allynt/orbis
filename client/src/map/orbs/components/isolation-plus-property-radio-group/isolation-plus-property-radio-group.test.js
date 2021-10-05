import React from 'react';

import { setOther, SHARED_STATE_KEY } from 'map/orbs/layers.slice';
import { render, screen, userEvent } from 'test/test-utils';

import { IsolationPlusPropertyRadioGroup } from './isolation-plus-property-radio-group.component';

describe('<IsolationPlusPropertyRadioGroup />', () => {
  it('renders a radio for each property group', () => {
    const selectedLayer = {
      metadata: {
        properties: [
          { name: 'property1', property_group: '1', label: 'Group 1' },
          { name: 'property2', property_group: '1' },
          { name: 'property3', label: 'Property 2' },
        ],
      },
    };

    render(<IsolationPlusPropertyRadioGroup selectedLayer={selectedLayer} />);

    expect(screen.getByRole('radio', { name: 'Group 1' })).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: 'Property 2' }),
    ).toBeInTheDocument();
  });

  it(`dispatches the ${setOther} action with the selected property when the property changes`, () => {
    const dispatch = jest.fn();
    const property = { name: 'property1' };

    const selectedLayer = {
      authority: 'test',
      namespace: 'layer',
      metadata: { properties: [property] },
    };

    render(
      <IsolationPlusPropertyRadioGroup
        selectedLayer={selectedLayer}
        dispatch={dispatch}
      />,
    );

    userEvent.click(screen.getByRole('radio'));
    expect(dispatch).toBeCalledWith(
      setOther(expect.objectContaining({ other: { property } })),
    );
  });

  it(`dispatches set other with property as null if the selected property is clicked`, () => {
    const dispatch = jest.fn();
    const property = { name: 'property1' };

    const selectedLayer = {
      authority: 'test',
      namespace: 'layer',
      source_id: 'test/layer',
      metadata: { properties: [property] },
    };

    const state = {
      orbs: {
        layers: {
          [SHARED_STATE_KEY]: {
            other: { property: { ...property, source_id: 'test/layer' } },
          },
        },
      },
    };

    render(
      <IsolationPlusPropertyRadioGroup
        selectedLayer={selectedLayer}
        dispatch={dispatch}
      />,
      { state },
    );

    userEvent.click(screen.getByRole('radio'));
    expect(dispatch).toBeCalledWith(
      setOther(expect.objectContaining({ other: { property: {} } })),
    );
  });
});
