import { useMemo } from 'react'
import { Badge, Card, Col, Container, ProgressBar, Row, Table } from 'react-bootstrap'
import TiltCard from '../components/TiltCard.jsx'
import { useSessions } from '../context/SessionsContext.jsx'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount)
}

function formatDecimal(value, digits = 2) {
  return Number(value).toFixed(digits)
}

function formatPercent(value) {
  return `${formatDecimal(value, 1)}%`
}

function calculateMedian(values) {
  if (values.length === 0) {
    return 0
  }

  const sortedValues = [...values].sort((first, second) => first - second)
  const middleIndex = Math.floor(sortedValues.length / 2)

  if (sortedValues.length % 2 === 1) {
    return sortedValues[middleIndex]
  }

  return (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2
}

function calculateStandardDeviation(values) {
  if (values.length === 0) {
    return 0
  }

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const variance = values.reduce((sum, value) => {
    return sum + (value - mean) ** 2
  }, 0) / values.length

  return Math.sqrt(variance)
}

function getDayName(value) {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unknown'
  }

  return parsedDate.toLocaleDateString('en-US', { weekday: 'long' })
}

function makeEmptyTypeStats(label) {
  return {
    label,
    sessions: 0,
    wins: 0,
    totalProfit: 0,
    averageProfit: 0
  }
}

