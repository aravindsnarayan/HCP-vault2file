# HCP Vault to File GitHub Action

Securely fetch secrets from HashiCorp Vault and generate configuration files from templates.

## Features
- 🔐 Authenticate with Vault using username/password
- 📝 Process template files with secret placeholders
- 📁 Automatically create output directories
- ⚡ Lightweight and fast

## Quick Start

1. Add the action to your workflow:
```yaml
- name: Fetch secrets from Vault
  uses: aravindsnarayan/HCP-vault2file@latest
  with:
    vault-url: ${{ vars.VAULT_ADDR }}
    vault-username: ${{ secrets.VAULT_USERNAME }}
    vault-password: ${{ secrets.VAULT_PASSWORD }}
    vault-secret-path: 'secret/data/your-app'
    template-file: 'templates/app-config.tpl'
    output-file: 'config/app-config.ini'
```

2. Create a template file with placeholders:
```ini
# templates/app-config.tpl
[database]
user = {{ db_user }}
password = {{ db_password }}
```

## Inputs

| Parameter | Description | Required |
|-----------|-------------|----------|
| `vault-url` | URL of HashiCorp Vault instance | Yes |
| `vault-username` | Username for Vault authentication | Yes |
| `vault-password` | Password for Vault authentication | Yes |
| `vault-secret-path` | Path to secrets in Vault | Yes |
| `template-file` | Path to template file | Yes |
| `output-file` | Output file path (directories auto-created) | Yes |

## Template Format
Use `{{ key }}` placeholders in your templates that match secret keys in Vault.

## Security Note
Always store credentials using GitHub Secrets. Never commit actual credentials to your repository.

## Example Workflow
```yaml
name: Production Deployment
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Generate Config from Vault
        uses: aravindsnarayan/HCP-vault2file@latest
        with:
          vault-url: ${{ vars.VAULT_ADDR }}
          vault-username: ${{ secrets.VAULT_USER }}
          vault-password: ${{ secrets.VAULT_PASS }}
          vault-secret-path: 'secret/data/prod/app'
          template-file: 'templates/app.conf.tpl'
          output-file: 'config/app.conf'
      
      - name: Deploy Application
        run: ./deploy.sh

## Publishing Releases

To create releases, you need to:

1. Create a Personal Access Token (PAT) with `repo` scope
2. Add it as a secret named `PAT` in your repository
3. Update the release workflow to use:
```yaml
env:
  GITHUB_TOKEN: ${{ secrets.PAT }}
```

### Troubleshooting

If you get "Resource not accessible by integration" errors:
1. Ensure you've created a PAT with `repo` scope
2. Add it as a repository secret named `PAT`
3. Update the release workflow to use `secrets.PAT` instead of `secrets.GITHUB_TOKEN`
