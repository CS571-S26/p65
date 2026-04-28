import '../App.css'
import { Card, Container } from 'react-bootstrap'
import TiltCard from '../components/TiltCard.jsx'

export default function AboutPage() {
  return (
    <Container className="py-4">
      <TiltCard className="p-2">
        <Card.Body>
          <h1 className="mb-3">About ChipStack</h1>
          <p>
            ChipStack is a simple poker ledger for tracking cash games, tournaments, and overall
            results in one place.
          </p>
          <p className="mb-0">
            Track sessions, bankroll, and performance with a clean, focused interface.
          </p>
          <p>Made by Aron Szucs</p>
        </Card.Body>
      </TiltCard>
    </Container>
  )
}
