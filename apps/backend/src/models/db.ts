import { pool, query } from '../config/database.js';

export { pool, query };

export const dbUtils = {
  async testConnection(): Promise<boolean> {
    try {
      const result = await query('SELECT NOW()');
      console.log('Database connected successfully at:', result.rows[0].now);
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  },

  async tableExists(tableName: string): Promise<boolean> {
    const result = await query(
      'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)',
      [tableName]
    );
    return result.rows[0].exists;
  },
};
