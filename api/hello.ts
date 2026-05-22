// Vercel serverless function example
// Access at: /api/hello

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { name = 'World' } = req.query;

  res.status(200).json({
    message: `Hello, ${name}! 👋`,
    timestamp: new Date().toISOString(),
  });
}
