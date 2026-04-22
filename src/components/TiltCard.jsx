import { useEffect, useRef, useState } from 'react'
import { Card } from 'react-bootstrap'

const MAX_TILT_DEGREES = 9

function setTiltVariables(element, rotateX, rotateY, lift, scale, glowX, glowY) {
  element.style.setProperty('--tilt-rotate-x', `${rotateX}deg`)
  element.style.setProperty('--tilt-rotate-y', `${rotateY}deg`)
  element.style.setProperty('--tilt-lift', `${lift}px`)
  element.style.setProperty('--tilt-scale', `${scale}`)
  element.style.setProperty('--tilt-glow-x', `${glowX}%`)
  element.style.setProperty('--tilt-glow-y', `${glowY}%`)
}

export default function TiltCard({ className = '', children, ...props }) {
  const cardRef = useRef(null)
  const [canTilt, setCanTilt] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')

    const updateCanTilt = () => setCanTilt(mediaQuery.matches)

    updateCanTilt()
    mediaQuery.addEventListener('change', updateCanTilt)

    return () => {
      mediaQuery.removeEventListener('change', updateCanTilt)
    }
  }, [])

  const handlePointerMove = (event) => {
    if (!canTilt || !cardRef.current) {
      return
    }

    const rect = cardRef.current.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      return
    }

    const normalizedX = (event.clientX - rect.left) / rect.width
    const normalizedY = (event.clientY - rect.top) / rect.height
    const rotateY = (normalizedX - 0.5) * MAX_TILT_DEGREES * 2
    const rotateX = (0.5 - normalizedY) * MAX_TILT_DEGREES * 2

    setTiltVariables(
      cardRef.current,
      rotateX.toFixed(2),
      rotateY.toFixed(2),
      -3,
      1.012,
      Math.round(normalizedX * 100),
      Math.round(normalizedY * 100)
    )
  }

  const resetTilt = () => {
    if (!cardRef.current) {
      return
    }

    setTiltVariables(cardRef.current, 0, 0, 0, 1, 50, 50)
  }

  return (
    <Card
      ref={cardRef}
      className={`tilt-card ${className}`.trim()}
      onPointerEnter={resetTilt}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      {...props}
    >
      {children}
    </Card>
  )
}