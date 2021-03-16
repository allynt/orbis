import { SidePanelSection } from 'components';
import React from 'react';
import { RiceRasterSidebarComponent } from './rice-raster-sidebar.component';

export default { title: 'Sidebar Components/Demo/Rice Raster Sidebar' };

const Template = args => (
  <SidePanelSection title="Rice" defaultExpanded>
    <RiceRasterSidebarComponent {...args} />
  </SidePanelSection>
);

export const Default = Template.bind({});
