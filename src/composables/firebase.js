import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { ref } from 'vue'

const firebaseConfig = {
  apiKey: 'AIzaSyA9W5gLUevOmZlZVpjBiROeyKhJVnOTX1Q',
  authDomain: 'planning-poker-ad3de.firebaseapp.com',
  projectId: 'planning-poker-ad3de',
  storageBucket: 'planning-poker-ad3de.appspot.com',
  messagingSenderId: '854504189677',
  appId: '1:854504189677:web:81a3af7e4438fb82b9e6e4',
  measurementId: 'G-QPMTB1WC75',
  databaseURL: 'https://planning-poker-ad3de-default-rtdb.firebaseio.com/',
}
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
} else {
  firebase.app()
}
export const user = ref(null)
export const initialized = ref(false)
export const firebaseAuth = firebase.auth()

export const getUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      unsubscribe()
      resolve(user)
    }, reject)
  })
}
firebaseAuth.onAuthStateChanged((u) => {
  initialized.value = true
  user.value = u
})

export const logout = async () => {
  await firebaseAuth.signOut()
}
export { firebase }
