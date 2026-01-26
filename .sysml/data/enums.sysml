package DomainEnums {
    import SysMLPrimitives::*;
    
    doc /* Domain enumerations for roles, vehicle status, and sale status. */
    
    @SourceFile { :>> path = "packages/shared-types/src/enums/roles.enum.ts"; }
    enum def UserRole {
        ADMIN;
        SALESPERSON;
    }
    
    @SourceFile { :>> path = "packages/shared-types/src/enums/vehicle-status.enum.ts"; }
    enum def VehicleStatus {
        AVAILABLE;
        SOLD;
        RESERVED;
        MAINTENANCE;
    }
    
    @SourceFile { :>> path = "packages/shared-types/src/enums/vehicle-status.enum.ts"; }
    enum def VehicleCondition {
        NEW;
        USED;
        CERTIFIED_PRE_OWNED;
    }
    
    @SourceFile { :>> path = "packages/shared-types/src/enums/sale-status.enum.ts"; }
    enum def SaleStatus {
        PENDING;
        COMPLETED;
        CANCELLED;
    }
}
