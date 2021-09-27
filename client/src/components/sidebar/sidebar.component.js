import React from 'react';

import { List, styled } from '@astrosat/astrosat-ui';

export const SidebarBottomItems = styled('div')({ marginTop: 'auto' });

const Nav = styled('nav')(({ theme }) => ({
  height: '100vh',
  width: 'fit-content',
  paddingBottom: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,
  borderRight: `2px solid ${theme.palette.primary.main}`,
  overflowX: 'hidden',
}));

const Logo = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
}));

const Header = styled('header')(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderTop: `solid 1px ${theme.palette.primary.main}`,
}));

const Items = styled(List)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  paddingLeft: '20%',
}));

const Footer = styled('footer')(({ theme }) => ({
  marginTop: 'auto',
  padding: theme.spacing(2, 1, 0),
}));

/**
 * @param {{
 *  children?: React.ReactNode
 *  className?: string
 *  footer?: React.ReactNode
 *  header?: React.ReactNode
 *  logo?: React.ReactNode
 *  style?: React.CSSProperties
 * }} props
 */
export const Sidebar = ({
  children,
  className,
  footer,
  header,
  logo,
  style,
}) => (
  <Nav className={className} style={style}>
    {logo && <Logo>{logo}</Logo>}
    {header && <Header>{header}</Header>}
    <Items>{children}</Items>
    {footer && <Footer>{footer}</Footer>}
  </Nav>
);
