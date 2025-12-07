import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { holeDatenbank } from '$lib/server/mongo';

function mappeRechnung(dokument: any) {
  const { _id, ...rest } = dokument;
  return {
    id: _id.toString(),
    ...rest
  };
}

export const GET: RequestHandler = async () => {
  const db = await holeDatenbank();
  const sammlung = db.collection('rechnungen');

  const daten = await sammlung
    .find({})
    .sort({ faelligAm: 1 })
    .toArray();

  return json(daten.map(mappeRechnung));
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => null);

  if (!body) {
    throw error(400, 'Ungültige JSON-Daten');
  }

  const { titel, betrag, faelligAm, kategorie, belegBild } = body;

  if (!titel || !betrag || !faelligAm || !kategorie) {
    throw error(
      400,
      'Titel, Betrag, Fälligkeitsdatum und Kategorie sind Pflichtfelder.'
    );
  }

  const db = await holeDatenbank();
  const sammlung = db.collection('rechnungen');

  const dokument = {
    titel,
    betrag: Number(betrag),
    faelligAm,
    kategorie,
    status: 'offen',
    belegBild: belegBild ?? null,
    notizen: '',
    erstelltAm: new Date().toISOString()
  };

  const ergebnis = await sammlung.insertOne(dokument);

  return json({
    id: ergebnis.insertedId.toString(),
    ...dokument
  });
};
