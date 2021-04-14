import { FeatureCollection } from '@turf/helpers';
import { OrbState } from 'map/orbs/orbReducer'; // eslint-disable-line

type Bookmark = {
  id: number;
  owner: User['id'];
  title: string;
  description?: string;
  created: string;
  zoom: number;
  center: [number, number];
  layers: Source['source_id'][];
  orbs: OrbState;
  thumbnail?: string;
  feature_collection?: FeatureCollection;
};
