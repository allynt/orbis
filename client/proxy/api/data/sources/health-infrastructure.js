module.exports = {
  name: 'health-infrastructure',
  metadata: {
    label: 'Health infrastructure',
    domain: 'Action for Health and Help',
    range: false,
    description: 'Description of Health infrastructure layer.'
  },
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [
      {
        id: 1,
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-3.16856, 55.911667] },
        properties: {
          pk: 1,
          type: 'hospitals',
          name: 'Hospital One',
          phone_number: '+447561866337',
          address1: '1 Street Name',
          address2: 'Edinburgh',
          postcode: 'EH15 1AS'
        }
      },
      {
        id: 2,
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-3.165856, 55.911567] },
        properties: {
          pk: 2,
          type: 'gp-surgeries',
          name: 'GP One',
          phone_number: '+447561866337',
          address1: '1 Street Name',
          address2: 'Edinburgh',
          postcode: 'EH15 1AS'
        }
      },
      {
        id: 3,
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-3.165856, 55.911467] },
        properties: {
          pk: 3,
          type: 'nhs',
          name: 'NHS Trust One',
          phone_number: '+447561866337',
          address1: '1 Street Name',
          address2: 'Edinburgh',
          postcode: 'EH15 1AS'
        }
      },
      {
        id: 4,
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-3.165856, 55.912067] },
        properties: {
          pk: 4,
          type: 'pharmacies',
          name: 'Pharmacy One',
          phone_number: '+447561866337',
          address1: '1 Street Name',
          address2: 'Edinburgh',
          postcode: 'EH15 1AS'
        }
      }
    ]
  }
};
