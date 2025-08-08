// Test Case: List all SIMs from Airalo API
// This test fetches the list of all SIMs using the Airalo Partner API.
// It verifies that the response status is 200 and that the response body contains a 'data' property with the SIMs list.
// The test logs the full list of SIMs for review.

// API Endpoints
const ENDPOINTS = {
  getSims: 'https://sandbox-partners-api.airalo.com/v2/sims',
  // Add more endpoints here as needed
};

describe('List all SIMs from Airalo API', () => {
  it('should fetch and list all SIMs', () => {
    cy.getAccessToken().then((token) => {
      return cy.request({
        method: 'GET',
        url: ENDPOINTS.getSims,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('data');
      cy.log('SIMs: ' + JSON.stringify(response.body.data, null, 2));
    });
  });
});

