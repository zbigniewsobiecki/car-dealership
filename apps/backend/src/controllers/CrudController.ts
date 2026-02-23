import { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { BaseService } from '../services/BaseService.js';
import { BaseFilters } from '../models/BaseRepository.js';

/**
 * Generic CRUD controller that provides standard create, read, update, delete operations.
 * Extend this class and provide a service to get default CRUD functionality.
 * Override specific methods to customize behavior.
 */
export abstract class CrudController<
  T,
  CreateDto = Record<string, unknown>,
  UpdateDto = Record<string, unknown>,
  Filters extends BaseFilters = BaseFilters
> extends BaseController {
  protected service: BaseService<T, CreateDto, UpdateDto, Filters>;

  constructor(service: BaseService<T, CreateDto, UpdateDto, Filters>) {
    super();
    this.service = service;
  }

  /**
   * Get all entities with optional filtering and pagination
   * Override to customize filtering logic
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const filters = this.extractFilters(req);
    const { data, total } = await this.service.getAll(filters as Filters);
    return this.paginate(res, data, page, limit, total);
  });

  /**
   * Extract filters from request query parameters
   * Override to customize filter extraction
   */
  protected extractFilters(req: Request): Filters {
    return req.query as unknown as Filters;
  }

  /**
   * Get a single entity by ID
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const entity = await this.service.getById(req.params.id);
    return this.ok(res, entity);
  });

  /**
   * Create a new entity
   * Override to add custom creation logic (e.g., VIN validation)
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const entity = await this.service.create(req.body, req.user?.userId);
    return this.created(res, entity);
  });

  /**
   * Update an existing entity
   * Override to add custom update logic
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const entity = await this.service.update(req.params.id, req.body);
    return this.ok(res, entity);
  });

  /**
   * Delete an entity by ID
   * Override to add custom deletion logic (e.g., soft delete)
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.delete(req.params.id);
    return this.message(res, 'Deleted successfully');
  });
}