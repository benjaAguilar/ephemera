import app from './app.js';
import { startCleanupScheduler } from './schedulers/cleanup.scheduler.js';
import { cleanupService } from './services/index.js';

startCleanupScheduler(cleanupService);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
