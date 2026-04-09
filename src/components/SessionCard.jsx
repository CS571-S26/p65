import { Badge, Card, Col } from 'react-bootstrap'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount)
}

export default function SessionCard({ session }) {
  const isProfit = session.result >= 0

  return (
    <Col xs={12} md={6} lg={4}>
      <Card className="h-100 session-card poker-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Card.Title className="mb-0">{session.game}</Card.Title>
            <Badge bg={isProfit ? 'success' : 'danger'}>
              {isProfit ? '+' : ''}
              {formatCurrency(session.result)}
            </Badge>
          </div>

          <p className="text-muted mb-2">{session.date}</p>
          <p className="mb-1"><strong>Hours:</strong> {session.hours}</p>
          <p className="mb-0"><strong>Location:</strong> {session.location}</p>
        </Card.Body>
      </Card>
    </Col>
  )
}
