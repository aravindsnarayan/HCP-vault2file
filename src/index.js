const core = require('@actions/core');
const axios = require('axios');
const fs = require('fs').promises;

async function run() {
  try {
    // Get inputs
    const vaultUrl = core.getInput('vault-url', { required: true });
    const vaultToken = core.getInput('vault-token', { required: true });
    const vaultSecretPath = core.getInput('vault-secret-path', { required: true });
    const templateFile = core.getInput('template-file', { required: true });
    const outputFile = core.getInput('output-file', { required: true });

    // Fetch secrets from Vault
    const vaultAddr = `${vaultUrl}/v1/${vaultSecretPath}`;
    core.info(`Fetching secrets from ${vaultAddr}`)

    const response = await axios.get(vaultAddr, {
      headers: { 'X-Vault-Token': vaultToken },
    });

    const secrets = response.data.data.data;

    // Read template file
    let template = await fs.readFile(templateFile, 'utf8');

    // Replace placeholders
    for (const key in secrets) {
      const placeholder = `{{ ${key} }}`;
      template = template.replace(new RegExp(placeholder, 'g'), secrets[key]);
    }

    // Write to output file
    await fs.writeFile(outputFile, template);

    core.info(`Successfully replaced secrets in ${templateFile} and wrote to ${outputFile}`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
