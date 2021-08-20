// import React from 'react';

// import { render } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { Provider } from 'react-redux';
// import { MemoryRouter } from 'react-router-dom';
// import createMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';

// import SavedDocuments from './saved-documents.component';

// const mockStore = createMockStore([thunk]);

// const DEFAULT_ROUTE = 'mission-control/saved-documents';

export const TEST_DOCUMENTS = [
  {
    title: 'Test-title-1',
    date: '01-05-2020',
  },
  {
    title: 'Test-title-2',
    date: '02-05-2020',
  },
  {
    title: 'Test-title-3',
    date: '03-05-2020',
  },
  {
    title: 'Test-title-4',
    date: '04-05-2020',
  },
  {
    title: 'Test-title-10',
    date: '05-05-2020',
  },
  {
    title: 'Test-title-5',
    date: '06-05-2020',
  },
  {
    title: 'Test-title-6',
    date: '07-05-2020',
  },
  {
    title: 'Test-title-7',
    date: '08-05-2020',
  },
  {
    title: 'Test-title-8',
    date: '09-05-2020',
  },
  {
    title: 'Test-title-9',
    date: '10-05-2020',
  },
];

// const renderComponent = ({ initialEntries = [DEFAULT_ROUTE] }) => {
//   const utils = render(
//     <Provider
//       store={mockStore({
//         accounts: {
//           user: { id: 1 },
//         },
//       })}
//     >
//       <MemoryRouter initialEntries={initialEntries}>
//         <SavedDocuments />
//       </MemoryRouter>
//     </Provider>,
//   );
//   return { ...utils };
// };

// describe('<Saved Documents />', () => {
//   it('renders a saved documents table', () => {
//     const { getByText } = renderComponent({});

//     userEvent.click(getByText('5'));
//     userEvent.click(getByText('10'));

//     TEST_DOCUMENTS.forEach(doc => {
//       expect(getByText(doc.title)).toBeInTheDocument();
//       expect(getByText(doc.date)).toBeInTheDocument();
//     });
//   });

//   it('sorts alphabetically when icon is clicked', () => {
//     const { getByText } = renderComponent({});
//   });

//   it('sorts by date when icon is clicked', () => {
//     const { getByText } = renderComponent({});
//   });

//   it('opens document in new tab when PDF icon is clicked', () => {
//     const { getByText } = renderComponent({});
//   });
// });
