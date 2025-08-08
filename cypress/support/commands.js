let cachedToken = null;

Cypress.Commands.add('getAccessToken', () => {
  if (cachedToken) {
    return cy.wrap(cachedToken);
  }

  return cy.fixture('credentials').then((creds) => {
    return cy.request({
      method: 'POST',
      url: Cypress.env('Url_Request_Token'),
      form: true,
      body: {
        client_id: creds.client_id,
        client_secret: creds.client_secret,
        grant_type: 'client_credentials'
      }
    }).then((res) => {
      cachedToken = res.body.data.access_token;
      // Add timestamp to the token data
      const tokenData = {
        ...res.body.data,
        received_at: new Date().toISOString()
      };
      cy.writeFile('cypress/fixtures/token_response.json', tokenData);
      return cy.wrap(cachedToken);
    });
  });
});
