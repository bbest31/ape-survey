/**
 * Takes in the auth0 userid format auth0|xxxxxxxxxxx and extracts the number that represents the id.
 * @param {string} userSub
 * @returns {string}
 */
export function extractAuth0UserID(userSub) {
  return userSub.split("|")[1];
}
