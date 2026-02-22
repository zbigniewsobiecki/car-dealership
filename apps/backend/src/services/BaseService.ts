import { BaseRepository, BaseFilters } from '../models/BaseRepository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';

export class BaseService<
  T, 
  CreateDto = Record<string, unknown>, 
  UpdateDto = Record<string, unknown>,
  Filters extends BaseFilters = BaseFilters
> {
  constructor(
    protected repository: BaseRepository<T, CreateDto, UpdateDto>,
    protected entityName: string
  ) {}

  async getAll(filters: Filters): Promise<{ data: T[]; total: number }> {
    return this.repository.findAll(filters);
  }

  async getById(id: string): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new AppError(404, `${this.entityName} not found`);
    }
    return entity;
  }

  async create(data: CreateDto, userId?: string): Promise<T> {
    return this.repository.create(data, userId);
  }

  async update(id: string, data: UpdateDto): Promise<T> {
    const entity = await this.repository.update(id, data);
    if (!entity) {
      throw new AppError(404, `${this.entityName} not found`);
    }
    return entity;
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const success = await this.repository.delete(id);
    if (!success) {
      throw new AppError(404, `${this.entityName} not found`);
    }
    return { success: true };
  }
}