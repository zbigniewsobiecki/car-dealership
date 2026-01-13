import app from './app.js';
import { env } from './config/env.js';
import { dbUtils } from './models/db.js';

const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await dbUtils.testConnection();
    if (!dbConnected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Start server
    const server = app.listen(env.port, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚗 Car Dealership Management API                       ║
║                                                           ║
║   Server running on: http://localhost:${env.port}           ║
║   Environment: ${env.nodeEnv}                            ║
║   Database: ${env.db.name}                               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n${signal} received. Closing server gracefully...`);
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
