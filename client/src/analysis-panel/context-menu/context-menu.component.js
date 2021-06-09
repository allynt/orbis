import React, { useState } from 'react';

import {
  IconButton as AuiIconButton,
  Menu,
  MenuItem,
  OptionsIcon,
  styled,
} from '@astrosat/astrosat-ui';

import apiClient from 'api-client';

const IconButton = styled(AuiIconButton)({ position: 'absolute', right: 0 });

/**
 * @param {{
 *  defaultOpen?: boolean
 *  onDownloadPdfClick: () => void
 *  pdfIncompatible?: boolean
 * }} props
 */
export const ContextMenu = ({
  defaultOpen = false,
  onDownloadPdfClick,
  pdfIncompatible,
}) => {
  const [anchorEl, setAnchorEl] = useState(defaultOpen ? document.body : null);

  const handleDownloadPdfClick = () => {
    setAnchorEl(null);
    onDownloadPdfClick && onDownloadPdfClick();
  };

  const handleUserGuideClick = () => {
    const win = window.open(
      apiClient.documents.userGuideUrl('analysis-toolbar'),
      '_blank',
      'noopener, noreferrer',
    );
    win.focus();
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={event => setAnchorEl(event.currentTarget)}
      >
        <OptionsIcon titleAccess="Context Menu" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem role="link" onClick={handleUserGuideClick}>
          User Guide
        </MenuItem>
        {!pdfIncompatible ? (
          <MenuItem onClick={handleDownloadPdfClick}>Download PDF</MenuItem>
        ) : null}
      </Menu>
    </>
  );
};
