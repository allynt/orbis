export const RESULTS = {
  summary: [
    {
      type: 'Habitat',
      impact: 3,
    },
    {
      type: 'Geomorphology',
      impact: 1,
    },
    {
      type: 'Soils',
      impact: -1,
    },
    {
      type: 'Geology',
      impact: -2,
    },
    {
      type: 'Hydrology',
      impact: 2,
    },
    {
      type: 'Connectivity',
      impact: 0,
    },
    {
      type: 'Biodiversity',
      impact: 2,
    },
    {
      type: 'Species',
      impact: -3,
    },
  ],
  areas: [
    {
      title: 'SSSI 1186 Moorfoot Hills',
      strapline: '(This protected area is within your Area of Interest)',
      link: 'http://www.link.com',
      areas: [
        {
          name: 'Notified Natural Features',
          heading: 'SSSI 1186: Moorfoot Hills Feature Citations',
          columnHeadings: ['These features are protected by this designation'],
          columns: [
            {
              label: 'Biological Bogs: Blanket bog',
            },
            {
              label: 'Upland habitats: Upland assemblage',
            },
            {
              label: 'Woodlands: Upland birch woodland',
            },
          ],
        },
        {
          name: 'Operations Requiring Consent',
          heading:
            'Carrying out any of these activities on this SSSI requires the consent of Nature Scot',
          columnHeadings: ['Standard Ref. No.', 'Type of Operation'],
          columns: [
            {
              id: 1,
              label:
                'Cultivation, including ploughing, rotovating, harrowing and re-seeding.',
            },
            {
              id: 2,
              label:
                'Grazing and changes to grazing management (including the introduction, re-introduction, changes to stock numbers, types and dates, or cessation).',
            },
            {
              id: 3,
              label:
                'Stock feeding and changes in stock feeding practices (including the introduction, re-introduction and changes to the type and location).',
            },
          ],
          notes: [
            "'Animal' includes any mammal, reptile, amphibian, bird, fish or invertebrate.",
            "'Plant' includes any tree, shrub, herb, hedge, flowering plant, fern, alga, fungus, lichen, moss, dead or decaying wood, leaf-mould, turf and peat.",
            "'Woodland management' includes afforestation, planting, clear and selective felling, thinning, coppicing, modification of the stand or underwood and changes in species composition.",
          ],
        },
      ],
    },
    {
      title: 'SAC Moorfoot Hills',
      strapline: '(This protected area overlaps with your Area of Interest)',
      link: 'http://www.link.com',
      areas: [
        {
          name: 'Qualifying Interests',
          heading:
            'Any activity which has an impact on these interests may require a European Habitats Regulations Assessment to be carried out. Causing any damage to these qualifying interests may be a criminal offence.',
          columnHeadings: ['These features are protected by this designation'],
          columns: [
            {
              label: 'Blanket bogs (Blanket bog)',
            },
            {
              label: 'European dry heaths (Dry heaths)',
            },
          ],
        },
      ],
    },
  ],
  impacts: [
    {
      name: 'Breeding Bird Assemblage',
      impacts: [
        {
          name: 'Woodland Thinning',
          effect: 'disturbance',
          strength: -2,
          notification:
            'Mitigation : undertake woodland thinning outside of the nesting season',
        },
        {
          name: 'Outhouse construction',
          effect: 'disruption',
          strength: -3,
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
          name: 'Build well',
          effect: 'disruption',
          strength: -3,
          notification: 'Mitigation : build a well to extract water',
        },
      ],
    },
  ],
};
