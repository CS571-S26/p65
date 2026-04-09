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

const performanceData = [
  { session: 'S1', profit: -40, bankroll: 960 },
  { session: 'S2', profit: 120, bankroll: 1080 },
  { session: 'S3', profit: 65, bankroll: 1145 },
  { session: 'S4', profit: -30, bankroll: 1115 },
  { session: 'S5', profit: 180, bankroll: 1295 },
  { session: 'S6', profit: 95, bankroll: 1390 }
]

export default function HomePage() {
  return (
    <Container className="py-4">
      <h1 className="mb-2">Dashboard</h1>
      <p className="text-muted mb-4">Track results, volume, and streaks across poker sessions.</p>

      <Row className="g-3">
        <Col xs={12} md={4}>
          <Card className="poker-card">
            <Card.Body>
              <Card.Title>Total Profit</Card.Title>
              <h3 className="mb-0">$0</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="poker-card">
            <Card.Body>
              <Card.Title>Sessions Played</Card.Title>
              <h3 className="mb-0">0</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="poker-card">
            <Card.Body>
              <Card.Title>Average / Session</Card.Title>
              <h3 className="mb-0">$0</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mt-0">
        <Col xs={12} lg={8}>
          <Card className="poker-card h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <Card.Title className="mb-1">Performance Graph</Card.Title>
                  <p className="text-muted mb-0">Example bankroll trend from recent sessions.</p>
                </div>
                <Badge bg="secondary" className="px-3 py-2 fw-normal">
                  MVP Sample
                </Badge>
              </div>

              <div className="dashboard-chart">
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
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={4}>
          <Card className="poker-card h-100">
            <Card.Body className="d-flex flex-column justify-content-between">
              <div>
                <Card.Title className="mb-2">Statistically Winning Player</Card.Title>
                <p className="text-muted mb-3">
                  Not enough info yet to compute.
                </p>
              </div>

              <div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Sample size</span>
                  <strong>6 sessions</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Recorded hours</span>
                  <strong>0.0</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Confidence</span>
                  <strong>Pending</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
