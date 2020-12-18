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
