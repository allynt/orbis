import { createBrowserHistory } from 'history';
import * as React from 'react';
import { Router } from 'react-router-dom';
import LegalDocuments from './legal-documents.component';

export default { title: 'Legal Documents/Main' };

const Template = args => (
  <Router history={createBrowserHistory()}>
    <LegalDocuments {...args} />
  </Router>
);

export const Eula = Template.bind({});
Eula.args = {
  match: { path: '/eula' },
};

export const Terms = Template.bind({});
Terms.args = {
  match: { path: '/terms' },
};
