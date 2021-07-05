export type SatelliteId = 'sentinel-2' | 'landsat' | 'modis';
export type TierId = 'free' | 'mid' | 'high';

export type Visualisation = {
  description: string;
  id: string;
  label: string;
  thumbnail: string;
};

export type Satellite = {
  description: string;
  id: SatelliteId;
  label: string;
  tiers: { id: TierId; label: string; description: string }[];
  visualisations: Visualisation[];
};

export type Scene = {
  cloudCover: number;
  created: string;
  download_url: string;
  id: string;
  metadata: { [key: string]: any };
  satellite: SatelliteId;
  thumbnail_url: string;
  tier: TierId;
  tile_url: string;
};

export type SavedSearch = {
  aoi: number[][];
  created: string;
  end_date: string;
  id: number;
  name: string;
  owner: number;
  satellites: SatelliteId[];
  start_date: string;
  tiers: TierId[];
};
