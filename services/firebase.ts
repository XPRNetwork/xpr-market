import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import getConfig from 'next/config';
import { Collection } from './collections';
const { publicRuntimeConfig } = getConfig();

const initializeFirebase = async () => {
  try {
    firebase.initializeApp(publicRuntimeConfig.firebase);
    firebase.auth().signInAnonymously();
  } catch (err) {
    if (!/already exists/.test(err.message)) {
      console.error('Firebase initialization error', err.stack);
    }
  }

  return firebase.firestore();
};

export const useFirebaseFeaturedCollections = (): Collection[] => {
  const [featuredCollections, setFeaturedCollections] = useState<Collection[]>(
    []
  );

  useEffect(() => {
    (async () => {
      const db = await initializeFirebase();
      db.collection('featuredCollections')
        .orderBy('order', 'asc')
        .onSnapshot((snapshot) => {
          if (snapshot.size) {
            const firebaseCollections: Collection[] = [];
            snapshot.forEach((doc) => {
              firebaseCollections.push(doc.data() as Collection);
            });
            setFeaturedCollections(firebaseCollections);
          }
        });
    })();
  }, []);

  return featuredCollections;
};
