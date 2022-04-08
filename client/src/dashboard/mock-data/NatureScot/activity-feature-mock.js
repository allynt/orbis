const mockdata = [
  {
    name: 'Breeding Bird Assemblage',
    impacts: [
      {
        name: 'Woodland Thinning',
        effect: 'disturbance',
        strength: -3,
        notification:
          'Mitigation : undertake woodland thinning outside of the nesting season. undertake woodland thinning outside of the nesting season. ',
      },
      {
        name: 'Outhouse construction',
        effect: 'disruption',
        strength: -2,
        notification:
          'Mitigation : undertake outhouse construction outside of the nesting season',
      },
      {
        name: 'Outhouse construction',
        effect: 'disruption',
        strength: -1,
        notification:
          'Protection: Proposal location is adjacent to SSSI 1186 Moorfoot Hills citing breeding bird assemblage as a protected feature.',
      },
      {
        name: 'Woodland Changing',
        effect: 'disturbance',
        strength: 0,
        notification:
          'Mitigation : undertake woodland thinning outside of the nesting season',
      },
      {
        name: 'Outhouse Demolition',
        effect: 'disruption',
        strength: 2,
        notification:
          'Mitigation : undertake outhouse construction outside of the nesting season',
      },
      {
        name: 'Outhouse Budgerigar',
        effect: 'disruption',
        strength: 1,
        notification:
          'Protection: Proposal location is adjacent to SSSI 1186 Moorfoot Hills citing breeding bird assemblage as a protected feature.',
      },
      {
        name: 'Woodland Thinking',
        effect: 'disturbance',
        strength: 3,
        notification:
          'Mitigation : undertake woodland thinning outside of the nesting season',
      },
      {
        name: 'Outhouse Building',
        effect: 'disruption',
        strength: 3,
        notification:
          'Mitigation : undertake outhouse construction outside of the nesting season',
      },
      {
        name: 'Outhouse repair',
        effect: 'disruption',
        strength: -1,
        notification:
          'Protection: Proposal location is adjacent to SSSI 1186 Moorfoot Hills citing breeding bird assemblage as a protected feature.',
      },
    ],
  },
  {
    name: 'Watersources',
    impacts: [
      {
        name: 'Build a culvert',
        effect: 'disturbance',
        strength: 3,
        notification: 'Mitigation : build a culvert to divert watercourse',
      },
      {
        name: 'Build a well',
        effect: 'disruption',
        strength: -3,
        notification: 'Mitigation : build a well to extract water',
      },
    ],
  },
  {
    name: 'Featue3 is empty',
    impacts: [],
  },
  {
    name: 'Featue4 is empty',
    impacts: [],
  },
  {
    name: 'Featue5 is empty',
    impacts: [],
  },
  {
    name: 'Featue6 is empty',
    impacts: [],
  },
  {
    name: 'Featue7 is empty',
    impacts: [],
  },
  {
    name: 'Featue8 is empty',
    impacts: [],
  },
];

export default mockdata;
