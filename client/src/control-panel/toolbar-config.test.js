import featureToggles from 'feature-toggles';

import { getToolbarItems } from './toolbar-config';
import {
  BOOKMARKS,
  DATA_LAYERS,
  PROFILE,
  SATELLITE_LAYERS,
  STORIES,
} from './toolbar-constants';

describe('useToolbarItems', () => {
  it('Includes the User Guide item', () => {
    expect(getToolbarItems(jest.fn(), {})).toContainEqual(
      expect.objectContaining({ label: 'User Guide' }),
    );
  });

  it.each([DATA_LAYERS, SATELLITE_LAYERS, BOOKMARKS, PROFILE])(
    'includes the %s item if the user has UserRole',
    label => {
      expect(
        getToolbarItems(jest.fn(), { roles: ['UserRole'] }),
      ).toContainEqual(expect.objectContaining({ label }));
    },
  );

  it('Includes the stories item if the feature toggle is enabled', () => {
    featureToggles.stories = true;
    expect(getToolbarItems(jest.fn(), { roles: ['UserRole'] })).toContainEqual(
      expect.objectContaining({ label: STORIES }),
    );
  });

  it('Includes the Admin item if the user is a MANAGER of any customer', () => {
    expect(
      getToolbarItems(jest.fn(), { customers: [{ type: 'MANAGER' }] }),
    ).toContainEqual(expect.objectContaining({ label: 'Admin' }));
  });
});
