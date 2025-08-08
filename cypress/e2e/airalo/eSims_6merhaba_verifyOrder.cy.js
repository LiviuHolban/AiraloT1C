// Test Case: Verify the inserted order for 6 "merhaba-7days-1gb" eSIMs
// This test places an order for 6 eSIMs using the Airalo Partner API, then fetches and verifies the order by order_id.
// It checks that the POST and GET responses have the expected structure and values, including package_id and quantity.
// The test also validates the GET response against a fixture template and logs all relevant information for review.

// API Endpoints
const ENDPOINTS = {
  url_base: 'https://partners-doc.airalo.com',
  url_base_sandbox: 'https://sandbox-partners-api.airalo.com', 
  api_version: 'v2',
  orders: 'orders',
  unique_ID: '994a7fbb-fbda-451d-a3bc-98028a8e676d',
  hashed_unique_ID: '#994a7fbb-fbda-451d-a3bc-98028a8e676d',
  // Replace with the actual endpoint if different

};
const URL_USED = `${ENDPOINTS.url_base_sandbox}/${ENDPOINTS.api_version}/${ENDPOINTS.orders}`;

// Global test variables
const TEST_PACKAGE_ID = 'merhaba-7days-1gb';
const TEST_QUANTITY = 6;

describe('Verify the inserted order for 6 "merhaba-7days-1gb" eSIMs', () => {
  it('should GET and verify the order by order_id', () => {
    // First, place the order to get the order_id
    cy.getAccessToken().then((token) => {
      return cy.request({
        method: 'POST',
        url: `${URL_USED}`,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: {
          package_id: TEST_PACKAGE_ID,
          quantity: TEST_QUANTITY
        }
      }).then((orderResponse) => {
        expect(orderResponse.status).to.be.oneOf([200, 201]);
        expect(orderResponse.body).to.have.property('data');
        const data = orderResponse.body.data;
        // Validate using the fixture template
      cy.fixture('order_template.json').then((template) => {
        // Only compare keys that exist in the template for flexibility
        Object.keys(template.data).forEach((key) => {
          expect(data).to.have.property(key);
        });
        expect(orderResponse.body).to.have.property('meta');
        expect(orderResponse.body.meta).to.have.property('message', template.meta.message);
      });
        // Validate the order data
        expect(data.package_id).to.eq(TEST_PACKAGE_ID);
        // Check that the quantity matches
        expect(Number(data.quantity)).to.eq(TEST_QUANTITY);
        expect(data.type).to.be.a('string');
        expect(data.sims).to.be.an('array').and.have.length.greaterThan(0);
        expect(data.installation_guides).to.have.property('en');
        expect(orderResponse.body).to.have.property('meta');
        expect(orderResponse.body.meta).to.have.property('message', 'success');

        // Log all received information from the response
        cy.log('--- Order Response: FULL ---');
        Object.entries(data).forEach(([key, value]) => {
          cy.log(`${key}: ${JSON.stringify(value)}`);
        });
        if (orderResponse.body.meta) {
          cy.log('--- Meta ---');
          Object.entries(orderResponse.body.meta).forEach(([key, value]) => {
            cy.log(`${key}: ${JSON.stringify(value)}`);
          });
        }
        cy.log('--- Raw Response ---');
        cy.log(JSON.stringify(orderResponse.body, null, 2));
        const orderId = data.id
        // const orderId = data.id || data.sims[0].order_id;
        // Now, verify the order by fetching it
        cy.request({
          method: 'GET',
          url: `${URL_USED}/${orderId}?include=sims,user,status`,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }).then((getResponse) => {
          // Validate GET response according to get_template.json fixture
          
          // Check meta message
          expect(getResponse.body).to.have.property('data');
          expect(getResponse.body).to.have.property('meta');
          cy.fixture('get_order_template.json').then((getTemplate) => {
            // Check top-level keys
            expect(getResponse.body.meta).to.have.property('message', getTemplate.meta.message);
            // Check data keys present in template
            Object.keys(getTemplate.data).forEach((key) => {
              expect(getResponse.body.data).to.have.property(key);
            });
          });
          // Validate package_id and quantity match POST
          expect(getResponse.body.data.package_id).to.eq(TEST_PACKAGE_ID);
          expect(Number(getResponse.body.data.quantity)).to.eq(TEST_QUANTITY);
          
          cy.log('GET Response: ' + JSON.stringify(getResponse.body, null, 2));
        });
      });
    });
  });
});
