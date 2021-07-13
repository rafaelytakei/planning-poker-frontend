import { firebase, user } from './firebase'
import to from 'await-to-js'
const db = firebase.firestore()

export const createGame = async (gameName = 'Untitled') => {
  const [err, res] = await to(
    db.collection('games').add({
      name: gameName,
      rounds: [],
      admins: [user.value.uid],
      activeUsers: [],
    })
  )
  if (err) {
    console.log('Error creating a new game', err)
    return
  }
  return res.id
}

export const getGameInfo = async (gameId) => {
  const [err, res] = await to(db.collection('games').doc(gameId).get())
  if (err) {
    console.log('Error loading game info', err)
    return
  }
  return res
}
