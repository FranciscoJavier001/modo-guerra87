import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const getUserHabitsCollection = () => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Usuario no autenticado');
  return collection(db, 'usuarios', user.uid, 'habitos');
};

export const crearHabito = async (habito) => {
  const ref = getUserHabitsCollection();
  const docRef = await addDoc(ref, habito);
  return { ...habito, id: docRef.id };
};

export const obtenerHabitos = async () => {
  const ref = getUserHabitsCollection();
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const actualizarHabito = async (id, datos) => {
  const uid = getAuth().currentUser.uid;
  const ref = doc(db, 'usuarios', uid, 'habitos', id);
  await updateDoc(ref, datos);
};

export const eliminarHabito = async (id) => {
  const uid = getAuth().currentUser.uid;
  const ref = doc(db, 'usuarios', uid, 'habitos', id);
  await deleteDoc(ref);
};


export const actualizarOrdenHabitos = async (items) => {
  // items: [{id, orden}]
  const uid = getAuth().currentUser.uid;
  const batch = writeBatch(db);
  for (const it of items) {
    const ref = doc(db, 'usuarios', uid, 'habitos', it.id);
    batch.update(ref, { orden: it.orden });
  }
  await batch.commit();
};
