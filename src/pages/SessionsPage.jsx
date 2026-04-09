import '../App.css'
import { Button, Container, Row } from 'react-bootstrap'
import SessionCard from '../components/SessionCard.jsx'

const sampleSessions = [
  {
    id: 1,
    date: 'Apr 4, 2026',
    game: '1/3 NLH Cash',
    hours: 4.5,
    result: 280,
    location: 'The Poker Room'
  }
]

export default function SessionsPage() {
  return (
    <Container className="py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-2">
        <h1 className="mb-0">Sessions</h1>
        <Button variant="primary" className="px-4" type="button">
          Add Session
        </Button>
      </div>
      <p className="text-muted mb-4">Your recent poker sessions will appear here.</p>

      <Row className="g-3">
        {sampleSessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </Row>
    </Container>
  )
}
