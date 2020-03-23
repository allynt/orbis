import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Toolbar from './toolbar.component';

describe('Toolbar Component', () => {
  describe('onClick', () => {
    describe('top items', () => {
      it('should run the item action when clicked', () => {
        const action = jest.fn();
        const items = [{ label: 'test', action }];
        const { getByTestId } = render(<Toolbar items={items} />);
        fireEvent.click(getByTestId('toolbar-item-test'));
        expect(action).toBeCalled();
      });

      it('should add the selected class', () => {
        const items = [{ label: 'test', action: jest.fn() }];
        const { getByTestId } = render(<Toolbar items={items} />);
        fireEvent.click(getByTestId('toolbar-item-test'));
        expect(getByTestId('toolbar-item-test')).toHaveClass('active');
      });
    });

    describe('footer items', () => {
      it('should run the item action when clicked', () => {
        const action = jest.fn();
        const items = [{ label: 'test', action, footer: true }];
        const { getByTestId } = render(<Toolbar items={items} />);
        fireEvent.click(getByTestId('toolbar-item-test'));
        expect(action).toBeCalled();
      });

      it('should add the selected class', () => {
        const items = [{ label: 'test', action: jest.fn(), footer: true }];
        const { getByTestId } = render(<Toolbar items={items} />);
        fireEvent.click(getByTestId('toolbar-item-test'));
        expect(getByTestId('toolbar-item-test')).toHaveClass('active');
      });
    });
  });
});
