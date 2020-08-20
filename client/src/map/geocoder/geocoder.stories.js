import React from 'react';
import { Geocoder } from './geocoder.component';

export default { title: 'Map/Geocoder' };

export const Test = () => (
  <Geocoder mapboxApiAccessToken="pk.eyJ1IjoidGhlcm1jZXJ0IiwiYSI6ImNqbmN5N2F6NzBnODYza3A2anVqYWExOW8ifQ.10y0sH8cDQp9AfZNg1-M3Q" />
);
