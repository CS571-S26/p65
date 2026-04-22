import '../App.css'
import { Container, Row } from 'react-bootstrap'
import SessionCard from '../components/SessionCard.jsx'
import AddSessionModal from '../components/AddSessionModal.jsx'
import { useSessions } from '../context/SessionsContext.jsx'

export default function SessionsPage() {
  const { sessions } = useSessions()

  return (
    <Container className="py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-2">
        <h1 className="mb-0">Sessions</h1>
        <AddSessionModal className="px-4" />
      </div>
      <p className="text-muted mb-4">Your recent poker sessions will appear here.</p>

      {sessions.length > 0 ? (
        <Row className="g-3">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </Row>
      ) : (
        <p className="text-muted">No sessions recorded yet. Add your first one to get started.</p>
      )}
    </Container>
  )
}
