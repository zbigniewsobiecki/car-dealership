import bcrypt from 'bcryptjs';

export const passwordUtils = {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  },

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },
};
