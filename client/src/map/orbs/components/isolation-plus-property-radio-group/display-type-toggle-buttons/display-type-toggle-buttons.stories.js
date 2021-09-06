// import React from 'react';

// import { Grid } from '@astrosat/astrosat-ui';

// import { DisplayTypeToggleButtons } from './display-type-toggle-buttons.component';

// export default {
//   title: 'Orbs/Isolation Plus/Property Radio Group/Display Type Toggle Buttons',
//   argTypes: { onChange: { action: true } },
// };

// const Template = args => (
//   <Grid container spacing={2}>
//     <DisplayTypeToggleButtons
//       {...args}
//       selectedProperty={args.properties[args.selectedProperty]}
//     />
//   </Grid>
// );

// export const UnlabelledProperties = Template.bind({});
// UnlabelledProperties.args = {
//   properties: [
//     { name: 'Property 1', type: 'continuous' },
//     { name: 'Property 2', type: 'discrete' },
//     { name: 'Property 3', type: 'percentage' },
//     { name: 'Property 4', type: 'decile' },
//   ],
// };

// export const LabelledProperties = Template.bind({});
// LabelledProperties.args = {
//   properties: [
//     {
//       name: 'Property 1',
//       type: 'continuous',
//       application: { orbis: { display: { property_toggle_label: 'Cars' } } },
//     },
//     {
//       name: 'Property 2',
//       type: 'discrete',
//       application: { orbis: { display: { property_toggle_label: 'People' } } },
//     },
//   ],
// };

// export const SelectedProperty = Template.bind({});
// SelectedProperty.args = {
//   ...LabelledProperties.args,
//   selectedProperty: 1,
// };

// export const LongLabels = Template.bind({});
// LongLabels.args = {
//   properties: [
//     {
//       name: 'Property 1',
//       application: {
//         orbis: {
//           display: {
//             property_toggle_label: 'Number',
//           },
//         },
//       },
//     },
//     {
//       name: 'Property 2',
//       application: {
//         orbis: {
//           display: {
//             property_toggle_label: 'Rate per 100,000',
//           },
//         },
//       },
//     },
//   ],
// };
