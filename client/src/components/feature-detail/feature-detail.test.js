import React from 'react';

import { render, screen } from 'test/test-utils';

import { default as FeatureDetail } from './feature-detail.component';
import { DEFAULT_TITLE } from './feature-detail.constants';

describe('<FeatureDetail />', () => {
  it('shows the given title', () => {
    render(<FeatureDetail title="Test Title" />);
    expect(
      screen.getByRole('heading', { name: 'Test Title' }),
    ).toBeInTheDocument();
  });

  it('shows a default title if no title is given', () => {
    render(<FeatureDetail />);
    expect(
      screen.getByRole('heading', { name: DEFAULT_TITLE }),
    ).toBeInTheDocument();
  });

  it('shows the keys and values for a given feature', () => {
    const feature = {
      id: '1',
      'Key 1': 'Value 1',
      'Key 2': 'Value 2',
      'Key 3': 'Value 3',
    };
    render(<FeatureDetail features={[feature]} />);
    Object.entries(feature).forEach(([key, value]) => {
      expect(screen.getByText(key, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  it('shows the keys and values for multiple features', () => {
    const features = [
      { id: '1', 'Key 1': 'Value 1', 'Key 2': 'Value 2', 'Key 3': 'Value 3' },
      { id: '2', 'Key 4': 'Value 4', 'Key 5': 'Value 5', 'Key 6': 'Value 6' },
    ];

    render(<FeatureDetail features={features} />);
    features.forEach(feature =>
      Object.entries(feature).forEach(([key, value]) => {
        if (key === 'id') return;
        expect(screen.getByText(key, { exact: false })).toBeInTheDocument();
        expect(screen.getByText(value)).toBeInTheDocument();
      }),
    );
  });

  it('renders nested objects', () => {
    const feature = {
      id: '1',
      'key 1': {
        'subkey 1': 'value 1',
        'subkey 2': 'value 2',
      },
    };
    render(<FeatureDetail features={[feature]} />);
    expect(screen.getByText('key 1')).toBeInTheDocument();
    Object.entries(feature['key 1']).forEach(([key, value]) => {
      expect(screen.getByText(key, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  it('renders arrays of basic values', () => {
    const feature = {
      id: '1',
      'key 1': ['value 1', 'value 2', 'value 3'],
    };
    render(<FeatureDetail features={[feature]} />);
    feature['key 1'].forEach(value =>
      expect(screen.getByText(value)).toBeInTheDocument(),
    );
  });

  it('renders arrays of objects', () => {
    const feature = {
      id: 1,
      'key 1': [
        { 'subkey 1': 'value 1' },
        { 'subkey 2': 'value 2' },
        { 'subkey 3': 'value 3' },
      ],
    };
    render(<FeatureDetail features={[feature]} />);
    feature['key 1'].forEach(obj =>
      Object.entries(obj).forEach(([key, value]) => {
        expect(screen.getByText(key, { exact: false })).toBeInTheDocument();
        expect(screen.getByText(value)).toBeInTheDocument();
      }),
    );
  });

  it('Renders email addresses as links', () => {
    const feature = {
      id: 1,
      email: 'test@test.com',
    };
    render(<FeatureDetail features={[feature]} />);
    expect(
      screen.getByRole('link', { name: 'test@test.com' }),
    ).toBeInTheDocument();
  });

  it('renders `postFeatureComponent` if prop is present', () => {
    const feature = {
      id: '1',
      'Key 1': 'Value 1',
      'Key 2': 'Value 2',
      'Key 3': 'Value 3',
    };
    const text = 'This is a test component';

    render(
      <FeatureDetail
        features={[feature]}
        postFeatureComponent={() => <h1>{text}</h1>}
      />,
    );

    expect(screen.getByRole('heading', { name: text })).toBeInTheDocument();
  });

  it('excludes fields specified in `propertiesBlacklist` prop', () => {
    const features = [
      { id: '1', 'Key 1': 'Value 1', 'Key 2': 'Value 2', 'Key 3': 'Value 3' },
    ];

    render(<FeatureDetail features={features} propertiesBlacklist={['id']} />);

    expect(screen.queryByText('id', { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });
});
