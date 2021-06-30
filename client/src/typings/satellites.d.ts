export type Satellite = 'sentinel-2' | 'landsat' | 'modis';

export type Tier = 'free' | 'mid' | 'high';

export type Scene = {
  id: string;
  created: string;
  cloudCover: number;
  tier: Tier;
  thumbnail_url: string;
};

export type SavedSearch = {
  id: number;
  name: string;
  satellites: Satellite[];
  tiers: Tier[];
  start_date: string;
  end_date: string;
  aoi: number[][];
  owner: number;
  created: string;
};
