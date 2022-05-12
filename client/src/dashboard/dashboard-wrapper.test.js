import React from 'react';

import { render, screen } from 'test/test-utils';

import DashboardWrapper from './dashboard-wrapper.component';

describe('DashboardWrapper', () => {
  const testText = 'I am a child';

  it('renders children', () => {
    render(
      <DashboardWrapper>
        <h1>{testText}</h1>
      </DashboardWrapper>,
    );

    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  it('shows title if title prop is passed', () => {
    const testTitle = 'I am the title';

    render(<DashboardWrapper title={testTitle} />);

    expect(screen.getByText(testTitle));
  });

  it('shows header component if prop passed', () => {
    const buttonText = 'I am a header component.';
    const HeaderComponent = () => <button>{buttonText}</button>;

    render(
      <DashboardWrapper
        title={'hello'}
        HeaderComponent={<HeaderComponent />}
      />,
    );

    expect(
      screen.getByRole('button', { name: buttonText }),
    ).toBeInTheDocument();
  });
});
