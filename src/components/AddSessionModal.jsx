import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useSessions } from '../context/SessionsContext.jsx'

const initialFormState = {
  date: '',
  game: '',
  hours: '',
  buyIn: '',
  buyOut: '',
  isOnline: false,
  location: ''
}

export default function AddSessionModal({ buttonLabel = 'Add Session', className = '' }) {
  const { addSession } = useSessions()
  const [showModal, setShowModal] = useState(false)
  const [formState, setFormState] = useState(initialFormState)
  const [isValidated, setIsValidated] = useState(false)

  const handleShow = () => setShowModal(true)

  const handleClose = () => {
    setShowModal(false)
    setFormState(initialFormState)
    setIsValidated(false)
  }

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target
    setFormState((currentState) => ({
      ...currentState,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const form = event.currentTarget
    if (!form.checkValidity()) {
      setIsValidated(true)
      return
    }

    addSession(formState)
    handleClose()
  }

  return (
    <>
      <Button variant="primary" className={className} type="button" onClick={handleShow}>
        {buttonLabel}
      </Button>

      <Modal show={showModal} onHide={handleClose} centered>
        <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Add Poker Session</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-3" controlId="sessionDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                required
                type="date"
                name="date"
                value={formState.date}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please select a date.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="sessionGame">
              <Form.Label>Game</Form.Label>
              <Form.Control
                required
                type="text"
                name="game"
                placeholder="1/2 NLH Cash"
                value={formState.game}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a game type.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="sessionHours">
              <Form.Label>Hours Played</Form.Label>
              <Form.Control
                required
                min="0.25"
                step="0.25"
                type="number"
                name="hours"
                placeholder="4.0"
                value={formState.hours}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid number of hours.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="sessionBuyIn">
              <Form.Label>Buy In ($)</Form.Label>
              <Form.Control
                required
                min="0"
                step="1"
                type="number"
                name="buyIn"
                placeholder="300"
                value={formState.buyIn}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please enter the buy in amount.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="sessionBuyOut">
              <Form.Label>Buy Out ($)</Form.Label>
              <Form.Control
                required
                min="0"
                step="1"
                type="number"
                name="buyOut"
                placeholder="450"
                value={formState.buyOut}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please enter the buy out amount.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="sessionType">
              <Form.Check
                type="switch"
                name="isOnline"
                checked={formState.isOnline}
                onChange={handleChange}
                label={formState.isOnline ? 'Online session' : 'In person session'}
              />
            </Form.Group>

            <Form.Group controlId="sessionLocation">
              <Form.Label>{formState.isOnline ? 'Platform' : 'Location'}</Form.Label>
              <Form.Control
                required
                type="text"
                name="location"
                placeholder={formState.isOnline ? 'Ignition, ACR, PokerStars...' : 'Casino name'}
                value={formState.location}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please enter {formState.isOnline ? 'a platform' : 'a location'}.
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline-secondary" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Session
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