export default function StatisticsPage() {
  const { sessions } = useSessions()

  const analysis = useMemo(() => {
    if (sessions.length === 0) {
      return {
        sessionsPlayed: 0,
        profitableSessions: 0,
        losingSessions: 0,
        breakevenSessions: 0,
        profitabilityChance: 0,
        averageWin: 0,
        averageLoss: 0,
        medianResult: 0,
        volatility: 0,
        longestWinStreak: 0,
        longestLossStreak: 0,
        bestGame: null,
        bestDay: null,
        typeBreakdown: [makeEmptyTypeStats('Online'), makeEmptyTypeStats('In Person')]
      }
    }

    const results = sessions.map((session) => session.result)
    const profitableSessions = sessions.filter((session) => session.result > 0).length
    const losingSessions = sessions.filter((session) => session.result < 0).length
    const breakevenSessions = sessions.length - profitableSessions - losingSessions
    const averageWin =
      profitableSessions > 0
        ? sessions.filter((session) => session.result > 0).reduce((sum, session) => sum + session.result, 0) /
          profitableSessions
        : 0
    const averageLoss =
      losingSessions > 0
        ? sessions.filter((session) => session.result < 0).reduce((sum, session) => sum + session.result, 0) /
          losingSessions
        : 0
    const medianResult = calculateMedian(results)
    const volatility = calculateStandardDeviation(results)

    const streakSummary = sessions
      .slice()
      .reverse()
      .reduce(
        (summary, session) => {
          const isWin = session.result > 0
          const isLoss = session.result < 0

          summary.currentWin = isWin ? summary.currentWin + 1 : 0
          summary.currentLoss = isLoss ? summary.currentLoss + 1 : 0
          summary.longestWin = Math.max(summary.longestWin, summary.currentWin)
          summary.longestLoss = Math.max(summary.longestLoss, summary.currentLoss)

          return summary
        },
        { currentWin: 0, currentLoss: 0, longestWin: 0, longestLoss: 0 }
      )

    const gameStats = sessions.reduce((accumulator, session) => {
      const game = session.game || 'Unknown'
      if (!accumulator[game]) {
        accumulator[game] = { sessions: 0, totalProfit: 0 }
      }

      accumulator[game].sessions += 1
      accumulator[game].totalProfit += session.result
      return accumulator
    }, {})

    const bestGame = Object.entries(gameStats)
      .map(([game, data]) => ({
        game,
        sessions: data.sessions,
        totalProfit: data.totalProfit,
        averageProfit: data.totalProfit / data.sessions
      }))
      .sort((first, second) => second.totalProfit - first.totalProfit || second.sessions - first.sessions)[0]

    const dayStats = sessions.reduce((accumulator, session) => {
      const dayName = getDayName(session.date)
      if (!accumulator[dayName]) {
        accumulator[dayName] = { sessions: 0, totalProfit: 0 }
      }

      accumulator[dayName].sessions += 1
      accumulator[dayName].totalProfit += session.result
      return accumulator
    }, {})

    const bestDay = Object.entries(dayStats)
      .map(([day, data]) => ({
        day,
        sessions: data.sessions,
        totalProfit: data.totalProfit,
        averageProfit: data.totalProfit / data.sessions
      }))
      .sort((first, second) => second.averageProfit - first.averageProfit || second.totalProfit - first.totalProfit)[0]

    const typeBreakdown = [
      makeEmptyTypeStats('Online'),
      makeEmptyTypeStats('In Person')
    ]

    sessions.forEach((session) => {
      const typeIndex = session.isOnline ? 0 : 1
      typeBreakdown[typeIndex].sessions += 1
      typeBreakdown[typeIndex].totalProfit += session.result
      if (session.result > 0) {
        typeBreakdown[typeIndex].wins += 1
      }
    })

    typeBreakdown.forEach((typeStats) => {
      typeStats.averageProfit = typeStats.sessions > 0 ? typeStats.totalProfit / typeStats.sessions : 0
      typeStats.winRate = typeStats.sessions > 0 ? (typeStats.wins / typeStats.sessions) * 100 : 0
    })

    return {
      sessionsPlayed: sessions.length,
      profitableSessions,
      losingSessions,
      breakevenSessions,
      profitabilityChance: (profitableSessions / sessions.length) * 100,
      averageWin,
      averageLoss,
      medianResult,
      volatility,
      longestWinStreak: streakSummary.longestWin,
      longestLossStreak: streakSummary.longestLoss,
      bestGame,
      bestDay,
      typeBreakdown
    }
  }, [sessions])

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h1 className="page-title page-title-statistics mb-2">Statistics</h1>
        <p className="text-muted mb-0">
          A deeper look at your results
        </p>
      </div>

      <Row className="g-3">
        <Col xs={12} md={6} lg={4}>
          <TiltCard className="poker-card dashboard-stat-card h-100">
            <Card.Body>
              <Card.Title>Chance of Being Profitable</Card.Title>
              <h2 className="mb-2">{formatPercent(analysis.profitabilityChance)}</h2>
              <ProgressBar
                now={analysis.profitabilityChance}
                variant={analysis.profitabilityChance >= 50 ? 'success' : 'warning'}
                className="mb-2"
              />
              <p className="text-muted mb-0">
                Won {analysis.profitableSessions} of {analysis.sessionsPlayed} tracked sessions.
              </p>
            </Card.Body>
          </TiltCard>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <TiltCard className="poker-card dashboard-stat-card h-100">
            <Card.Body>
              <Card.Title>Average Winning Session</Card.Title>
              <h2 className="mb-2 text-success">{formatCurrency(analysis.averageWin)}</h2>
              <p className="text-muted mb-0">Average result across sessions that ended in profit.</p>
            </Card.Body>
          </TiltCard>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <TiltCard className="poker-card dashboard-stat-card h-100">
            <Card.Body>
              <Card.Title>Average Losing Session</Card.Title>
              <h2 className="mb-2 text-danger">{formatCurrency(analysis.averageLoss)}</h2>
              <p className="text-muted mb-0">Average drawdown across sessions that finished below zero.</p>
            </Card.Body>
          </TiltCard>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <TiltCard className="poker-card dashboard-stat-card h-100">
            <Card.Body>
              <Card.Title>Median Session Result</Card.Title>
              <h2 className="mb-2">{formatCurrency(analysis.medianResult)}</h2>
              <p className="text-muted mb-0">A quick look at the middle result in your sample.</p>
            </Card.Body>
          </TiltCard>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <TiltCard className="poker-card dashboard-stat-card h-100">
            <Card.Body>
              <Card.Title>Volatility</Card.Title>
              <h2 className="mb-2">{formatCurrency(analysis.volatility)}</h2>
              <p className="text-muted mb-0">Standard deviation of session results. Higher means wilder swings.</p>
            </Card.Body>
          </TiltCard>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <TiltCard className="poker-card dashboard-stat-card h-100">
            <Card.Body>
              <Card.Title>Break-even Sessions</Card.Title>
              <h2 className="mb-2">{analysis.breakevenSessions}</h2>
              <p className="text-muted mb-0">Sessions that landed exactly on zero profit.</p>
            </Card.Body>
          </TiltCard>
        </Col>
      </Row>

      <Row className="g-3 mt-0">
        <Col xs={12} md={6} lg={3}>
          <TiltCard className="poker-card dashboard-stat-card h-100">
            <Card.Body>
              <Card.Title>Longest Win Streak</Card.Title>
              <h3 className="mb-0 text-success">{analysis.longestWinStreak}</h3>
            </Card.Body>
          </TiltCard>
        </Col>

        <Col xs={12} md={6} lg={3}>
          <TiltCard className="poker-card dashboard-stat-card h-100">
            <Card.Body>
              <Card.Title>Longest Loss Streak</Card.Title>
              <h3 className="mb-0 text-danger">{analysis.longestLossStreak}</h3>
            </Card.Body>
          </TiltCard>
        </Col>

        <Col xs={12} md={6} lg={3}>
          <TiltCard className="poker-card dashboard-stat-card h-100">
            <Card.Body>
              <Card.Title>Best Game</Card.Title>
              <h3 className="mb-1">{analysis.bestGame ? analysis.bestGame.game : 'N/A'}</h3>
              <Badge bg="secondary" className="fw-normal">
                {analysis.bestGame ? formatCurrency(analysis.bestGame.totalProfit) : '$0'} total
              </Badge>
            </Card.Body>
          </TiltCard>
        </Col>

        <Col xs={12} md={6} lg={3}>
          <TiltCard className="poker-card dashboard-stat-card h-100">
            <Card.Body>
              <Card.Title>Best Day</Card.Title>
              <h3 className="mb-1">{analysis.bestDay ? analysis.bestDay.day : 'N/A'}</h3>
              <Badge bg="secondary" className="fw-normal">
                {analysis.bestDay ? formatCurrency(analysis.bestDay.averageProfit) : '$0'} average
              </Badge>
            </Card.Body>
          </TiltCard>
        </Col>
      </Row>

      <Row className="g-3 mt-0">
        <Col xs={12} lg={8}>
          <TiltCard className="poker-card dashboard-stat-card h-100">
            <Card.Body>
              <Card.Title className="mb-3">Type Breakdown</Card.Title>
              <div className="table-responsive">
                <Table hover borderless className="mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Sessions</th>
                      <th>Win Rate</th>
                      <th>Average Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.typeBreakdown.map((typeStats) => (
                      <tr key={typeStats.label}>
                        <td>{typeStats.label}</td>
                        <td>{typeStats.sessions}</td>
                        <td>{formatPercent(typeStats.winRate ?? 0)}</td>
                        <td>{formatCurrency(typeStats.averageProfit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </TiltCard>
        </Col>

        <Col xs={12} lg={4}>
          <TiltCard className="poker-card dashboard-stat-card h-100">
            <Card.Body>
              <Card.Title className="mb-3">Quick Read</Card.Title>
              <p className="mb-2">
                Your historical profit chance is {formatPercent(analysis.profitabilityChance)}.
              </p>
              <p className="mb-2">
                Median session result: {formatCurrency(analysis.medianResult)}.
              </p>
              <p className="mb-0">
                Most profitable game: {analysis.bestGame ? analysis.bestGame.game : 'N/A'}.
              </p>
            </Card.Body>
          </TiltCard>
        </Col>
      </Row>
    </Container>
  )
}