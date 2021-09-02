import { controlPanelReducer } from './control-panel.component';

describe('controlPanelReducer', () => {
  describe('SET_PANEL', () => {
    it('Sets the panel, heading, strapline, and open state if not open', () => {
      const result = controlPanelReducer(
        { open: false },
        {
          type: 'SET_PANEL',
          panel: 'Test',
          heading: 'Test Heading',
          strapline: 'This is the test strapline',
        },
      );
      expect(result).toEqual({
        panel: 'Test',
        heading: 'Test Heading',
        strapline: 'This is the test strapline',
        open: true,
      });
    });

    it('Sets the panel, heading, strapline, and open state if already open', () => {
      const result = controlPanelReducer(
        {
          panel: 'Test',
          heading: 'Test Heading',
          strapline: 'This is the test strapline',
          open: true,
        },
        {
          type: 'SET_PANEL',
          panel: 'Other',
          heading: 'Other Heading',
          strapline: 'This is the other strapline',
        },
      );
      expect(result).toEqual({
        panel: 'Other',
        heading: 'Other Heading',
        strapline: 'This is the other strapline',
        open: true,
      });
    });

    it("Closes the panel if it's the current panel being set", () => {
      const result = controlPanelReducer(
        { open: true, panel: 'Test' },
        { type: 'SET_PANEL', panel: 'Test' },
      );
      expect(result).toEqual(expect.objectContaining({ open: false }));
    });
  });

  describe('CLOSE_PANEL', () => {
    it('Closes the panel', () => {
      const result = controlPanelReducer(
        {
          panel: 'Test',
          heading: 'Test Heading',
          strapline: 'This is the test strapline',
          open: true,
        },
        { type: 'CLOSE_PANEL' },
      );
      expect(result).toEqual(expect.objectContaining({ open: false }));
    });
  });
});
