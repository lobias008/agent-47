Imagine you're a trader—new or old, it doesn't matter. If FOMO attacks you, your hard-earned capital is instantly at risk. But not anymore. Deleting human bias from the execution loop: Introducing Agent 47 to you.

# Agent 47

**Product:** Autonomous Emotional Circuit Breaker  
**Track:** Track 1 - Trading Agent  
**Team:** agent 47  
**Venue:** Bitget Playbook  
**SDK:** `@bitget-ai/getagent-skill`

## Executive Summary

Agent 47 is a Bitget Playbook trading agent designed to close the execution gap between a trader's plan and a trader's emotional behavior. The thesis is simple: when FOMO, loss chasing, or revenge trading appears, an objective system should enforce the capital protection rules before another order reaches the market.

The agent manages `BITGET:BGBUSDT` and `BITGET:BTCUSDT` with three hard safeguards: a 2.0% daily peak drawdown circuit breaker, a maximum of three execution cycles per rolling 24 hours, and an adaptive volatility filter that scales exposure down by 50% during abnormal spikes.

Agent 47 is not a prediction engine. It is a capital preservation and behavioral enforcement layer that can flatten positions, lock the system for 24 hours, throttle trade loops, and publish auditable decisions through `getagent.createPlaybook`.

## Installation

Node.js is currently missing from PATH on this machine. Install the official Node.js LTS build first, then open a new PowerShell terminal.

Verify the install:

```powershell
node -v
npm -v
npx -v
```

Install dependencies:

```powershell
npm install
```

Install the Bitget SDK helper:

```powershell
npx @bitget-ai/getagent-skill install
```

## Parameter Breakdown

| Parameter | Value |
| --- | --- |
| Asset pairs | `BITGET:BGBUSDT`, `BITGET:BTCUSDT` |
| Daily drawdown breaker | Hard `2.0%` peak-to-current equity drawdown |
| Drawdown breach action | Flatten active positions and lock system for `24h` |
| Anti-overtrading shield | Maximum `3` execution cycles per rolling `24h` |
| Volatility regime filter | Scale exposure down by `50%` during spikes |
| Deployment function | `getagent.createPlaybook` |
| Deployment pipeline | Compile, backtest, publish |

## Usage

Run a syntax check:

```powershell
npm run check
```

Deploy to Bitget Playbook:

```powershell
npm run deploy
```

Direct execution:

```powershell
node index.js
```

## Safety Note

Agent 47 is a risk-governance system. It does not guarantee profitability or remove market risk. Live deployment should use reviewed Bitget API permissions, isolated account controls, and conservative position limits.
