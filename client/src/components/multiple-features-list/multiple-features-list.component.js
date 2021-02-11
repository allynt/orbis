import { Link, Typography } from '@astrosat/astrosat-ui';
import * as React from 'react';

/**
 * @typedef {{
 *   primaryProperty?: string
 *   secondaryProperty?: string
 * }} MultipleFeaturesListMetadataProps
 */

/**
 * @param {{
 *   features: import('typings/orbis').GeoJsonFeature[]
 *   onMoreDetailsClick: (feature: import('typings/orbis').GeoJsonFeature) => void
 * } & MultipleFeaturesListMetadataProps} props
 */
export const MultipleFeaturesList = ({
  features,
  primaryProperty,
  secondaryProperty,
  onMoreDetailsClick,
}) => (
  <>
    {features?.map((feature, i) => (
      <React.Fragment key={`feature-${i}`}>
        <Typography>{feature.properties[primaryProperty]}</Typography>
        <Typography>
          <span>{secondaryProperty}: </span>
          {feature.properties[secondaryProperty]}
        </Typography>
        <Link component="button" onClick={() => onMoreDetailsClick(feature)}>
          More details
        </Link>
      </React.Fragment>
    ))}
  </>
);
