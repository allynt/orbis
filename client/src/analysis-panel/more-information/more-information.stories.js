import * as React from 'react';

import faker from '@faker-js/faker/locale/en_GB';

import { MoreInformation } from './more-information.component';

faker.seed(1);

export default { title: 'Analysis Panel/More Information' };

const Template = ({ details, source, licence, sources }) => (
  <MoreInformation
    selectedProperty={{ details, source }}
    currentSource={{ metadata: { licence, provenance: { sources } } }}
  />
);

export const Details = Template.bind({});
Details.args = {
  details: "This is a test source, it's really great",
};

export const DetailsParagraphs = Template.bind({});
DetailsParagraphs.args = {
  details: [
    faker.lorem.paragraph(),
    faker.lorem.paragraph(),
    faker.lorem.paragraph(),
  ],
};

export const Source = Template.bind({});
Source.args = {
  source: 'www.source.test.com',
};

export const Licence = Template.bind({});
Licence.args = {
  licence: '© Crown Copyright (2020) released under OGL v3.0',
};

export const Sources = Template.bind({});
Sources.args = {
  sources: [
    'Normal Text',
    'http://link.source',
    { text: 'Custom Link', src: 'http://google.com' },
  ],
};

export const All = Template.bind({});
All.args = {
  ...Details.args,
  ...Source.args,
  ...Licence.args,
  ...Sources.args,
};

export const Wrapping = Template.bind({});
Wrapping.args = {
  details:
    'Count of people for a 7-day period within the Local Authority with at least one positive COVID-19 test result by specimen date (either lab-reported or lateral flow device). Data are for provided the most recent 7-day period available, ending on the date shown in the name of the layer. Cases in City of London have been assigned to Hackney.',
  source: 'https://coronavirus.data.gov.uk/details/cases',
};
