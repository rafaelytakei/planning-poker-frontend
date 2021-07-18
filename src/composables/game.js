import { firebase, user } from './firebase'
import to from 'await-to-js'
export const db = firebase.database()

export const cardSets = {
  Fibonacci: ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89'],
  'Multiples of 2': ['1', '2', '4', '8', '16', '32', '64', '128'],
}
export const createGame = async (
  gameName = 'Untitled',
  cards = cardSets.Fibonacci
) => {
  const newGame = {
    name: gameName,
    users: [],
    rounds: [],
    admins: [user.value.uid],
    cards,
  }
  const newGameKey = db.ref().child('games').push(newGame).key
  console.log(`New game created with key ${newGameKey}`)
  const [err] = await to(
    db.ref(`/users/${user.value.uid}/ownedGames/${newGameKey}`).set(true)
  )
  if (err) {
    console.log(err)
    return
  }
  return newGameKey
}

export const getGameInfo = async (gameId) => {
  const [err, snapshot] = await to(db.ref().child(`games/${gameId}`).get())
  if (err) {
    console.log('Error loading game info', err)
    return
  }
  if (snapshot.exists()) {
    return snapshot.val()
  } else {
    console.log(`No data available for game ${gameId}`)
    return
  }
}

export const connectUserToGame = async (gameId, userUid) => {
  const userInGame = await isUserInGame(gameId, userUid)
  if (userInGame) return
  const newUserRef = db.ref(`games/${gameId}/users/`).push()
  const [err] = await to(newUserRef.set(userUid))
  if (err) {
    console.log('Error adding user to game')
    return
  }
  console.log('user added to game successfully')
  newUserRef.onDisconnect().remove()
}

const isUserInGame = async (gameId, userUid) => {
  const usersRef = db.ref(`games/${gameId}/users`)
  const [err, snapshot] = await to(usersRef.get())
  if (err) {
    console.log('Error retrieving users in game')
    return
  }
  if (!snapshot.exists()) return false
  const values = Object.values(snapshot.val())
  if (values.includes(userUid)) {
    console.log('User is already in the game')
    return true
  }

  return false
}

export const addMultipleRoundsToGame = async (gameId, roundsInfo) => {
  const gameRoundsRef = db.ref(`/games/${gameId}/rounds`)
  const [getRoundsErr, snapshot] = await to(gameRoundsRef.get())
  if (getRoundsErr) {
    console.log(`Error loading rounds from game ${gameId}`)
    return
  }
  let nextRoundOrder = 0
  if (snapshot.exists()) {
    console.log(snapshot.val())
    nextRoundOrder = Object.keys(snapshot.val()).length
  }
  const roundsInfoWithOrder = roundsInfo.map((roundInfo) => {
    return {
      order: nextRoundOrder++,
      ...roundInfo,
    }
  })

  for (const roundInfo of roundsInfoWithOrder) {
    await addRoundToGame(gameId, roundInfo)
  }
}
export const addRoundToGame = async (gameId, roundInfo) => {
  const gameRoundsRef = db.ref(`/games/${gameId}/rounds`)

  const newRoundRef = gameRoundsRef.push()
  const [err] = await to(newRoundRef.set(roundInfo))
  if (err) {
    console.log('Error adding round to game')
    return
  }
}

export const changeRoundsOrder = (
  gameId,
  roundAId,
  roundBId,
  newRoundAOrder,
  newRoundBOrder
) => {
  const updates = {}
  updates[`${roundAId}/order`] = newRoundAOrder
  updates[`${roundBId}/order`] = newRoundBOrder
  db.ref(`/games/${gameId}/rounds/`).update(updates)
}

export const getUserGames = async (userUid) => {
  const userGamesRef = db.ref(`/users/${userUid}/ownedGames`)
  const [err, snapshot] = await to(userGamesRef.get())
  if (err) {
    console.log('Error retrieving owned games')
    return
  }
  if (!snapshot.exists()) return []
  const gamesIds = Object.keys(snapshot.val())
  const games = await Promise.all(
    gamesIds.map(async (gameId) => await getGameInfo(gameId))
  )
  return games
}
