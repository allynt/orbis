import * as React from 'react';

import { setVisibility } from 'map/orbs/layers.slice';
import { render, screen, userEvent } from 'test/test-utils';

import { LayerVisibilityCheckbox } from './layer-visibility-checkbox.component';

const LAYER = { source_id: 'test/layer/1', metadata: { label: 'Test Layer' } };

describe('<LayerVisibilityCheckbox />', () => {
  let state;
  let selectedLayer;
  let dispatch;
  let icon = undefined;
  let info = undefined;

  beforeEach(() => {
    state = {};
    selectedLayer = LAYER;
    dispatch = jest.fn();
  });

  it('shows a checkbox for the selected layer', () => {
    render(
      <LayerVisibilityCheckbox
        selectedLayer={selectedLayer}
        dispatch={dispatch}
        icon={icon}
        info={info}
      />,
      { state },
    );

    expect(
      screen.getByRole('checkbox', { name: LAYER.metadata.label }),
    ).toBeInTheDocument();
  });

  it(`Dispatches the ${setVisibility.type} action on click`, () => {
    render(
      <LayerVisibilityCheckbox
        selectedLayer={selectedLayer}
        dispatch={dispatch}
        icon={icon}
        info={info}
      />,
      { state },
    );

    userEvent.click(screen.getByRole('checkbox'));
    expect(dispatch).toHaveBeenCalledWith(
      setVisibility(expect.objectContaining({ key: LAYER.source_id })),
    );
  });

  it('Shows an icon if provided', () => {
    render(
      <LayerVisibilityCheckbox
        selectedLayer={selectedLayer}
        dispatch={dispatch}
        icon="PicnicSite"
        info={info}
      />,
      { state },
    );

    expect(screen.getByRole('img', { name: 'PicnicSite' })).toBeInTheDocument();
  });

  it('Shows an info icon if info prop is supplied', () => {
    render(
      <LayerVisibilityCheckbox
        selectedLayer={selectedLayer}
        dispatch={dispatch}
        icon="PicnicSite"
        info="hello"
      />,
      { state },
    );

    expect(screen.getByRole('button', { name: 'Info' })).toBeInTheDocument();
  });
});
