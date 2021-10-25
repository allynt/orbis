import React, { Fragment } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider as AuiDivider,
  alpha,
  Link,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  styled,
} from '@astrosat/astrosat-ui';

const NOT_AVAILABLE = 'Not available';

const LABELS = {
  businessInformationHeading: 'Business Information',
  itemsHeading: 'What can we supply?',
  contactDetailsLabel: 'Contact Details',
  addressLabel: 'Address',
  existingLineOfBusinessLabel: 'Existing line of business',
  newProductLinesLabel: 'New Product Lines in Response to COVID-19',
  paymentTermsLabel: 'Payment Terms',
};

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: 0,
  },
  content: {
    paddingLeft: 0,
    paddingRight: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  heading: {
    gridColumn: '1 / -1',
  },
  highlight: {
    margin: 0,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    backgroundColor: alpha(theme.palette.primary.main, 0.3),
  },
  listLabel: {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const SectionLabel = styled('p')(({ theme }) => ({
  ...theme.typography.h2,
  gridColumn: '1 / 2',
  paddingLeft: '25%',
  display: 'grid',
  alignItems: 'center',
}));

const Heading = styled('h2')(({ theme }) => ({
  ...theme.typography.h1,
  textAlign: 'center',
  gridColumn: '1 / -1',
}));

const TextItem = styled('p')(({ theme }) => ({
  ...theme.typography.body1,
  display: 'grid',
  alignItems: 'center',
}));

const Divider = styled(AuiDivider)({
  gridColumn: '1 / -1',
});

export const MySupplyLynkDialog = ({ supplier, onCloseClick, isVisible }) => {
  const styles = useStyles();

  return (
    <Dialog open={isVisible} onClose={onCloseClick} maxWidth="lg" fullWidth>
      <DialogTitle onClose={onCloseClick}>
        {supplier.Name || 'Supplier'}
      </DialogTitle>
      <DialogContent className={styles.content}>
        <SectionLabel>{LABELS.contactDetailsLabel}</SectionLabel>
        <List dense>
          {supplier['Contact Name'] && (
            <ListItem data-testid="contact-name">
              {supplier['Contact Name']}
            </ListItem>
          )}
          {supplier['Contact Email Address'] && (
            <ListItem data-testid="contact-email">
              {supplier['Contact Email Address']}
            </ListItem>
          )}
          {supplier['Contact Phone Number'] && (
            <ListItem>{supplier['Contact Phone Number']}</ListItem>
          )}
          {supplier.URL && (
            <ListItem>
              <Link
                href={supplier.URL}
                target="_blank"
                rel="noreferrer noopener"
              >
                {supplier.URL}
              </Link>
            </ListItem>
          )}
        </List>
        <Divider />
        <SectionLabel>{LABELS.addressLabel}</SectionLabel>
        <List dense>
          {supplier['Address Line 1'] && (
            <ListItem data-testid="address-line-1">
              {supplier['Address Line 1']}
            </ListItem>
          )}
          {supplier['Address Line 2'] && (
            <ListItem>{supplier['Address Line 2']}</ListItem>
          )}
          {supplier.City && <ListItem>{supplier.City}</ListItem>}
          {supplier.County && <ListItem>{supplier.County}</ListItem>}
          {supplier.Postcode && <ListItem>{supplier.Postcode}</ListItem>}
        </List>
        <Divider />
        <Heading>{LABELS.businessInformationHeading}</Heading>
        <Divider />
        <SectionLabel>{LABELS.existingLineOfBusinessLabel}</SectionLabel>
        <TextItem>{supplier['Line of Business'] || NOT_AVAILABLE}</TextItem>
        <Divider />
        <SectionLabel className={styles.highlight}>
          {LABELS.newProductLinesLabel}
        </SectionLabel>
        <TextItem className={styles.highlight}>
          {supplier['New Product Lines'] || NOT_AVAILABLE}
        </TextItem>
        <Divider />
        <SectionLabel>{LABELS.paymentTermsLabel}</SectionLabel>
        <TextItem>{supplier['Payment Terms'] || NOT_AVAILABLE}</TextItem>
        <Divider />
        <Heading>{LABELS.itemsHeading}</Heading>
        <Divider />
        {supplier.Items.map(({ Name, ...rest }) => (
          <Fragment key={Name}>
            <SectionLabel>{Name || NOT_AVAILABLE}</SectionLabel>
            <List dense>
              {Object.entries(rest).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemText
                    primaryTypographyProps={{
                      className: styles.listLabel,
                      variant: 'body1',
                    }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                    primary={key}
                    secondary={value || NOT_AVAILABLE}
                  />
                </ListItem>
              ))}
            </List>
            <Divider />
          </Fragment>
        ))}
      </DialogContent>
    </Dialog>
  );
};
