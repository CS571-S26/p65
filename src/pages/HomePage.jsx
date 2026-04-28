import '../App.css'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { Badge, Card, Col, Container, Row } from 'react-bootstrap'
import { useSessions } from '../context/SessionsContext.jsx'
import TiltCard from '../components/TiltCard.jsx'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount)
}

function formatDecimal(value) {
  return Number(value).toFixed(2)
}

export default function HomePage() {
  const { sessions, stats } = useSessions()

  const performanceData = sessions
    .slice()
    .reverse()
    .reduce((accumulator, session, index) => {
      const previousBankroll = accumulator[index - 1]?.bankroll ?? 1000
      accumulator.push({
        session: `S${index + 1}`,
        bankroll: previousBankroll + session.result
      })
      return accumulator
    }, [])

  const confidence = stats.sessionsPlayed >= 20 ? 'High' : stats.sessionsPlayed >= 10 ? 'Medium' : 'Low'

  return (
    <Container className="py-4">
      <h1 className="page-title page-title-dashboard mb-2">Dashboard</h1>
      <p className="text-muted mb-4">Quick info at a glance</p>

      <Row className="g-3">
        <Col xs={12} md={6} lg={4}>
          <TiltCard className="poker-card dashboard-stat-card">
            <Card.Body>
              <Card.Title>Total Profit</Card.Title>
              <h3 className="mb-0">{formatCurrency(stats.totalProfit)}</h3>
            </Card.Body>
          </TiltCard>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <TiltCard className="poker-card dashboard-stat-card">
            <Card.Body>
              <Card.Title>Sessions Played</Card.Title>
              <h3 className="mb-0">{stats.sessionsPlayed}</h3>
            </Card.Body>
          </TiltCard>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <TiltCard className="poker-card dashboard-stat-card">
            <Card.Body>
              <Card.Title>Average / Session</Card.Title>
              <h3 className="mb-0">{formatCurrency(stats.averagePerSession)}</h3>
            </Card.Body>
          </TiltCard>
        </Col>
      </Row>

      <Row className="g-3 mt-0">
        <Col xs={12} md={6} lg={3}>
          <TiltCard className="poker-card dashboard-stat-card">
            <Card.Body>
              <Card.Title>Hourly Rate</Card.Title>
              <h4 className="mb-0">{formatCurrency(stats.hourlyRate)}</h4>
            </Card.Body>
          </TiltCard>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <TiltCard className="poker-card dashboard-stat-card">
            <Card.Body>
              <Card.Title>BB/100</Card.Title>
              <h4 className="mb-0">
                {stats.bbPer100 === null ? 'N/A' : formatDecimal(stats.bbPer100)}
              </h4>
            </Card.Body>
          </TiltCard>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <TiltCard className="poker-card dashboard-stat-card">
            <Card.Body>
              <Card.Title>Total Hours Played</Card.Title>
              <h4 className="mb-0">{formatDecimal(stats.totalHours)}</h4>
            </Card.Body>
          </TiltCard>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <TiltCard className="poker-card dashboard-stat-card">
            <Card.Body>
              <Card.Title>Average Session Length</Card.Title>
              <h4 className="mb-0">{formatDecimal(stats.averageSessionLength)} hrs</h4>
            </Card.Body>
          </TiltCard>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <TiltCard className="poker-card dashboard-stat-card">
            <Card.Body>
              <Card.Title>Average Buy In</Card.Title>
              <h4 className="mb-0">{formatCurrency(stats.averageBuyIn)}</h4>
            </Card.Body>
          </TiltCard>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <TiltCard className="poker-card dashboard-stat-card">
            <Card.Body>
              <Card.Title>Biggest Win / Biggest Loss</Card.Title>
              <h4 className="mb-0">
                {formatCurrency(stats.biggestWin)} / {formatCurrency(stats.biggestLoss)}
              </h4>
            </Card.Body>
          </TiltCard>
        </Col>
      </Row>

      <Row className="g-3 mt-0">
        <Col xs={12} lg={8}>
          <TiltCard className="poker-card dashboard-chart-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <Card.Title className="mb-1">Performance Graph</Card.Title>
                  <p className="text-muted mb-0">Bankroll trend based on your recorded sessions.</p>
                </div>
                <Badge bg="secondary" className="px-3 py-2 fw-normal">
                  Live Data
                </Badge>
              </div>

              <div className="dashboard-chart">
                {performanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="bankrollFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#88c0d0" stopOpacity={0.24} />
                          <stop offset="95%" stopColor="#88c0d0" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(216, 222, 233, 0.08)" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="session"
                        tick={{ fill: 'rgba(216, 222, 233, 0.72)', fontSize: 12 }}
                        axisLine={{ stroke: 'rgba(216, 222, 233, 0.14)' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: 'rgba(216, 222, 233, 0.72)', fontSize: 12 }}
                        axisLine={{ stroke: 'rgba(216, 222, 233, 0.14)' }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(46, 52, 64, 0.98)',
                          border: '1px solid rgba(216, 222, 233, 0.12)',
                          borderRadius: '12px',
                          color: '#eceff4'
                        }}
                        cursor={{ stroke: 'rgba(136, 192, 208, 0.18)' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="bankroll"
                        stroke="#88c0d0"
                        strokeWidth={2}
                        fill="url(#bankrollFill)"
                        dot={{ r: 3, fill: '#88c0d0', strokeWidth: 0 }}
                        activeDot={{ r: 5 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted mb-0">No chart data yet. Add your first session to begin tracking.</p>
                )}
              </div>
            </Card.Body>
          </TiltCard>
        </Col>

      </Row>
    </Container>
  )
}
