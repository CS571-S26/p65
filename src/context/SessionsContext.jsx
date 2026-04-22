import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const SessionsContext = createContext(null)
const SESSIONS_STORAGE_KEY = 'pokerSessions'
const HANDS_PER_HOUR_ESTIMATE = 30

const initialSessions = []

function getInitialSessions() {
  try {
    const storedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY)

    if (!storedSessions) {
      return initialSessions
    }

    const parsedSessions = JSON.parse(storedSessions)
    if (!Array.isArray(parsedSessions)) {
      return initialSessions
    }

    return sortSessionsByDate(parsedSessions)
  } catch {
    return initialSessions
  }
}

function sortSessionsByDate(sessions) {
  return [...sessions].sort((first, second) => {
    return new Date(second.date).getTime() - new Date(first.date).getTime()
  })
}

function getBigBlindFromGame(game) {
  const match = game.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/)
  if (!match) {
    return null
  }

  return Number(match[2])
}

export function SessionsProvider({ children }) {
  const [sessions, setSessions] = useState(getInitialSessions)

  useEffect(() => {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions))
  }, [sessions])

  const addSession = (sessionDraft) => {
    const buyIn = Number(sessionDraft.buyIn)
    const buyOut = Number(sessionDraft.buyOut)

    const normalizedSession = {
      id: Date.now(),
      date: sessionDraft.date,
      game: sessionDraft.game.trim(),
      hours: Number(sessionDraft.hours),
      buyIn,
      buyOut,
      result: buyOut - buyIn,
      isOnline: Boolean(sessionDraft.isOnline),
      location: sessionDraft.location.trim()
    }

    setSessions((currentSessions) => sortSessionsByDate([...currentSessions, normalizedSession]))
  }

  const updateSession = (sessionId, sessionDraft) => {
    const buyIn = Number(sessionDraft.buyIn)
    const buyOut = Number(sessionDraft.buyOut)

    setSessions((currentSessions) => {
      const updatedSessions = currentSessions.map((session) => {
        if (session.id !== sessionId) {
          return session
        }

        return {
          ...session,
          date: sessionDraft.date,
          game: sessionDraft.game.trim(),
          hours: Number(sessionDraft.hours),
          buyIn,
          buyOut,
          result: buyOut - buyIn,
          isOnline: Boolean(sessionDraft.isOnline),
          location: sessionDraft.location.trim()
        }
      })

      return sortSessionsByDate(updatedSessions)
    })
  }

  const deleteSession = (sessionId) => {
    setSessions((currentSessions) => currentSessions.filter((session) => session.id !== sessionId))
  }

  const stats = useMemo(() => {
    if (sessions.length === 0) {
      return {
        totalProfit: 0,
        sessionsPlayed: 0,
        averagePerSession: 0,
        totalHours: 0,
        hourlyRate: 0,
        bbPer100: null,
        averageSessionLength: 0,
        averageBuyIn: 0,
        biggestWin: 0,
        biggestLoss: 0
      }
    }

    const totalProfit = sessions.reduce((accumulator, session) => accumulator + session.result, 0)
    const totalHours = sessions.reduce((accumulator, session) => accumulator + session.hours, 0)
    const averageSessionLength = totalHours / sessions.length
    const averageBuyIn = sessions.reduce((accumulator, session) => {
      return accumulator + (session.buyIn ?? 0)
    }, 0) / sessions.length
    const biggestWin = sessions.reduce((currentMax, session) => {
      return Math.max(currentMax, session.result)
    }, sessions[0].result)
    const biggestLoss = sessions.reduce((currentMin, session) => {
      return Math.min(currentMin, session.result)
    }, sessions[0].result)

    const bbSessions = sessions
      .map((session) => ({
        ...session,
        bigBlind: getBigBlindFromGame(session.game)
      }))
      .filter((session) => session.bigBlind && session.hours > 0)

    const totalBigBetsWon = bbSessions.reduce((accumulator, session) => {
      return accumulator + (session.result / session.bigBlind)
    }, 0)
    const estimatedHands = bbSessions.reduce((accumulator, session) => {
      return accumulator + (session.hours * HANDS_PER_HOUR_ESTIMATE)
    }, 0)
    const bbPer100 = estimatedHands > 0 ? (totalBigBetsWon / estimatedHands) * 100 : null

    return {
      totalProfit,
      sessionsPlayed: sessions.length,
      averagePerSession: totalProfit / sessions.length,
      totalHours,
      hourlyRate: totalHours > 0 ? totalProfit / totalHours : 0,
      bbPer100,
      averageSessionLength,
      averageBuyIn,
      biggestWin,
      biggestLoss
    }
  }, [sessions])

  const value = useMemo(() => ({
    sessions,
    stats,
    addSession,
    updateSession,
    deleteSession
  }), [sessions, stats])

  return <SessionsContext.Provider value={value}>{children}</SessionsContext.Provider>
}

export function useSessions() {
  const context = useContext(SessionsContext)

  if (!context) {
    throw new Error('useSessions must be used inside SessionsProvider')
  }

  return context
}
