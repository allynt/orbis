export default ({ id, data, activeSources }) => {
  const defaultColumn = 'ndvi';
  const defaultDate = '20200725';
  const source = activeSources.find(s => s.source_id === id);
  return {
    id,
    image: `${data}/${defaultColumn}_${defaultDate}.png`,
    bounds: [
      100.42684677700454,
      5.839335465057107,
      100.48749559928604,
      5.914446003530912,
    ],
  };
};
