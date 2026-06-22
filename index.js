import * as getagent from '@bitget-ai/getagent-skill';

const PLAYBOOK_API_KEY = '3aee01b2934d4afb9cf70e2f6fc3d28c';
const ASSET_PAIRS = Object.freeze(['BITGET:BGBUSDT', 'BITGET:BTCUSDT']);

const agentProfile = Object.freeze({
  id: 'agent-47',
  name: 'Agent 47: Autonomous Emotional Circuit Breaker',
  team: 'agent 47',
  track: 'Track 1 - Trading Agent',
  venue: 'Bitget',
  mission:
    'Prevent human execution gaps by enforcing objective capital protection rules before emotional trades reach the market.',
});

const riskRules = Object.freeze({
  dailyPeakDrawdownCircuitBreaker: {
    enabled: true,
    thresholdPct: 2.0,
    measurement: 'rolling_24h_equity_peak_to_current_equity',
    triggerCondition: 'drawdown_from_daily_peak_pct >= 2.0',
    breachActions: [
      'FLATTEN_ACTIVE_POSITIONS_IMMEDIATELY',
      'CANCEL_OPEN_ORDERS',
      'LOCK_SYSTEM_FOR_24H',
      'BLOCK_NEW_EXECUTION_CYCLES',
      'WRITE_CAPITAL_PROTECTION_AUDIT_EVENT',
    ],
    lockoutDurationHours: 24,
    state: 'RED_SYSTEM_LOCKED',
  },
  antiOvertradingShield: {
    enabled: true,
    maxExecutionCycles: 3,
    rollingWindowHours: 24,
    countedEvents: ['new_trade_cycle', 'post_loss_reentry', 'manual_strategy_reactivation'],
    breachActions: [
      'REJECT_ADDITIONAL_EXECUTION_CYCLE',
      'REQUIRE_COOLDOWN_REVALIDATION',
      'WRITE_BEHAVIORAL_RISK_AUDIT_EVENT',
    ],
    state: 'YELLOW_HIGH_ALERT',
  },
  adaptiveVolatilityRegimeFilter: {
    enabled: true,
    anomalyDetection: {
      realizedVolatilityLookback: '96 x 15m candles',
      triggerCondition: 'realized_volatility_z_score >= 2.0 OR liquidity_stress_detected',
      liquiditySignals: ['spread_widening', 'order_book_depth_decay', 'abnormal_slippage'],
    },
    exposureScaleDownPct: 50,
    breachActions: [
      'SCALE_EXPOSURE_DOWN_BY_50_PERCENT',
      'REVALIDATE_SIGNAL_QUALITY',
      'WRITE_VOLATILITY_REGIME_AUDIT_EVENT',
    ],
    state: 'YELLOW_VOLATILITY_DEFENSE',
  },
});

const behavioralPipeline = Object.freeze([
  {
    stage: 'Sentiment Ingestion',
    inputs: ['trader_log', 'loss_recency', 'urgency_language', 'manual_override_attempts'],
    output: 'sentiment_state_vector',
  },
  {
    stage: 'Intent Analysis',
    inputs: ['requested_action', 'sizing_delta', 'cycle_count_24h', 'plan_deviation'],
    output: 'execution_intent_classification',
  },
  {
    stage: 'Revenge Risk Score Calculation',
    inputs: ['sentiment_state_vector', 'drawdown_pct', 'execution_frequency', 'volatility_anomaly_flag'],
    output: 'policy_decision_allow_reduce_or_lock',
  },
]);

const playbookDefinition = Object.freeze({
  apiKey: PLAYBOOK_API_KEY,
  agent: agentProfile,
  markets: ASSET_PAIRS.map((symbol) => ({
    symbol,
    exchange: 'BITGET',
    instrumentType: 'USDT_PERPETUAL',
    executionEnabled: true,
  })),
  strategy: {
    name: 'Autonomous Emotional Circuit Breaker',
    category: 'capital_preservation_rule_enforcer',
    behavioralPipeline,
    riskRules,
    stateMachine: {
      GREEN_DISCIPLINED: 'Trading remains enabled inside all capital protection limits.',
      YELLOW_HIGH_ALERT: 'Execution is throttled, reduced, or requires revalidation.',
      RED_SYSTEM_LOCKED: 'Positions are flattened and new execution is locked for 24 hours.',
    },
  },
  backtest: {
    enabled: true,
    mode: 'automatic',
    benchmark: 'same market logic without emotional circuit breaker controls',
    successCriteria: [
      'daily peak drawdown remains capped at 2.0%',
      'execution cycles remain <= 3 per rolling 24h',
      'exposure is scaled down by 50% during volatility spikes',
      'all rejected or locked decisions produce audit events',
    ],
  },
  publish: {
    enabled: true,
    destination: 'Bitget Playbook dashboard',
    visibility: 'public-hackathon-submission',
    tags: ['agent-47', 'bitget', 'track-1', 'trading-agent', 'capital-protection'],
  },
});

function resolveCreatePlaybook() {
  const createPlaybook = getagent.createPlaybook ?? getagent.default?.createPlaybook;

  if (typeof createPlaybook !== 'function') {
    const exportedNames = Object.keys(getagent).sort().join(', ') || 'none';
    throw new TypeError(
      `Expected getagent.createPlaybook from @bitget-ai/getagent-skill. Available exports: ${exportedNames}`,
    );
  }

  return createPlaybook;
}

async function deployToBitgetPlaybook() {
  const createPlaybook = resolveCreatePlaybook();
  const deploymentSteps = ['compile', 'backtest', 'publish'];
  let finalResult = null;

  for (const step of deploymentSteps) {
    console.log(`[agent-47] ${step.toUpperCase()} started for ${ASSET_PAIRS.join(', ')}`);

    finalResult = await createPlaybook({
      ...playbookDefinition,
      deployment: {
        step,
        requestedAt: new Date().toISOString(),
      },
    });

    if (finalResult?.ok === false || finalResult?.status === 'failed' || finalResult?.error) {
      throw new Error(`Bitget Playbook ${step} failed: ${JSON.stringify(finalResult)}`);
    }

    console.log(`[agent-47] ${step.toUpperCase()} completed`);
  }

  return finalResult;
}

async function main() {
  console.log(agentProfile.name);
  console.log(`Team: ${agentProfile.team}`);
  console.log(`Asset pairs: ${ASSET_PAIRS.join(', ')}`);
  console.log('Rules: 2.0% drawdown flatten + 24h lock, 3 cycles/24h, 50% volatility exposure scale-down');

  const result = await deployToBitgetPlaybook();

  console.log('[agent-47] Bitget Playbook deployment pipeline completed.');
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error('[agent-47] deployment failed.');
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
