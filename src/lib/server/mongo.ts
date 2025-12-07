import { MongoClient } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI ist nicht gesetzt (siehe .env)');
}

// Eine gemeinsame MongoDB-Verbindung für das ganze Projekt
const klient = new MongoClient(MONGODB_URI);
const klientVersprechen = klient.connect();

export async function holeDatenbank() {
  const verbindung = await klientVersprechen;
  // Datenbankname kannst du auch aus ENV ziehen, hier fix "billBuddy"
  return verbindung.db('billBuddy');
}
