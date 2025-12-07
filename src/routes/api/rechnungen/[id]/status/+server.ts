import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { holeDatenbank } from '$lib/server/mongo';
import { ObjectId } from 'mongodb';

export const PATCH: RequestHandler = async ({ params }) => {
  const { id } = params;

  if (!id) {
    throw error(400, 'Id fehlt');
  }

  const db = await holeDatenbank();
  const sammlung = db.collection('rechnungen');

  const _id = new ObjectId(id);
  const rechnung = await sammlung.findOne({ _id });

  if (!rechnung) {
    throw error(404, 'Rechnung nicht gefunden');
  }

  const neuerStatus = rechnung.status === 'offen' ? 'bezahlt' : 'offen';

  await sammlung.updateOne({ _id }, { $set: { status: neuerStatus } });

  const aktualisiert = { ...rechnung, status: neuerStatus };

  return json({
    id,
    titel: aktualisiert.titel,
    betrag: aktualisiert.betrag,
    faelligAm: aktualisiert.faelligAm,
    kategorie: aktualisiert.kategorie,
    status: aktualisiert.status,
    belegBild: aktualisiert.belegBild ?? null,
    notizen: aktualisiert.notizen ?? '',
    erstelltAm: aktualisiert.erstelltAm
  });
};