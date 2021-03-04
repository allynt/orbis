import { assign } from 'lodash';
import * as React from 'react';
import { MoreInformation } from './more-information.component';

export default { title: 'Analysis Panel/More Information' };

const Template = args => <MoreInformation {...args} />;

export const Details = Template.bind({});
Details.args = {
  selectedProperty: { details: "This is a test source, it's really great" },
};

export const Source = Template.bind({});
Source.args = {
  selectedProperty: { source: 'www.source.test.com' },
};

export const Licence = Template.bind({});
Licence.args = {
  currentSource: {
    metadata: {
      licence: '© Crown Copyright (2020) released under OGL v3.0',
    },
  },
};

export const Sources = Template.bind({});
Sources.args = {
  currentSource: {
    metadata: {
      provenance: {
        sources: [
          'Normal Text',
          'http://link.source',
          { text: 'Custom Link', src: 'http://google.com' },
        ],
      },
    },
  },
};

export const All = Template.bind({});
All.args = {
  selectedProperty: {
    ...Details.args.selectedProperty,
    ...Source.args.selectedProperty,
  },
  currentSource: {
    metadata: assign(
      {},
      Licence.args.currentSource.metadata,
      Sources.args.currentSource.metadata,
    ),
  },
};

export const Wrapping = Template.bind({});
Wrapping.args = {
  selectedProperty: {
    details:
      'Count of people for a 7-day period within the Local Authority with at least one positive COVID-19 test result by specimen date (either lab-reported or lateral flow device). Data are for provided the most recent 7-day period available, ending on the date shown in the name of the layer. Cases in City of London have been assigned to Hackney.',
    source: 'https://coronavirus.data.gov.uk/details/cases',
  },
};
