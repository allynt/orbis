import faker from 'faker/locale/en_GB';
import * as React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Admin from './admin.component';

export default { title: 'Admin/Main' };

const mockStore = configureMockStore([thunk]);

const Template = ({ state = {}, ...args }) => (
  <Provider store={mockStore({ admin: state })}>
    <Admin {...args} />
  </Provider>
);

export const Default = Template.bind({});

export const WithInfo = Template.bind({});
const customerId = faker.random.uuid();
const licences = Array(faker.random.number(50))
  .fill(undefined)
  .map(() => ({
    id: faker.random.uuid(),
    orb: faker.commerce.department(),
    customer: customerId,
    customer_user: faker.random.arrayElement([
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      null,
    ]),
  }));
const customerUsers = [
  {
    id: 0,
    status: 'ACTIVE',
    type: 'MANAGER',
    invitation_date: faker.date.recent().toISOString(),
    licences: licences.filter(l => l.customer_user === 0),
    user: {
      id: faker.random.uuid(),
      avatar: faker.image.people(),
      email: faker.internet.email(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    },
  },
  ...Array(faker.random.number(9))
    .fill(undefined)
    .map((_, i) => ({
      id: i + 1,
      status: faker.random.arrayElement(['ACTIVE', 'PENDING']),
      type: faker.random.arrayElement(['MANAGER', 'MEMBER']),
      invitation_date: faker.date.recent().toISOString(),
      licences: licences.filter(l => l.customer_user === i),
      user: {
        id: faker.random.uuid(),
        avatar: faker.image.people(),
        email: faker.internet.email(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    })),
];
WithInfo.args = {
  state: {
    currentCustomer: {
      id: customerId,
      name: faker.company.companyName(),
      country: faker.address.country(),
      address: faker.address.streetAddress(),
      postcode: faker.address.zipCode(),
      logo: faker.image.abstract(),
      licences,
    },
    customerUsers,
  },
  user: customerUsers[0].user,
};