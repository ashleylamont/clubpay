const { Issuer, generators } = require('openid-client');
const dotenv = require('dotenv');
const express = require('express');
const readline = require('readline');


// Load environment variables from the .env file in the parent directory
dotenv.config({ path: '../.env' });

const clientId = process.env.OIDC_CLIENT_ID;
const clientSecret = process.env.OIDC_SECRET;
const metadataUrl = `https://login.microsoftonline.com/${process.env.OIDC_TENANT_ID}/v2.0/.well-known/openid-configuration`;
const localServerPort = 3000;

(async () => {
  try {
    // Discover the OIDC provider
    const provider = await Issuer.discover(metadataUrl);

    // Create a new OIDC client using the discovered provider
    const client = new provider.Client({
      client_id: clientId,
      client_secret: clientSecret,
    });

    // Generate a random state and nonce
    const state = generators.state();
    const nonce = generators.nonce();

    // Generate the authorization URL
    const authUrl = client.authorizationUrl({
      scope: 'openid profile email',
      redirect_uri: `http://localhost:${localServerPort}/callback`,
      response_type: 'code',
      state,
      nonce,
    });

    console.log(`Please visit the following URL to authenticate:\n${authUrl}\n`);

    // Create an Express app to handle the callback
    const app = express();

    app.get('/callback', async (req, res) => {
      try {
        // Validate the state
        if (req.query.state !== state) {
          throw new Error('State mismatch');
        }

        // Exchange the authorization code for tokens
        const tokenSet = await client.callback(`http://localhost:${localServerPort}/callback`, req.query, { state, nonce });

        // Fetch the user's information
        const userInfo = await client.userinfo(tokenSet.access_token);

        console.log('\nUser information:');
        console.log(userInfo);

        res.send('Authentication successful. You can close this window.');
        process.exit(0);
      } catch (err) {
        console.error(err);
        res.status(500).send('Authentication failed. Check the console for more information.');
        process.exit(1);
      }
    });

    // Start the local server
    app.listen(localServerPort, () => {
      console.log(`Local server listening on port ${localServerPort}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
