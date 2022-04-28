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
  impactsByFeature: [
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
  activities: [
    {
      title: 'Start grazing cattle',
      activityCode: 'grazingCattleStart',
      description: 'Negative',
      totalImpact: -14.199754218750002,
      operationMayRequireConsent: true,
      summary: [
        {
          code: 'biodiversityImpacts',
          category: 'Biodiversity',
          score: -1,
          impact: -0.08,
        },
        {
          code: 'chemicalImpacts',
          category: 'Chemical',
          score: 0,
          impact: 0,
        },
        {
          code: 'peopleImpacts',
          category: 'People',
          score: 0,
          impact: 0,
        },
        {
          code: 'soilWaterAirImpacts',
          category: 'Soil, Water, Air',
          score: -1,
          impact: -0.11,
        },
        {
          code: 'environmentalImpacts',
          category: 'Environmental',
          score: -4,
          impact: -0.23,
        },
      ],
      impacts: [
        {
          category: 'Biodiversity',
          description: 'Slightly negative',
          score: -1,
          impact: -0.06,
        },
        {
          category: 'Chemical',
          description: 'No impact',
          score: 0,
          impact: 0,
        },
        {
          category: 'People',
          description: 'Minor or no positive impact',
          score: 0,
          impact: 0.006,
        },
        {
          category: 'Soil, Water, Air',
          description: 'Minor or no negative impact',
          score: 0,
          impact: -0.045,
        },
        {
          category: 'Environmental',
          description: 'Negative',
          score: -2,
          impact: -0.1,
        },
      ],
      possibleMitigations: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra nibh ac pharetra blandit. Vestibulum ante est, bibendum rhoncus ornare sit amet, blandit ac odio. Sed quis leo nec augue tincidunt sollicitudin. Integer semper.',
        'Maecenas hendrerit malesuada sapien, eget rutrum nunc accumsan vitae. Sed egestas, neque quis aliquam.',
        'Donec faucibus eu velit vel eleifend. Aliquam id est mauris. Donec bibendum est sit amet lobortis sollicitudin. Duis at elementum sem. Quisque molestie non nulla quis dictum. ',
        'Morbi et malesuada nibh, sed scelerisque sapien. Phasellus placerat nunc ut ante ultrices, ut venenatis erat sollicitudin. Phasellus non odio non nulla laoreet dapibus. Aliquam erat volutpat. Interdum et.',
      ],
    },
    {
      title: 'Start grazing sheep',
      activityCode: 'grazingSheepStart',
      description: 'Negative',
      totalImpact: -14.199754218750002,
      operationMayRequireConsent: null,
      summary: [
        {
          code: 'biodiversityImpacts',
          category: 'Biodiversity',
          score: 0,
          impact: -0.06,
        },
        {
          code: 'chemicalImpacts',
          category: 'Chemical',
          score: 0,
          impact: 0,
        },
        {
          code: 'peopleImpacts',
          category: 'People',
          score: 0,
          impact: -0.006,
        },
        {
          code: 'soilWaterAirImpacts',
          category: 'Soil, Water, Air',
          score: -1,
          impact: -0.10500000000000001,
        },
        {
          code: 'environmentalImpacts',
          category: 'Environmental',
          score: -3,
          impact: -0.18,
        },
      ],
      impacts: [
        {
          category: 'Biodiversity',
          description: 'Slightly negative',
          score: -2,
          impact: -2.06,
        },
        {
          category: 'Chemical',
          description: 'No impact',
          score: 1,
          impact: 1,
        },
        {
          category: 'People',
          description: 'Minor or no positive impact',
          score: 1,
          impact: 1.006,
        },
        {
          category: 'Soil, Water, Air',
          description: 'Minor or no negative impact',
          score: 3,
          impact: -3.045,
        },
        {
          category: 'Environmental',
          description: 'Negative',
          score: -2,
          impact: -0.1,
        },
      ],
      possibleMitigations: [
        'Curabitur sit amet leo porta, sollicitudin nunc eu, cursus odio. Proin imperdiet vestibulum rhoncus. Vivamus consectetur, felis ut accumsan molestie, erat elit mollis. Vestibulum varius eleifend velit lacinia bibendum. Quisque vulputate ullamcorper pulvinar. Fusce dictum nunc nec molestie faucibus. In ac nibh turpis. Duis finibus faucibus neque non dictum. Ut vehicula rhoncus elit. Pellentesque pharetra risus sit amet nibh rhoncus, in volutpat dolor blandit. Vestibulum lobortis convallis iaculis. Nam ac sapien venenatis, elementum magna id, tincidunt erat. Aenean et eros quis lectus fringilla tincidunt. Vestibulum tincidunt iaculis lobortis.',
        'Donec blandit non mi at varius. Cras cursus luctus hendrerit. Curabitur rhoncus vel libero sed vestibulum. Integer placerat diam a velit cursus malesuada. Nullam id neque vel ante lacinia dignissim nec condimentum leo. Praesent egestas maximus sapien eget vehicula. Vestibulum ac tempor nisi, ac luctus ligula. Proin volutpat euismod mi, venenatis consequat mauris facilisis ut. Nullam dapibus eros tincidunt magna gravida pellentesque. Ut feugiat sed dui nec laoreet. Pellentesque.',
      ],
    },
  ],
};
