import React from 'react';
import { SidePanelSection } from './side-panel-section.component';

export default { title: 'Components/SidePanelSection' };

export const NoChildren = () => <SidePanelSection title="Test Layer" />;

export const WithChildren = () => (
  <SidePanelSection title="Test Layer">
    <div>Child component</div>
  </SidePanelSection>
);
