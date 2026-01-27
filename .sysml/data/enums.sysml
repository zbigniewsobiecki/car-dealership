package DomainEnums {
    import SysMLPrimitives::*;
    @SourceFile {
        :>> path = "packages/shared-types/src/enums/roles.enum.ts";
    }
    enum def UserRole {
        admin;
        salesperson;
        manager;
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/enums/sale-status.enum.ts";
    }
    enum def SaleStatus {
        pending;
        completed;
        cancelled;
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/enums/vehicle-status.enum.ts";
    }
    enum def VehicleStatus {
        available;
        sold;
        reserved;
        maintenance;
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/enums/vehicle-status.enum.ts";
    }
    enum def VehicleCondition {
        new;
        used;
        certified_pre_owned;
    }
}
