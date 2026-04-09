import '../App.css'
import { Card, Container } from 'react-bootstrap'

export default function AboutPage() {
  return (
    <Container className="py-4">
      <Card className="p-2">
        <Card.Body>
          <h2 className="mb-3">About ChipStack</h2>
          <p>
            ChipStack is a simple poker ledger for tracking cash games, tournaments, and overall
            results in one place.
          </p>
          <p className="mb-0">
            The dashboard gives you a quick read on profit, volume, and averages, while the
            sessions page keeps every session organized in a simple card layout. A built-in
            light and dark mode keeps the app comfortable in any environment.
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}
