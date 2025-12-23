import app from '@/server/app';

export default function handler(req, res) {
  return app(req, res);
}

// Disable Next.js default body parser to let Express handle it
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
