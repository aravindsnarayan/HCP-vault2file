# HashiCorp Vault Secret Replacer

This GitHub Action fetches secrets from HashiCorp Vault and replaces placeholders in a template file.

## Inputs

- `vault-url`: The URL of the HashiCorp Vault instance. (Required)
- `vault-token`: The token for authenticating with Vault. (Required)
- `vault-secret-path`: The path to the secrets in Vault. (Required)
- `template-file`: The path to the template file. (Required)
- `output-file`: The path to the output file. The action will automatically create any missing directories in the output path. (Required)

## Example Usage

```yaml
name: Replace Secrets

on:
  push:
    branches:
      - main

jobs:
  replace:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Replace secrets
        uses: ./ # Uses the action in the root of the repository
        with:
          vault-url: 'https://your-vault-instance.com'
          vault-token: ${{ secrets.VAULT_TOKEN }}
          vault-secret-path: 'secret/data/my-app'
          template-file: '.env.template'
          output-file: '.env'
```
## Test Secret Setup

Add test secrets to Vault using these commands:

```bash
# Authenticate to Vault (replace with your token)
vault login

# Write test secrets to the required path
vault kv put secret/data/test \
  db_user="test_user" \
  db_password="secure_password_123" \
  api_key="test_api_key_abc123"
```

Note: Templates should use placeholders without dots: `{{ key }}`

Verify the secrets were created:
```bash
vault kv get secret/data/test
```

## Testing

To test the action locally:

1. Initialize Git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a `.env` file with:
```
VAULT_URL=https://your-vault-url
VAULT_TOKEN=your-token
```

3. Run the action using [act](https://github.com/nektos/act):
```bash
act -s VAULT_TOKEN=$(cat .env | grep VAULT_TOKEN | cut -d '=' -f2) -j test
```

4. Verify output files in `output/` directory
