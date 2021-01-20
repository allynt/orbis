type Bookmark = {
  id: number;
  owner: User['id'];
  title: string;
  description?: string;
  created: string;
  zoom: number;
  center: [number, number];
  layers: Source['source_id'][];
  thumbnail?: string;
};
