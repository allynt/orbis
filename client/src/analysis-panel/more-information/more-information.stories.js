import * as React from 'react';
import { MoreInformation } from './more-information.component';

export default { title: 'Analysis Panel/More Information' };

const Template = args => <MoreInformation {...args} />;

export const Details = Template.bind({});
Details.args = {
  details: "This is a test source, it's really great",
};

export const Source = Template.bind({});
Source.args = {
  source: 'www.source.test.com',
};

export const Both = Template.bind({});
Both.args = {
  ...Details.args,
  ...Source.args,
};

export const Wrapping = Template.bind({});
Wrapping.args = {
  details:
    'Count of people for a 7-day period within the Local Authority with at least one positive COVID-19 test result by specimen date (either lab-reported or lateral flow device). Data are for provided the most recent 7-day period available, ending on the date shown in the name of the layer. Cases in City of London have been assigned to Hackney.',
  source: 'https://coronavirus.data.gov.uk/details/cases',
};
