export const getUserLicences = (user, customer) => {
  const licences = customer.licences.filter(l => l.customer_user === user.id);
  return licences.map(l => l.orb);
};
