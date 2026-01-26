import { User, UserRole, CreateUserDto } from '@car-dealership/shared-types';

let userIdCounter = 1;

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: `user-${userIdCounter++}`,
  email: `user${userIdCounter}@example.com`,
  firstName: 'Test',
  lastName: 'User',
  role: UserRole.SALESPERSON,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockUserWithPassword = (
  overrides: Partial<User & { passwordHash: string }> = {}
): User & { passwordHash: string } => ({
  ...createMockUser(overrides),
  passwordHash: '$2a$10$hashedpassword',
  ...overrides,
});

export const createMockCreateUserDto = (
  overrides: Partial<CreateUserDto> = {}
): CreateUserDto => ({
  email: `newuser${userIdCounter++}@example.com`,
  password: 'password123',
  firstName: 'New',
  lastName: 'User',
  role: UserRole.SALESPERSON,
  ...overrides,
});

export const resetUserIdCounter = () => {
  userIdCounter = 1;
};
