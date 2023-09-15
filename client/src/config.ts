// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'v6ulsw6655'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/prod`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-f6cco3lefy216fwd.us.auth0.com', // Auth0 domain
  clientId: 'YIH0spI7az2d8qTkz8lBXrszXxmDSO2r', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
