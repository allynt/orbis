import React from 'react';

import { Typography, Button, styled } from '@astrosat/astrosat-ui';

import CheckCircle from '@material-ui/icons/CheckCircle';

const iconSize = 'clamp(3rem, 10vw, 72px)';

const Container = styled('div')(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  gridTemplate: `repeat(3, max-content) / ${iconSize} 1fr`,
  gap: theme.spacing(2, 4),
}));

const Icon = styled(CheckCircle)(({ theme }) => ({
  fontSize: iconSize,
  color: theme.palette.success.main,
  gridColumn: '1 / 2',
  gridRow: '1 / -1',
}));

const Paragraph = styled(Typography)({ textAlign: 'center', maxWidth: '50ch' });

/**
 * @param {{
 *  onOkClick: React.MouseEventHandler<HTMLButtonElement>
 * }} props
 */
const Success = ({ onOkClick }) => (
  <Container>
    <Icon />
    <Typography variant="h2" component="h1">
      Upload successful!
    </Typography>
    <Paragraph>
      Your data is being processed, once done it will be saved to: My Data / My
      Datasets
    </Paragraph>
    <Button onClick={onOkClick}>Ok</Button>
  </Container>
);

export { Success };
