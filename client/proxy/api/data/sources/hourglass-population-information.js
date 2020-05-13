module.exports = {
  name: 'population-information',
  metadata: {
    label: 'Population information',
    domain: 'Action for Health and Help',
    range: false,
    description: 'Description of Population information layer.',
    filters: ['Type'],
  },
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [
      {
        id: 6,
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-3.053867, 55.941776],
        },
        properties: {
          pk: 6,
          person_type: 'VOLUNTEER',
          'Contact Details': {
            Name: 'Son #2',
            Email: 'son2@home.com',
            'Contact Number': '07561 866337',
            Address: '2 Williamfield Square',
            Postcode: 'EH217DX',
            Country: ['Scotland'],
          },
          'Date of Birth': '1973-11-30',
          'Specific Needs': '',
          'Why are you interested in volunteering?': ['I want to help others'],
          'Specific Skills': {
            'Selected Skills': ['I have skills I can bring to the organisation'],
            'More Details': 'I can play the harmonica',
          },
          'How Did You Hear about Us': {
            Source: ['Volunteer Centre'],
            'More Details': '',
          },
          'Criminal Convictions': {
            Convictions: 'No',
            'More Details': '',
          },
          Availability: {
            Saturday: ['Morning', 'Afternoon', 'Evening'],
            Sunday: [],
            Monday: ['Morning'],
            Tuesday: ['Afternoon'],
            Wednesday: ['Evening'],
            Thursday: [],
            Friday: [],
          },
          'More Details': '',
        },
      },
      {
        id: 5,
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-3.151025, 55.877913],
        },
        properties: {
          pk: 5,
          person_type: 'VOLUNTEER',
          'Contact Details': {
            Name: 'Mr Mark Small',
            Email: 'marksmall37@gmail.com',
            'Contact Number': '01316502190',
            Address: '8 George Crescent',
            Postcode: 'EH209DN',
            Country: ['England'],
          },
          'Date of Birth': '1973-01-18',
          'Specific Needs': '',
          'Why are you interested in volunteering?': ['I have spare time and want to use it productively'],
          'Specific Skills': {
            'Selected Skills': ['I have skills I can bring to the organisation'],
            'More Details': '',
          },
          'How Did You Hear about Us': {
            Source: ['Job Centre'],
            'More Details': '',
          },
          'Criminal Convictions': {
            Convictions: 'Yes',
            'More Details': '',
          },
          Availability: {
            Saturday: ['Afternoon'],
            Sunday: ['Evening'],
            Monday: ['Morning'],
            Tuesday: ['Afternoon'],
            Wednesday: ['Evening'],
            Thursday: ['Afternoon'],
            Friday: ['Morning'],
          },
          'More Details': '',
        },
      },
      {
        id: 4,
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-3.116241, 55.953532],
        },
        properties: {
          pk: 4,
          person_type: 'RECIPIENT',
          'Help Receiving': ['Pick up / Delivery (Food + Prescription)'],
          'Help Required': ['Pick up / Delivery (Food + Prescription)', 'Support to access Home help/care needs'],
          'Self-Isolating': 'No',
          'High-Risk': 'No',
          'Contact Details': {
            Name: 'Son #1',
            Email: 'son@home.com',
            'Contact Number': '07561 866337',
            Address: '2 Williamfield Square',
            Postcode: 'EH151AS',
            Country: ['Scotland'],
          },
        },
      },
      {
        id: 3,
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-3.151025, 55.877913],
        },
        properties: {
          pk: 3,
          person_type: 'RECIPIENT',
          'Help Receiving': ['Pick up / Delivery (Food + Prescription)', 'Homehelp/care needs'],
          'Help Required': ['Coversation', 'Advice'],
          'Self-Isolating': 'Yes',
          'High-Risk': 'Yes',
          'Contact Details': {
            Name: 'Mark Small',
            Email: 'small_mark@hotmail.com',
            'Contact Number': '07837379549',
            Address: '8 George Crescent',
            Postcode: 'EH209DN',
            Country: ['Scotland'],
          },
        },
      },
    ],
  },
};