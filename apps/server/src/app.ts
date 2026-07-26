import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import router from './routes/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const publicPath = path.join(__dirname, '../public');
  app.use(express.static(publicPath));

  app.get('/{*splat}', (_req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

export default app;
