import { db } from '../firebaseConfig'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore'

// Colección base
const HABITS_COLLECTION = 'habitos'

// Agregar un nuevo hábito
export const crearHabito = async (habito) => {
  const docRef = await addDoc(collection(db, HABITS_COLLECTION), habito)
  return { ...habito, id: docRef.id }
}

// Obtener todos los hábitos
export const obtenerHabitos = async () => {
  const snapshot = await getDocs(collection(db, HABITS_COLLECTION))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// Actualizar un hábito por ID
export const actualizarHabito = async (id, datos) => {
  const ref = doc(db, HABITS_COLLECTION, id)
  await updateDoc(ref, datos)
}

// Eliminar un hábito por ID
export const eliminarHabito = async (id) => {
  const ref = doc(db, HABITS_COLLECTION, id)
  await deleteDoc(ref)
}