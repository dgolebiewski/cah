import db from '../../db';

const fs = require('fs');

export function get(req, res, next) {
  const { slug } = req.params;

  const deck = db.getDeck(slug);

  if (deck) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });

    res.end(deck);
  } else {
    res.writeHead(404, {
      'Content-Type': 'application/json',
    });

    res.end(
      JSON.stringify({
        message: `Not found`,
      }),
    );
  }
}
