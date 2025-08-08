// Test Case: List all SIMs from Airalo API
// This test fetches the list of all SIMs using the Airalo Partner API.
// It verifies that the response status is 200 and that the response body contains a 'data' property with the SIMs list.
// The test logs the full list of SIMs for review.

// API Endpoints
const ENDPOINTS = {
  url_base_sandbox: 'https://sandbox-partners-api.airalo.com', 
  api_version: 'v2',
  orders: 'orders',
  sims: 'sims',
  // Replace with the actual endpoint if different

};

const URL_orders = `${ENDPOINTS.url_base_sandbox}/${ENDPOINTS.api_version}/${ENDPOINTS.orders}`;
const URL_sims = `${ENDPOINTS.url_base_sandbox}/${ENDPOINTS.api_version}/${ENDPOINTS.sims}`;

// Global test variables
const TEST_PACKAGE_ID = 'merhaba-7days-1gb';
const TEST_QUANTITY = 6;

describe('Verify 6 eSIMs from Airalo API', () => {
    it('POST an order for 6 eSIMs', () => {
    cy.getAccessToken().then((token) => {
      return cy.request({
        method: 'POST',
        url: URL_orders,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: {
          package_id: TEST_PACKAGE_ID,
          quantity: TEST_QUANTITY
        }
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
  
        // Collect all SIM IDs from the response
        let simIds = [];
        response.body.data.sims.forEach((sim) => {
          simIds.push(sim.id);
        });  
        cy.log('Collected SIM IDs:', simIds);

        // should fetch and list all SIMs
        cy.request({
          method: 'GET',
          url: `${URL_sims}`,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }).then((getResponse) => {
          // Validate GET response according to get_eSIMs_response_T.json fixture
          expect(getResponse.body).to.have.property('data');
          expect(getResponse.body).to.have.property('meta');
          cy.fixture('get_eSIMs_response_T.json').then((getTemplate) => {
            // Check meta message
            expect(getResponse.body.meta).to.have.property('message', getTemplate.meta.message);
            // Check that data is an array
            expect(getResponse.body.data).to.be.an('array');
            // Check keys for each SIM in the array (using the first template SIM)
            const templateSim = getTemplate.data[0];
            getResponse.body.data.forEach((sim) => {
              Object.keys(templateSim).forEach((key) => {
                if (templateSim[key] !== null && templateSim[key] !== 'null') {
                  expect(sim).to.have.property(key);
                }
              });
            });
            // Validate the exact sim ids are received in the eSIM list => 6 eSIMs with TEST_PACKAGE_ID
            const dataArray = Array.isArray(getResponse.body.data) ? getResponse.body.data : [];
            simIds.forEach((simId) => {
              const matches = dataArray.filter((item) => item.id === simId);
              expect(matches.length, `SIM ID ${simId} should appear only once`).to.equal(1);
            });
            cy.log(`Total of ${simIds.length} eSIMs with package_id '${TEST_PACKAGE_ID}' received from the ORDER are found in the eSIM list. ${simIds.length} eSIM list searched is: ${simIds.join(', ')}`);

            // // Validation according to the template mentioned in the http endpoint https://partners-doc.airalo.com/#768fbbc7-b649-4fb5-9755-be579333a2d9
            // // Validate at least 6 eSIMs with TEST_PACKAGE_ID can not be done because the API does not return package_id in the SIMs list; do not have data[0].simable
            // const matchingESIMs = getResponse.body.data.filter(sim => sim.simable && sim.simable.package_id === TEST_PACKAGE_ID);
            // expect(matchingESIMs.length).to.be.at.least(6);
            // cy.log(`Total eSIMs with package_id '${TEST_PACKAGE_ID}': ${matchingESIMs.length}`);
          });
          cy.log('GET Response: ' + JSON.stringify(getResponse.body, null, 2));
        });
      });
    });
  });
});

