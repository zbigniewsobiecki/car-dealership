import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RepairStatus } from '@car-dealership/shared-types';

// Mock the db module
const { mockQuery } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
}));

vi.mock('../../../src/models/db.js', () => ({
  query: mockQuery,
}));

// Import RepairModel after mocking db
import { RepairModel } from '../../../src/models/Repair.model.js';

describe('RepairModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findById', () => {
    it('should return repair when ID exists', async () => {
      const mockRepairRow = {
        id: 'repair-1',
        vehicle_id: 'vehicle-1',
        customer_id: 'customer-1',
        description: 'Engine oil change',
        status: RepairStatus.COMPLETED,
        cost: 150.00,
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-01-16'),
        technician: 'John Smith',
        notes: 'Used synthetic oil',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'user-1',
      };

      mockQuery.mockResolvedValue({ rows: [mockRepairRow] });

      const result = await RepairModel.findById('repair-1');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM repairs WHERE id = $1'),
        ['repair-1']
      );
      expect(result).toEqual({
        id: mockRepairRow.id,
        vehicleId: mockRepairRow.vehicle_id,
        customerId: mockRepairRow.customer_id,
        description: mockRepairRow.description,
        status: mockRepairRow.status,
        cost: mockRepairRow.cost,
        startDate: mockRepairRow.start_date,
        endDate: mockRepairRow.end_date,
        technician: mockRepairRow.technician,
        notes: mockRepairRow.notes,
        createdAt: mockRepairRow.created_at,
        updatedAt: mockRepairRow.updated_at,
        createdBy: mockRepairRow.created_by,
      });
    });

    it('should return null when ID does not exist', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await RepairModel.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a new repair', async () => {
      const repairData = {
        vehicleId: 'vehicle-1',
        customerId: 'customer-1',
        description: 'Brake replacement',
        status: RepairStatus.PENDING,
        cost: 450.00,
        startDate: new Date('2024-02-20'),
        technician: 'John Smith',
        notes: 'Customer requested specific brake pads',
      };

      const mockCreatedRow = {
        id: 'repair-3',
        vehicle_id: repairData.vehicleId,
        customer_id: repairData.customerId,
        description: repairData.description,
        status: repairData.status,
        cost: repairData.cost,
        start_date: repairData.startDate,
        end_date: null,
        technician: repairData.technician,
        notes: repairData.notes,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'user-1',
      };

      mockQuery.mockResolvedValue({ rows: [mockCreatedRow] });

      const result = await RepairModel.create(repairData, 'user-1');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO repairs'),
        expect.arrayContaining([
          repairData.vehicleId,
          repairData.customerId,
          repairData.description,
          repairData.status,
          repairData.cost,
          repairData.startDate,
          repairData.technician,
          repairData.notes,
          'user-1',
        ])
      );
      expect(result).toEqual({
        id: mockCreatedRow.id,
        vehicleId: mockCreatedRow.vehicle_id,
        customerId: mockCreatedRow.customer_id,
        description: mockCreatedRow.description,
        status: mockCreatedRow.status,
        cost: mockCreatedRow.cost,
        startDate: mockCreatedRow.start_date,
        endDate: mockCreatedRow.end_date,
        technician: mockCreatedRow.technician,
        notes: mockCreatedRow.notes,
        createdAt: mockCreatedRow.created_at,
        updatedAt: mockCreatedRow.updated_at,
        createdBy: mockCreatedRow.created_by,
      });
    });
  });

  describe('update', () => {
    it('should update specific fields and return updated repair', async () => {
      const updateData = {
        status: RepairStatus.COMPLETED,
        endDate: new Date('2024-02-22'),
        cost: 500.00,
      };

      const mockUpdatedRow = {
        id: 'repair-1',
        vehicle_id: 'vehicle-1',
        customer_id: 'customer-1',
        description: 'Brake replacement',
        status: RepairStatus.COMPLETED,
        cost: 500.00,
        start_date: new Date('2024-02-20'),
        end_date: new Date('2024-02-22'),
        technician: 'John Smith',
        notes: 'Job completed successfully',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'user-1',
      };

      mockQuery.mockResolvedValue({ rows: [mockUpdatedRow] });

      const result = await RepairModel.update('repair-1', updateData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE repairs SET'),
        expect.arrayContaining([RepairStatus.COMPLETED, updateData.endDate, 500.00, 'repair-1'])
      );
      expect(result).toEqual({
        id: mockUpdatedRow.id,
        vehicleId: mockUpdatedRow.vehicle_id,
        customerId: mockUpdatedRow.customer_id,
        description: mockUpdatedRow.description,
        status: mockUpdatedRow.status,
        cost: mockUpdatedRow.cost,
        startDate: mockUpdatedRow.start_date,
        endDate: mockUpdatedRow.end_date,
        technician: mockUpdatedRow.technician,
        notes: mockUpdatedRow.notes,
        createdAt: mockUpdatedRow.created_at,
        updatedAt: mockUpdatedRow.updated_at,
        createdBy: mockUpdatedRow.created_by,
      });
    });

    it('should return null if repair not found during update', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await RepairModel.update('non-existent', { status: RepairStatus.COMPLETED });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should return true when deletion is successful', async () => {
      mockQuery.mockResolvedValue({ rowCount: 1 });

      const result = await RepairModel.delete('repair-1');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM repairs WHERE id = $1'),
        ['repair-1']
      );
      expect(result).toBe(true);
    });

    it('should return false when no rows are deleted', async () => {
      mockQuery.mockResolvedValue({ rowCount: 0 });

      const result = await RepairModel.delete('non-existent');

      expect(result).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should return all repairs with pagination', async () => {
      const mockRows = [
        {
          id: 'repair-1',
          vehicle_id: 'vehicle-1',
          customer_id: 'customer-1',
          description: 'Oil change',
          status: RepairStatus.COMPLETED,
          cost: 100.00,
          start_date: new Date('2024-01-15'),
          end_date: new Date('2024-01-16'),
          technician: 'John Smith',
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
          created_by: 'user-1',
          full_count: '2',
        },
        {
          id: 'repair-2',
          vehicle_id: 'vehicle-2',
          customer_id: 'customer-2',
          description: 'Brake replacement',
          status: RepairStatus.IN_PROGRESS,
          cost: 450.00,
          start_date: new Date('2024-02-10'),
          end_date: null,
          technician: 'Jane Doe',
          notes: 'Waiting for parts',
          created_at: new Date(),
          updated_at: new Date(),
          created_by: 'user-1',
          full_count: '2',
        },
      ];

      mockQuery.mockResolvedValue({ rows: mockRows });

      const result = await RepairModel.findAll();

      expect(mockQuery).toHaveBeenCalled();
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.data[0].description).toBe('Oil change');
      expect(result.data[1].description).toBe('Brake replacement');
    });

    it('should filter repairs by status', async () => {
      const mockRows = [
        {
          id: 'repair-1',
          vehicle_id: 'vehicle-1',
          customer_id: 'customer-1',
          description: 'Oil change',
          status: RepairStatus.COMPLETED,
          cost: 100.00,
          start_date: new Date('2024-01-15'),
          end_date: new Date('2024-01-16'),
          technician: 'John Smith',
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
          created_by: 'user-1',
          full_count: '1',
        },
      ];

      mockQuery.mockResolvedValue({ rows: mockRows });

      const result = await RepairModel.findAll({ status: RepairStatus.COMPLETED });

      expect(mockQuery).toHaveBeenCalled();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].status).toBe(RepairStatus.COMPLETED);
    });
  });
});
