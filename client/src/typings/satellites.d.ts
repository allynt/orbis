export type Visualisation = {
  description: string;
  id: string;
  label: string;
  thumbnail: string;
};

export type Satellite = {
  description: string;
  id: string;
  label: string;
  visualisations: Visualisation[];
};

type SceneFootprint = {
  type: string;
  coordinates: number[][];
};

export type Scene = {
  cloudCover: number;
  created: string;
  download_url: string;
  id: string;
  metadata: { [key: string]: any };
  satellite: Satellite['id'];
  thumbnail_url: string;
  tile_url: string;
  owner: number;
  footprint: SceneFootprint;
};

export type SavedSearch = {
  aoi: number[][];
  created: string;
  end_date: string;
  id: number;
  name: string;
  owner: number;
  satellites: Satellite['id'][];
  start_date: string;
};
