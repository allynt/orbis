import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Toolbar from './toolbar.component';

const renderComponent = (user, items) => render(<Toolbar user={user} items={items} />);

describe('Toolbar Component', () => {
  describe('onClick', () => {
    describe('top items', () => {
      let action = null;
      let items = null;
      let user = null;

      beforeEach(() => {
        action = jest.fn();
        items = [{ label: 'test', action, roles: ['UserRole'] }];
        user = {
          roles: ['UserRole'],
        };
      });

      it('should run the item action when clicked', () => {
        const { getByTestId } = renderComponent(user, items);

        fireEvent.click(getByTestId('toolbar-item-test'));
        expect(action).toBeCalled();
      });

      it('should add the selected class', () => {
        const { getByTestId } = renderComponent(user, items);
        fireEvent.click(getByTestId('toolbar-item-test'));
        expect(getByTestId('toolbar-item-test')).toHaveClass('active');
      });
    });

    describe('footer items', () => {
      let action = null;
      let items = null;
      let user = null;

      beforeEach(() => {
        action = jest.fn();
        items = [{ label: 'test', action, roles: ['UserRole'], footer: true }];
        user = {
          roles: ['UserRole'],
        };
      });
      it('should run the item action when clicked', () => {
        const { getByTestId } = renderComponent(user, items);

        fireEvent.click(getByTestId('toolbar-item-test'));
        expect(action).toBeCalled();
      });

      it('should add the selected class', () => {
        const { getByTestId } = renderComponent(user, items);

        fireEvent.click(getByTestId('toolbar-item-test'));
        expect(getByTestId('toolbar-item-test')).toHaveClass('active');
      });
    });
  });
});
