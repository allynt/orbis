import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { Geocoder } from './geocoder.component';
import userEvent from '@testing-library/user-event';

const fakeResponse = {
  type: 'FeatureCollection',
  query: ['lon'],
  features: [
    {
      id: 'place.8780954591631530',
      type: 'Feature',
      place_type: ['place'],
      relevance: 1,
      properties: { wikidata: 'Q84' },
      text: 'London',
      place_name: 'London, Greater London, England, United Kingdom',
      bbox: [-0.35167, 51.384598, 0.152641, 51.669993],
      center: [-0.1275, 51.50722],
      geometry: { type: 'Point', coordinates: [-0.1275, 51.50722] },
      context: [
        {
          id: 'district.14664713661976620',
          wikidata: 'Q23306',
          text: 'Greater London',
        },
        {
          id: 'region.13483278848453920',
          short_code: 'GB-ENG',
          wikidata: 'Q21',
          text: 'England',
        },
        {
          id: 'country.12405201072814600',
          wikidata: 'Q145',
          short_code: 'gb',
          text: 'United Kingdom',
        },
      ],
    },
    {
      id: 'locality.6641365987270260',
      type: 'Feature',
      place_type: ['locality'],
      relevance: 1,
      properties: { wikidata: 'Q1001406' },
      text: 'Longgang Qu',
      place_name: 'Longgang Qu, Shenzhen Shi, Guangdong, China',
      bbox: [114.043512, 22.449446, 114.622901, 22.816541],
      center: [114.24295, 22.72275],
      geometry: { type: 'Point', coordinates: [114.24295, 22.72275] },
      context: [
        {
          id: 'place.7471532960694370',
          wikidata: 'Q15174',
          text: 'Shenzhen Shi',
        },
        {
          id: 'region.9969993838146610',
          short_code: 'CN-44',
          wikidata: 'Q15175',
          text: 'Guangdong',
        },
        {
          id: 'country.3792314919',
          wikidata: 'Q148',
          short_code: 'cn',
          text: 'China',
        },
      ],
    },
    {
      id: 'locality.8592259768314690',
      type: 'Feature',
      place_type: ['locality'],
      relevance: 1,
      properties: { wikidata: 'Q577434' },
      text: 'Longhui Xian',
      place_name: 'Longhui Xian, Shaoyang Shi, Hunan, China',
      bbox: [110.62699, 26.994638, 111.23222, 27.665131],
      center: [111.02615, 27.11733],
      geometry: { type: 'Point', coordinates: [111.02615, 27.11733] },
      context: [
        {
          id: 'place.9023630555436340',
          wikidata: 'Q194531',
          text: 'Shaoyang Shi',
        },
        {
          id: 'region.9936202017407770',
          short_code: 'CN-43',
          wikidata: 'Q45761',
          text: 'Hunan',
        },
        {
          id: 'country.3792314919',
          wikidata: 'Q148',
          short_code: 'cn',
          text: 'China',
        },
      ],
    },
    {
      id: 'locality.2453219749764390',
      type: 'Feature',
      place_type: ['locality'],
      relevance: 1,
      properties: { wikidata: 'Q748400' },
      text: 'Longyang Qu',
      place_name: 'Longyang Qu, Baoshan Shi, Yunnan, China',
      bbox: [98.724144, 24.777859, 99.500387, 25.641891],
      center: [99.1623, 25.11411],
      geometry: { type: 'Point', coordinates: [99.1623, 25.11411] },
      context: [
        {
          id: 'place.9433372281735360',
          wikidata: 'Q496576',
          text: 'Baoshan Shi',
        },
        {
          id: 'region.11329876818640400',
          short_code: 'CN-53',
          wikidata: 'Q43194',
          text: 'Yunnan',
        },
        {
          id: 'country.3792314919',
          wikidata: 'Q148',
          short_code: 'cn',
          text: 'China',
        },
      ],
    },
    {
      id: 'locality.14203296915918870',
      type: 'Feature',
      place_type: ['locality'],
      relevance: 1,
      properties: { wikidata: 'Q1025428' },
      text: 'Longhai Shi',
      place_name: 'Longhai Shi, Zhangzhou Shi, Fujian, China',
      matching_text: 'Longhai City',
      matching_place_name: 'Longhai City, Zhangzhou Shi, Fujian, China',
      bbox: [117.490689, 24.202561, 118.151343, 24.594355],
      center: [117.81183, 24.44747],
      geometry: { type: 'Point', coordinates: [117.81183, 24.44747] },
      context: [
        {
          id: 'place.14159171178517880',
          wikidata: 'Q68814',
          text: 'Zhangzhou Shi',
        },
        { id: 'region.9800001364409290', wikidata: 'Q41705', text: 'Fujian' },
        {
          id: 'country.3792314919',
          wikidata: 'Q148',
          short_code: 'cn',
          text: 'China',
        },
      ],
    },
  ],
  attribution:
    'NOTICE: © 2020 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service (https://www.mapbox.com/about/maps/). This response and the information it contains may not be retained. POI(s) provided by Foursquare.',
};

describe('<Geocoder />', () => {
  beforeEach(() => {
    fetch.once(JSON.stringify(fakeResponse));
  });

  it('shows the search icon', () => {
    const { getByTitle } = render(<Geocoder />);
    expect(getByTitle('Location Search')).toBeInTheDocument();
  });

  it('shows an input', () => {
    const { getByLabelText } = render(<Geocoder />);
    expect(getByLabelText('Location Search')).toBeInTheDocument();
  });

  it('displays suggestions after 3 characters are typed', async () => {
    const { getByLabelText, getByText } = render(
      <Geocoder mapboxApiAccessToken="fake" />,
    );
    userEvent.type(getByLabelText('Location Search'), 'lon');
    await waitFor(() => {
      expect(getByText('London', { exact: false })).toBeInTheDocument();
    });
  });

  it('calls the onSelect function when a result is clicked', async () => {
    const onSelect = jest.fn();
    const { getByLabelText, getByText } = render(
      <Geocoder mapboxApiAccessToken="fake" onSelect={onSelect} />,
    );
    userEvent.type(getByLabelText('Location Search'), 'lon');
    await waitFor(() => {
      userEvent.click(
        getByText(fakeResponse.features[0].text, { exact: false }),
      );
    });
    expect(onSelect).toHaveBeenCalled();
  });

  it('calls the onSelect function with the selected location', async () => {
    const onSelect = jest.fn();
    const { getByLabelText, getByText } = render(
      <Geocoder mapboxApiAccessToken="fake" onSelect={onSelect} />,
    );
    userEvent.type(getByLabelText('Location Search'), 'lon');
    await waitFor(() => {
      userEvent.click(
        getByText(fakeResponse.features[0].text, { exact: false }),
      );
    });
    expect(onSelect).toHaveBeenCalledWith(fakeResponse.features[0]);
  });
});
