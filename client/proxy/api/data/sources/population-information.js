module.exports = {
  name: 'population-information',
  metadata: {
    label: 'Population information',
    domain: 'Action for Health and Help',
    range: false,
    description: 'Description of Population information layer.'
  },
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [
      {
        id: 1,
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-3.165556, 55.911667] },
        properties: {
          pk: 1,
          created: '2020-03-30T12:41:38.618452Z',
          Type: 'HELPER',
          name: 'MR Zdenek Zlamal',
          age: 25,
          phone_number: '+447561866337',
          email_address: 'a@b.com',
          description: 'Hello world.',
          postcode: 'EH15 1AS'
        }
      },
      {
        id: 2,
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-3.165556, 55.912667] },
        properties: {
          pk: 2,
          created: '2020-03-30T12:42:31.761525Z',
          Type: 'HELPEE',
          name: 'MR Colin Doyle',
          age: 25,
          phone_number: '+447561866337',
          email_address: 'a@b.com',
          description: 'Hello world.',
          postcode: 'EH15 1AS'
        }
      },
      {
        id: 3,
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-3.165456, 55.912067] },
        properties: {
          pk: 3,
          created: '2020-03-30T12:43:07.309154Z',
          Type: 'HELPER',
          name: 'MR Joel Pereira',
          age: 25,
          phone_number: '+447561866337',
          email_address: 'a@b.com',
          description: 'Hello world.',
          postcode: 'EH15 1AS'
        }
      },
      {
        id: 4,
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-3.165656, 55.912067] },
        properties: {
          pk: 4,
          created: '2020-03-30T12:44:06.601159Z',
          Type: 'HELPEE',
          name: 'MR Michael Smith',
          age: 25,
          phone_number: '+447561866337',
          email_address: 'a@b.com',
          description: 'Hello world.',
          postcode: 'EH15 1AS'
        }
      },
      {
        id: 5,
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-3.165656, 55.912067] },
        properties: {
          pk: 5,
          created: '2020-03-30T12:44:06.601159Z',
          Type: 'HELPEE',
          name: 'MR Michael Smith II',
          age: 25,
          phone_number: '+447561866337',
          email_address: 'a@b.com',
          description: 'Hello world.',
          postcode: 'EH15 1AS'
        }
      },
      {
        id: 6,
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-3.165656, 55.812067] },
        properties: {
          pk: 6,
          created: '2020-03-30T12:44:06.601159Z',
          Type: 'HELPEE',
          name: 'Ms Jane Doe',
          age: 25,
          phone_number: '+447561866337',
          email_address: 'a@b.com',
          description: 'Hello world.',
          postcode: 'EH15 1AS'
        }
      },
      {
        id: 7,
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-3.165656, 55.814067] },
        properties: {
          pk: 7,
          created: '2020-03-30T12:44:06.601159Z',
          Type: 'HELPEE',
          name: 'Ms Jane Doe-Smith',
          age: 25,
          phone_number: '+447561866337',
          email_address: 'a@b.com',
          description: 'Hello world.',
          postcode: 'EH15 1AS'
        }
      },
      {
        id: 8,
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-3.165656, 55.814067] },
        properties: {
          pk: 8,
          created: '2020-03-30T12:44:06.601159Z',
          Type: 'HELPER',
          name: 'MR Jack Frost',
          age: 25,
          phone_number: '+447561866337',
          email_address: 'a@b.com',
          description: 'Hello world.',
          postcode: 'EH15 1AS'
        }
      },
      {
        id: 9,
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-3.165656, 55.814067] },
        properties: {
          pk: 9,
          created: '2020-03-30T12:44:06.601159Z',
          Type: 'HELPEE',
          name: 'MR John Hancock',
          age: 25,
          phone_number: '+447561866337',
          email_address: 'a@b.com',
          description: 'Hello world.',
          postcode: 'EH15 1AS'
        }
      }
    ]
  }
};
