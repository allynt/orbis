import { resultsSelector } from '../slices/crowdless.slice';
import iconAtlas from './crowdlessConfig.iconAtlas.svg';
import iconMapping from './crowdlessConfig.iconMapping.json';

const configuration = ({ id, activeSources, orbState }) => {
  const data = orbState.crowdless.results;
  return {
    id,
    data,
    iconAtlas,
    iconMapping,
    visible: true,
    getIcon: d => d.properties.crowdednessCategory,
    getIconSize: 60,
    groupClusterName: 'cluster',
  };
};

export default configuration;
