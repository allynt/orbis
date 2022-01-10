export const config = {
  trackingId: 'UA-143753043-1', // FIXME: This should come from a .env.local file and not be committed.
  mapbox_token:
    'pk.eyJ1IjoidGhlcm1jZXJ0IiwiYSI6ImNqbmN5N2F6NzBnODYza3A2anVqYWExOW8ifQ.10y0sH8cDQp9AfZNg1-M3Q', // FIXME: This should come from a .env.local file and not be committed.
  mapStyles: [
    {
      id: 'streets',
      uri: 'mapbox://styles/astrosat/ck8em6n9k08gk1inv9qcc7c59',
      title: 'Taking It To The Streets',
    },
    {
      id: 'light',
      uri: 'mapbox://styles/mapbox/light-v10',
      title: 'Light My Fire',
    },
    {
      id: 'dark',
      uri: 'mapbox://styles/mapbox/dark-v10',
      title: 'Dark Was The Night',
    },
    {
      id: 'satellite',
      uri: 'mapbox://styles/astrosat/ck8em8hzn2cdv1hnvj8e179b8',
      title: 'Satellite Of Love',
    },
  ],
  maximumAoiArea: 500,
  isRegistrationOpen: true,
  passwordMinLength: 2,
  passwordMaxLength: 255,
  passwordMinStrength: 1,
};
