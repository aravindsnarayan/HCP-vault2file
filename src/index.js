const core = require('@actions/core');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

async function run() {
  try {
    // Get inputs
    const vaultUrl = core.getInput('vault-url', { required: true });
    const vaultUsername = core.getInput('vault-username', { required: true });
    const vaultPassword = core.getInput('vault-password', { required: true });
    const vaultSecretPath = core.getInput('vault-secret-path', { required: true });
    const templateFile = core.getInput('template-file', { required: true });
    const outputFile = core.getInput('output-file', { required: true });

    // Authenticate with Vault using username and password
    const authResponse = await axios.post(`${vaultUrl}/v1/auth/userpass/login/${vaultUsername}`, {
      password: vaultPassword
    });

    const clientToken = authResponse.data.auth.client_token;

    // Fetch secrets from Vault
    const vaultAddr = `${vaultUrl}/v1/${vaultSecretPath}`;
    core.info(`Fetching secrets from ${vaultAddr}`)

    const secretsResponse = await axios.get(vaultAddr, {
      headers: { 'X-Vault-Token': clientToken },
    });

    const secrets = secretsResponse.data.data.data;

    // Read template file
    let template = await fs.readFile(templateFile, 'utf8');

    // Replace placeholders
    for (const key in secrets) {
      const placeholder = `{{ ${key} }}`;
      template = template.replace(new RegExp(placeholder, 'g'), secrets[key]);
    }

    // Write to output file
    const outputDir = path.dirname(outputFile);
    await fs.mkdir(outputDir, { recursive: true });
    
    await fs.writeFile(outputFile, template);

    core.info(`Successfully replaced secrets in ${templateFile} and wrote to ${outputFile}`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
