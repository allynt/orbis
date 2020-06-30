/**
 * @param {{id: string, orb: string, customer_user?: string}[]} licences
 */
export const createLicenceInformation = licences =>
  licences?.reduce((licenceInformation, { orb, customer_user }) => {
    const orbLicenceInformation = licenceInformation[orb];
    const isAvailable = !!customer_user;
    let purchased, active;
    if (orbLicenceInformation) {
      purchased = orbLicenceInformation.purchased + 1;
      active = orbLicenceInformation.active + isAvailable;
    } else {
      purchased = 1;
      active = 0 + isAvailable;
    }
    const available = purchased - active;
    return { ...licenceInformation, [orb]: { purchased, active, available } };
  }, {});
