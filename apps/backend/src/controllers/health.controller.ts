import { Request, Response, NextFunction } from 'express';
import { dbUtils } from '../models/db.js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const healthController = {
  async check(_req: Request, res: Response, next: NextFunction) {
    try {
      const isDbUp = await dbUtils.testConnection();
      
      // Read package.json for version
      const packageJsonPath = join(__dirname, '../../package.json');
      const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
      const { version } = JSON.parse(packageJsonContent);

      const status = isDbUp ? 'ok' : 'error';
      
      res.status(isDbUp ? 200 : 503).json({
        status,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version,
        services: {
          database: isDbUp ? 'up' : 'down',
        },
      });
    } catch (error) {
      next(error);
    }
  },
};