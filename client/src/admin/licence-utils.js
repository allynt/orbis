export const getUserLicences = (user, customer) => {
  const licences = customer?.licences.filter(l => l.customer_user === user.id);
  return licences?.map(l => l.orb);
};

export const getLicenceInfo = licences => {
  if (!licences) return 'Not currently available';
  if (licences.length === 0) return 'No licences';
  if (licences.length > 0) return licences.slice().sort().join(', ');
};

/**
 * @param {import("typings/orbis").Customer} customer
 * @param {import("typings/orbis").CustomerUser} user
 * @param {import("typings/orbis").Licence[]} availableLicences
 */
export const getCheckboxLicences = (customer, user, availableLicences = []) => {
  const userLicences =
    customer?.licences.filter(l => l.customer_user === user.id) || [];

  let allLicences = [...userLicences];

  for (let licence of availableLicences) {
    const orbNames = allLicences.map(l => l.orb);
    if (!orbNames.includes(licence.orb)) {
      allLicences = [...allLicences, licence];
    }
  }

  return allLicences;
};

/**
 * @param {import("typings/orbis").Customer} customer
 * @param {import("typings/orbis").CustomerUser} user
 * @param {any} values
 */
export const getUpdatedLicenceIds = (customer, user, values) => {
  let newIds = [];
  Object.keys(values).forEach(key => {
    if (values[key] === true) {
      let licence;

      licence = customer.licences.find(
        l => l.orb === key && l.customer_user === user.id,
      );

      if (!licence)
        licence = customer.licences.find(
          l => l.orb === key && l.customer_user === null,
        );
      newIds = [...newIds, licence.id];
    }
  });

  return newIds;
};
