export const getUserLicences = (user, customer) => {
  const licences = customer?.licences.filter(l => l.customer_user === user.id);
  return licences?.map(l => l.orb);
};

export const getLicenceInfo = licences => {
  if (!licences) return 'Not currently available';
  if (licences.length === 0) return 'No licences';
  if (licences.length > 0) return licences.slice().sort().join(', ');
};
