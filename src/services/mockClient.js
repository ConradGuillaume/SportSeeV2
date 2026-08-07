import {
  USER_ACTIVITY,
  USER_AVERAGE_SESSIONS,
  USER_MAIN_DATA,
  USER_PERFORMANCE,
} from '../data/mockData.js'

function findByUserId(collection, userId, key = 'userId') {
  const item = collection.find((entry) => entry[key] === Number(userId))

  if (!item) {
    throw new Error(`No mock data for user ${userId}`)
  }

  return item
}

export async function getMockUser(userId) {
  return findByUserId(USER_MAIN_DATA, userId, 'id')
}

export async function getMockActivity(userId) {
  return findByUserId(USER_ACTIVITY, userId)
}

export async function getMockAverageSessions(userId) {
  return findByUserId(USER_AVERAGE_SESSIONS, userId)
}

export async function getMockPerformance(userId) {
  return findByUserId(USER_PERFORMANCE, userId)
}
