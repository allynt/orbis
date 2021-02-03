import React from 'react';
import { render } from '@testing-library/react';
import { default as FeatureDetail } from './feature-detail.component';
import { DEFAULT_TITLE } from './feature-detail.constants';

describe('<FeatureDetail />', () => {
  it('shows the given title', () => {
    const { getByText } = render(
      <FeatureDetail features={[]} title="Test Title" />,
    );
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('shows a default title if no title is given', () => {
    const { getByText } = render(<FeatureDetail features={[]} />);
    expect(getByText(DEFAULT_TITLE)).toBeInTheDocument();
  });

  it('shows the keys and values for a given feature', () => {
    const feature = {
      id: '1',
      'Key 1': 'Value 1',
      'Key 2': 'Value 2',
      'Key 3': 'Value 3',
    };
    const { getByText } = render(<FeatureDetail features={[feature]} />);
    Object.entries(feature).forEach(([key, value]) => {
      expect(getByText(key, { exact: false })).toBeInTheDocument();
      expect(getByText(value)).toBeInTheDocument();
    });
  });

  it('shows the keys and values for multiple features', () => {
    const features = [
      { id: '1', 'Key 1': 'Value 1', 'Key 2': 'Value 2', 'Key 3': 'Value 3' },
      { id: '2', 'Key 4': 'Value 4', 'Key 5': 'Value 5', 'Key 6': 'Value 6' },
    ];

    const { getByText } = render(<FeatureDetail features={features} />);
    features.forEach(feature =>
      Object.entries(feature).forEach(([key, value]) => {
        if (key === 'id') return;
        expect(getByText(key, { exact: false })).toBeInTheDocument();
        expect(getByText(value)).toBeInTheDocument();
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
    const { getByText } = render(<FeatureDetail features={[feature]} />);
    expect(getByText('key 1')).toBeInTheDocument();
    Object.entries(feature['key 1']).forEach(([key, value]) => {
      expect(getByText(key, { exact: false })).toBeInTheDocument();
      expect(getByText(value)).toBeInTheDocument();
    });
  });

  it('renders arrays of basic values', () => {
    const feature = {
      id: '1',
      'key 1': ['value 1', 'value 2', 'value 3'],
    };
    const { getByText } = render(<FeatureDetail features={[feature]} />);
    feature['key 1'].forEach(value =>
      expect(getByText(value)).toBeInTheDocument(),
    );
  });

  it('renders arrays of objects', () => {
    const feature = {
      'key 1': [
        { 'subkey 1': 'value 1' },
        { 'subkey 2': 'value 2' },
        { 'subkey 3': 'value 3' },
      ],
    };
    const { getByText } = render(<FeatureDetail features={[feature]} />);
    feature['key 1'].forEach(obj =>
      Object.entries(obj).forEach(([key, value]) => {
        expect(getByText(key, { exact: false })).toBeInTheDocument();
        expect(getByText(value)).toBeInTheDocument();
      }),
    );
  });

  it.todo('does not include keys which match the exclude regex');

  it.todo('only includes keys which match the include regex');
});
