// Test Case: Airalo API Authentication
// This test retrieves an OAuth2 access token from the Airalo Partner API using client credentials.
// It verifies that the response status is 200 and that an access token is present in the response body.

describe('Airalo API Authentication', () => {
  it('should retrieve access token', () => {
    cy.fixture('credentials').then((creds) => {
      cy.request({
        method: 'POST',
        url: Cypress.env('Url_Request_Token'),
        form: true,
        body: {
          client_id: creds.client_id,
          client_secret: creds.client_secret,
          grant_type: 'client_credentials'
        }
      }).then((response) => {
        cy.log('Full response:', JSON.stringify(response, null, 2));
        expect(response.status).to.eq(200);
        expect(response.body.data).to.have.property('access_token');
      });
    });
  });
});