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
      pk: '1',
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
      { pk: '1', 'Key 1': 'Value 1', 'Key 2': 'Value 2', 'Key 3': 'Value 3' },
      { pk: '2', 'Key 4': 'Value 4', 'Key 5': 'Value 5', 'Key 6': 'Value 6' },
    ];

    render(<FeatureDetail features={features} />);
    features.forEach(feature =>
      Object.entries(feature).forEach(([key, value]) => {
        if (key === 'pk') return;
        expect(screen.getByText(key, { exact: false })).toBeInTheDocument();
        expect(screen.getByText(value)).toBeInTheDocument();
      }),
    );
  });

  it('renders nested objects', () => {
    const feature = {
      pk: '1',
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
      pk: '1',
      'key 1': ['value 1', 'value 2', 'value 3'],
    };
    render(<FeatureDetail features={[feature]} />);
    feature['key 1'].forEach(value =>
      expect(screen.getByText(value)).toBeInTheDocument(),
    );
  });

  it('renders arrays of objects', () => {
    const feature = {
      pk: 1,
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
      pk: 1,
      email: 'test@test.com',
    };
    render(<FeatureDetail features={[feature]} />);
    expect(
      screen.getByRole('link', { name: 'test@test.com' }),
    ).toBeInTheDocument();
  });

  it('renders `postFeatureComponent` if prop is present', () => {
    const feature = {
      pk: '1',
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

  it('excludes fields specified in `propertiesOmitlist` prop', () => {
    const features = [
      { pk: '1', 'Key 1': 'Value 1', 'Key 2': 'Value 2', 'Key 3': 'Value 3' },
    ];

    render(<FeatureDetail features={features} propertiesToOmit={['pk']} />);

    expect(screen.queryByText('id', { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('Only shows properties listed in `propertiesToPick`', () => {
    const feature = {
      pk: 'id',
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4',
    };
    render(
      <FeatureDetail
        features={[feature]}
        propertiesToPick={['key2', 'key4']}
      />,
    );
    expect(screen.queryByText(/key1/)).not.toBeInTheDocument();
    expect(screen.queryByText(/key3/)).not.toBeInTheDocument();
  });

  it('Uses the property specified by `titleProperty` from the first item as the title', () => {
    const title = 'This is the title';
    render(
      <FeatureDetail
        features={[{ pk: 'id', title, other: 'Other value' }]}
        titleProperty="title"
      />,
    );
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    expect(screen.queryByText('title:')).not.toBeInTheDocument();
  });

  it('Uses labels specified in `labelMapping` rather than keys', () => {
    const feature = {
      pk: 'id',
      key1: 'Value 1',
      key2: 'Value 2',
      key3: {
        key4: 'Value 4',
      },
    };
    const labelMapping = {
      key1: 'Label1',
      key2: 'Label2',
      key3: 'Label3',
      key4: 'Label4',
    };

    render(<FeatureDetail features={[feature]} labelMapping={labelMapping} />);
    Object.entries(labelMapping).forEach(([key, label]) => {
      expect(screen.queryByText(key, { exact: false })).not.toBeInTheDocument();
      expect(screen.getByText(label, { exact: false })).toBeInTheDocument();
    });
  });
});
