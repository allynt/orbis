export const getLicenceInfo = licences => {
  if (!licences) return 'Not currently available';
  if (licences.length === 0) return 'No licences';
  if (licences.length > 0) return licences.slice().sort().join(', ');
};
