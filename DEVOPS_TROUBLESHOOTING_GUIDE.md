# Agent 47 DevOps Troubleshooting Guide

## 1. System Setup Guide

PowerShell currently reports that `npm` and `npx` are not recognized. That means Node.js is either not installed globally or its installation directory was not added to the Windows `PATH`.

Install the official Node.js LTS release:

1. Open the official Node.js download page: <https://nodejs.org/en/download>
2. Select the **LTS** Windows installer. As of this guide, the official site lists Node.js `v24.17.0 LTS`.
3. Run the `.msi` installer.
4. Keep the default installer options enabled, especially the option that adds Node.js to `PATH`.
5. Close every open PowerShell window after installation.
6. Open a new PowerShell window so the updated environment variables load.

Verify installation:

```powershell
node -v
npm -v
npx -v
```

Expected result: each command prints a version number. If `node` works but `npm` or `npx` does not, reinstall Node.js LTS and ensure npm is selected in the installer.

## 2. Project Migration & Dependency Mapping

Current project directory:

```text
D:\OneDrive\Desktop\My agent
```

Recommended local structure:

```text
D:\OneDrive\Desktop\My agent
├─ package.json
├─ index.js
├─ README.md
├─ .gitignore
├─ AUTOMATED_TERMINAL_COMMANDS
├─ GITHUB_DEPLOYMENT_COMMANDS
└─ DEVOPS_TROUBLESHOOTING_GUIDE.md
```

The clean package baseline is:

```json
{
  "type": "module",
  "dependencies": {
    "@bitget-ai/getagent-skill": "latest"
  }
}
```

Use the saved `package.json` in this repository as the canonical project manifest. After Node.js is installed, run:

```powershell
cd "D:\OneDrive\Desktop\My agent"
npm install
```

## 3. index.js Configuration

The deployment module is saved at:

```text
D:\OneDrive\Desktop\My agent\index.js
```

It imports `@bitget-ai/getagent-skill`, embeds the verified Playbook API key requested for hackathon execution, configures `BITGET:BGBUSDT` and `BITGET:BTCUSDT`, and defines:

- A hard `2.0%` daily peak drawdown circuit breaker
- Immediate position flattening and open-order cancellation on drawdown breach
- A `24h` system lockout after breach
- An anti-overtrading shield capped at `3` execution cycles per rolling `24h`
- A volatility anomaly filter that cuts position sizing by `50%`
- A `compile -> backtest -> publish` deployment loop through `getagent.createPlaybook`

## 4. README.md

The repository README begins with the required narrative hook and then documents:

- Executive summary
- Installation
- Environment parameter definitions
- Deployment usage
- Agent risk parameters
- Safety notice

## 5. Automated Terminal Flow

After Node.js LTS is installed and PowerShell has been restarted, use:

```powershell
cd "D:\OneDrive\Desktop\My agent"
Get-Content .\AUTOMATED_TERMINAL_COMMANDS
```

Then run the commands from that file step by step. The sequence installs dependencies, invokes the Bitget SDK installer, executes `node index.js`, creates the public GitHub repository, commits the workspace, and pushes to `main`.
