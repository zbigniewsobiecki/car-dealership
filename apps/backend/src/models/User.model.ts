import { query } from './db.js';
import { User, CreateUserDto, UpdateUserDto } from '@car-dealership/shared-types';
import { BaseRepository } from './BaseRepository.js';

class UserRepository extends BaseRepository<User, CreateUserDto, UpdateUserDto> {
  constructor() {
    super({
      tableName: 'users',
      softDelete: false,
      defaultSortBy: 'created_at',
      defaultSortOrder: 'DESC',
      allowedSortFields: ['created_at', 'email', 'first_name', 'last_name'],
      allowedFilterFields: ['email', 'role', 'is_active'],
      fieldMap: {
        firstName: 'first_name',
        lastName: 'last_name',
        isActive: 'is_active',
        passwordHash: 'password_hash',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    });
  }

  async findByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return null;

    return this.dataMapper.mapRow<User & { passwordHash: string }>(result.rows[0]);
  }
}

export const UserModel = new UserRepository();
