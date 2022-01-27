let storage = [
  {
    id: 18,
    title: 'Satellite Image',
    created: '2021-12-23T00:00:48.801139Z',
    size: 0.1,
  },
  {
    id: 7,
    title: 'Image to delete',
    created: '2021-10-15T09:39:42.903265Z',
    size: 0.1,
  },
  {
    id: 4,
    title: 'A second image',
    created: '2021-09-22T12:41:32.457808Z',
    size: 0.1,
  },
];

const getStorage = () => {
  return storage;
};

const deleteStorage = storageId => {
  storage = storage.filter(file => file.id !== storageId);
  return storage;
};

export { getStorage, deleteStorage };
