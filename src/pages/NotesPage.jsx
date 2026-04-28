import { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import TiltCard from '../components/TiltCard.jsx'

const NOTES_KEY = 'pokerNotes'

function formatDate(ts) {
  return new Date(ts).toLocaleString()
}

export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [draft, setDraft] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTES_KEY)
      if (raw) setNotes(JSON.parse(raw))
    } catch {
      setNotes([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    const trimmed = draft.trim()
    if (!trimmed) return

    const newNote = { id: Date.now(), text: trimmed, createdAt: Date.now() }
    setNotes((cur) => [newNote, ...cur])
    setDraft('')
  }

  const deleteNote = (id) => {
    setNotes((cur) => cur.filter((n) => n.id !== id))
  }

  return (
    <Container className="py-4">
      <div className="mb-4 d-flex justify-content-between align-items-start">
        <h1 className="page-title page-title-notes mb-2">Notes</h1>
      </div>

      <Row className="g-3">
        <Col xs={12}>
          <TiltCard className="poker-card">
            <Card.Body>
              <Form>
                <Form.Group controlId="noteDraft" className="mb-3">
                  <Form.Label className="mb-2">Quick Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Write something you want to remember..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                  />
                </Form.Group>
                <div className="d-flex gap-2 justify-content-end">
                  <Button variant="outline-secondary" onClick={() => setDraft('')}>Clear</Button>
                  <Button variant="primary" onClick={addNote}>Add Note</Button>
                </div>
              </Form>
            </Card.Body>
          </TiltCard>

          <div className="mt-3">
            {notes.length === 0 ? (
              <p className="text-muted">No notes yet — jot one down above.</p>
            ) : (
              <Row className="g-3">
                {notes.map((note) => (
                  <Col xs={12} md={6} key={note.id}>
                    <TiltCard className="poker-card">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div style={{ whiteSpace: 'pre-wrap' }}>{note.text}</div>
                          <div className="text-end">
                            <div className="text-muted small">{formatDate(note.createdAt)}</div>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="mt-2"
                              onClick={() => deleteNote(note.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </TiltCard>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  )
}
