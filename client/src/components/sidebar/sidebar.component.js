import React from 'react';

import { List, styled, makeStyles } from '@astrosat/astrosat-ui';

import { useNavigate } from 'react-router-dom';

import { ReactComponent as OrbisLogo } from './orbis-light.svg';

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

const useLogoStyles = makeStyles({
  logo: {
    height: '3rem',
    color: '#ffffff',
    cursor: 'pointer',
  },
});

const DefaultLogo = React.memo(function Logo() {
  const styles = useLogoStyles();
  const navigate = useNavigate();

  return (
    <OrbisLogo
      title="Orbis Logo"
      className={styles.logo}
      onClick={() => navigate('/')}
    />
  );
});

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
  logo = <DefaultLogo />,
  style,
}) => (
  <Nav className={className} style={style}>
    {logo && <Logo>{logo}</Logo>}
    {header && <Header>{header}</Header>}
    <Items>{children}</Items>
    {footer && <Footer>{footer}</Footer>}
  </Nav>
);
