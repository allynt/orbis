import { SidePanel } from 'components/side-panel/side-panel.component';
import { omitBy } from 'lodash';
import {
  pickedInfoSelector,
  propertySelector,
} from 'map/orbs/slices/isolation-plus.slice';
import * as React from 'react';
import { useSelector } from 'react-redux';

export const AnalysisPanel = () => {
  const pickedInfo = useSelector(state => pickedInfoSelector(state?.orbs));
  const selectedProperty = useSelector(state => propertySelector(state?.orbs));

  const values = omitBy(
    pickedInfo?.object?.properties,
    (_, key) =>
      key !== selectedProperty.name && !key.toLowerCase().includes('code'),
  );

  return (
    <SidePanel
      orientation="right"
      open={!!pickedInfo}
      header={<h1>Data Analysis</h1>}
    >
      {Object.entries(values).map(([key, value]) => (
        <>
          <p>{key}:</p>
          <p>{value}</p>
        </>
      ))}
    </SidePanel>
  );
};
