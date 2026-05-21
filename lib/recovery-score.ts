export interface ScoreInput {
  trainingLoad: string
  issues: string[]
  previousResponse?: string
}

export interface ScoreResult {
  score: number
  label: string
  color: string
  ringColor: string
  drivers: string[]
  projectedGain: number
}

export function calculateRecoveryScore(input: ScoreInput): ScoreResult {
  let base = 82

  // Training load
  if (input.trainingLoad.includes('Extreme'))  base -= 34
  if (input.trainingLoad.includes('Heavy'))    base -= 22
  if (input.trainingLoad.includes('Moderate')) base -= 10
  if (input.trainingLoad.includes('Light'))    base -= 2

  // Issues
  for (const issue of input.issues) {
    if (issue.includes('Full body soreness'))   base -= 9
    if (issue.includes('Leg fatigue'))          base -= 6
    if (issue.includes('Lower back'))           base -= 8
    if (issue.includes('Upper body'))           base -= 5
    if (issue.includes('Mental fatigue'))       base -= 6
    if (issue.includes('Injury prevention'))    base -= 4
    if (issue.includes('Nothing specific'))     base += 6
  }

  // Returning user response
  if (input.previousResponse?.includes('great')) base += 9
  if (input.previousResponse?.includes('good'))  base += 5
  if (input.previousResponse?.includes('okay'))  base += 2
  if (input.previousResponse?.includes('poor'))  base -= 8

  // Clamp — never show 0 or 100, feels more credible
  const score = Math.max(16, Math.min(91, base))

  // Label + colours
  let label: string
  let color: string
  let ringColor: string

  if (score >= 75) {
    label = 'Optimised'
    color = '#06B6D4'
    ringColor = '#06B6D4'
  } else if (score >= 55) {
    label = 'Active Recovery'
    color = '#F59E0B'
    ringColor = '#F59E0B'
  } else if (score >= 38) {
    label = 'Recovery Priority'
    color = '#F97316'
    ringColor = '#F97316'
  } else {
    label = 'High Priority'
    color = '#EF4444'
    ringColor = '#EF4444'
  }

  // Driver explanations
  const drivers: string[] = []
  if (input.trainingLoad.includes('Extreme') || input.trainingLoad.includes('Heavy')) {
    drivers.push('High training load is suppressing readiness')
  }
  if (input.issues.some(i => i.includes('Full body') || i.includes('Leg fatigue'))) {
    drivers.push('Muscular fatigue detected across multiple groups')
  }
  if (input.issues.some(i => i.includes('Mental'))) {
    drivers.push('CNS and cognitive fatigue present')
  }
  if (input.issues.some(i => i.includes('Lower back'))) {
    drivers.push('Posterior chain stress flagged')
  }
  if (score >= 75) {
    drivers.push('Training load is within optimal recovery range')
    drivers.push('No significant stress markers reported')
  }

  // Projected gain — deterministic: proportional to how much room there is to improve
  const headroom = 94 - score
  const projectedGain = Math.max(4, Math.min(18, Math.floor(headroom * 0.18) + 8))

  return { score, label, color, ringColor, drivers: drivers.slice(0, 2), projectedGain }
}
