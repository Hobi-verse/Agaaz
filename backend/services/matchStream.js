const Match = require('../models/Match');

const clients = new Set();

function sendMatches(res, matches) {
  if (res.writableEnded || res.destroyed) return;
  res.write(`event: matches\ndata: ${JSON.stringify(matches)}\n\n`);
}

async function notifyMatchesChanged() {
  if (clients.size === 0) return;
  try {
    const matches = await Match.find().sort({ scheduledAt: -1, createdAt: -1 }).lean();
    for (const client of clients) sendMatches(client, matches);
  } catch (error) {
    console.error('Unable to publish match updates:', error.message);
  }
}

async function streamMatches(req, res) {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders?.();
  res.write(': connected\n\n');
  clients.add(res);

  const heartbeat = setInterval(() => {
    if (!res.writableEnded && !res.destroyed) res.write(': keep-alive\n\n');
  }, 25000);

  res.on('close', () => {
    clearInterval(heartbeat);
    clients.delete(res);
  });

  try {
    const matches = await Match.find().sort({ scheduledAt: -1, createdAt: -1 }).lean();
    sendMatches(res, matches);
  } catch (error) {
    if (!res.writableEnded && !res.destroyed) res.end();
    clients.delete(res);
    clearInterval(heartbeat);
  }
}

module.exports = { streamMatches, notifyMatchesChanged };
