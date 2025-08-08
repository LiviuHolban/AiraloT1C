// Test Case: Order 6 "merhaba-7days-1gb" eSIMs from Airalo API
// This test sends a POST request to create an order for 6 eSIMs using the Airalo Partner API.
// It verifies that the response status is 200 or 201, and that the response body contains the expected order data and meta information.
// The test also logs all received information from the response for review.


// API Endpoints
const ENDPOINTS = {
  url_base_sandbox: 'https://sandbox-partners-api.airalo.com', 
  api_version: 'v2',
  orders: 'orders',
  // Replace with the actual endpoint if different

};

const URL_USED = `${ENDPOINTS.url_base_sandbox}/${ENDPOINTS.api_version}/${ENDPOINTS.orders}`;

// Global test variables
const TEST_PACKAGE_ID = 'merhaba-7days-1gb';
const TEST_QUANTITY = 6;

describe('Order 6 "merhaba-7days-1gb" eSIMs from Airalo API', () => {
  it('POST an order for 6 eSIMs', () => {
    cy.getAccessToken().then((token) => {
      return cy.request({
        method: 'POST',
        url: URL_USED,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: {
          package_id: TEST_PACKAGE_ID,
          quantity: TEST_QUANTITY
        }
      });
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
      expect(response.body).to.have.property('data');
      const data = response.body.data;
      // Validate using the fixture template
      cy.fixture('post_order_response_T.json').then((template) => {
        // Only compare keys that exist in the template for flexibility
        Object.keys(template.data).forEach((key) => {
          expect(data).to.have.property(key);
        });
        expect(response.body).to.have.property('meta');
        expect(response.body.meta).to.have.property('message', template.meta.message);
      });
      // Log all received information from the response
      cy.log('--- Order Response: FULL ---');
      Object.entries(data).forEach(([key, value]) => {
        cy.log(`${key}: ${JSON.stringify(value)}`);
      });
      if (response.body.meta) {
        cy.log('--- Meta ---');
        Object.entries(response.body.meta).forEach(([key, value]) => {
          cy.log(`${key}: ${JSON.stringify(value)}`);
        });
      }
      cy.log('--- Raw Response ---');
      cy.log(JSON.stringify(response.body, null, 2));
    });
  });
});
