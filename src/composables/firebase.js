import firebase from 'firebase/app'
import 'firebase/auth'
import { ref } from 'vue'

const firebaseConfig = {
  apiKey: 'AIzaSyA9W5gLUevOmZlZVpjBiROeyKhJVnOTX1Q',
  authDomain: 'planning-poker-ad3de.firebaseapp.com',
  projectId: 'planning-poker-ad3de',
  storageBucket: 'planning-poker-ad3de.appspot.com',
  messagingSenderId: '854504189677',
  appId: '1:854504189677:web:81a3af7e4438fb82b9e6e4',
  measurementId: 'G-QPMTB1WC75',
}
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
} else {
  firebase.app()
}
export const user = ref(null)
export const initialized = ref(false)
const firebaseAuth = firebase.auth()

firebaseAuth.onAuthStateChanged((u) => {
  initialized.value = true
  user.value = u
})

export const logout = async () => {
  await firebaseAuth.signOut()
}
export { firebase }