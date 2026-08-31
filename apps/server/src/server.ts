import 'dotenv/config';
import { app, services } from './index.js';
import { startCleanupScheduler } from './schedulers/cleanup.scheduler.js';

startCleanupScheduler(services.cleanupService);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
