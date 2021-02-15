import db from '../../db';

export async function get({ query }, res) {
  const decks = await db.getDecks(query.search || '', query.page || 1);

  res.writeHead(200, {
    'Content-Type': 'application/json',
  });

  res.end(JSON.stringify(decks));
}
