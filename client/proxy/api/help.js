'use strict';

const HELP_RESPONSE = '<h3>Search Options</h3><ul>  <li>Full postcode to locate a small area of a few streets e.g. EH9 1PR.</li>  <li>Place name to locate a village, town or city. If the search term is not unique (e.g. Newtown) you will be offered a choice of locations.</li></ul><p>  NOTE: You will not find landmarks and places of interest such as Edinburgh Castle   or Nelsons Column or county names such as Cornwall. These are not currently   listed in the gazetteer.</p><ul>  <li>National Grid Reference to locate a unique place on the map. These must be in <strong>alphanumeric</strong> form e.g. NT, TU24, SD9850 or TQ245648.</li>  <li>Easting/Northing to go to a specific location defined by coordinates on British National Grid e.g. 545030 138305</li>  <li>Latitude/Longitude to go a specific location defined by geographical. Formats accepted can be either decimal degrees e.g. 55.123456 -5.123456 or in degrees minutes seconds e.g. 55 07 24.3N, 05 08 04.7W</li></ul>';

const error = [{
  message: 'Error help not found',
  data: [{
    help: 'Help type parameter'
  }]
}];


const HelpEndpoint = {
  /**
   * Look for client-specific help file first,
   * then fallback to the generic one. If none
   * is found return an error with the help
   * type searched for.
   */
  help(req, res) {
    let helpId = req.params.id;
    let json = JSON.parse(req.query.json);
    console.log('SEARCHING for ', helpId, json);

    if (HelpEndpoint.isValidCase(helpId, json.client)) {
      HelpEndpoint.handleValidCase(res, helpId, json.client)
    } else {
      HelpEndpoint.handleErrorCase(res);
    }
  },

  isValidCase(id, client) {
    return id === 'search'
  },

  handleValidCase(res, id, client) {
    res.json(HELP_RESPONSE);
  },

  handleErrorCase(res){
    res.status(400);
    res.json(error);
  }

};

module.exports = {
  help: HelpEndpoint.help
};
