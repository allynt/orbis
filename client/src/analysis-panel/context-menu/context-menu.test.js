import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ContextMenu } from './context-menu.component';

describe('<ContextMenu />', () => {
  it('Opens when the button is clicked', () => {
    const { getByRole } = render(<ContextMenu />);
    userEvent.click(getByRole('button'));
    expect(getByRole('link', { name: 'User Guide' })).toBeInTheDocument();
    expect(getByRole('menuitem', { name: 'Download PDF' })).toBeInTheDocument();
  });

  it('Closes when Download PDF is clicked', () => {
    const { getByRole, queryByRole } = render(<ContextMenu defaultOpen />);
    userEvent.click(getByRole('menuitem', { name: 'Download PDF' }));
    expect(
      queryByRole('menuitem', { name: 'Download PDF' }),
    ).not.toBeInTheDocument();
  });

  it('Closes when User Guide is clicked', () => {
    const focus = jest.fn();
    window.open = jest.fn(() => ({ focus }));
    const { getByRole, queryByRole } = render(<ContextMenu defaultOpen />);
    userEvent.click(getByRole('link', { name: 'User Guide' }));
    expect(
      queryByRole('menuitem', { name: 'User Guide' }),
    ).not.toBeInTheDocument();
    expect(focus).toBeCalled();
  });

  it("Doesn't show the Download PDF option if pdfIncompatible", () => {
    const { queryByRole } = render(<ContextMenu defaultOpen pdfIncompatible />);
    expect(
      queryByRole('menuitem', { name: 'Download PDF' }),
    ).not.toBeInTheDocument();
  });

  it('Calls onDownloadPdfClick when PDF option is clicked', () => {
    const onDownloadPdfClick = jest.fn();
    const { getByRole } = render(
      <ContextMenu defaultOpen onDownloadPdfClick={onDownloadPdfClick} />,
    );
    userEvent.click(getByRole('menuitem', { name: 'Download PDF' }));
    expect(onDownloadPdfClick).toBeCalled();
  });
});
