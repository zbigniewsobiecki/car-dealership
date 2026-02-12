package EntityStateMachines {
    import DataModel::*;
    import DomainEntities::*;
    import DomainEnums::*;
    @SourceFile {
        :>> path = "packages/shared-types/src/enums/vehicle-status.enum.ts";
    }
    state def VehicleLifecycle {
        transition first Available then Reserved;
        transition first Reserved then Sold;
        transition first Reserved then Available;
        transition first Available then Maintenance;
        transition first Maintenance then Available;
        state Available;
        state Reserved;
        state Sold;
        state Maintenance;
    }
    @SourceFile {
        :>> path = "packages/shared-types/src/enums/sale-status.enum.ts";
    }
    state def SaleLifecycle {
        transition first Pending then Completed;
        transition first Pending then Cancelled;
        state Pending;
        state Completed;
        state Cancelled;
    }
    // Bindings to Enums
    item def VehicleStatusBehavior {
        exhibit state VehicleLifecycle {
            state 'Available redefines VehicleLifecycle:' {
                doc /* Bound to VehicleStatus::AVAILABLE */
            }
            state 'Reserved redefines VehicleLifecycle:' {
                doc /* Bound to VehicleStatus::RESERVED */
            }
            state 'Sold redefines VehicleLifecycle:' {
                doc /* Bound to VehicleStatus::SOLD */
            }
            state 'Maintenance redefines VehicleLifecycle:' {
                doc /* Bound to VehicleStatus::MAINTENANCE */
            }
        }
    }
    item def SaleStatusBehavior {
        exhibit state SaleLifecycle {
            state 'Pending redefines SaleLifecycle:' {
                doc /* Bound to SaleStatus::PENDING */
            }
            state 'Completed redefines SaleLifecycle:' {
                doc /* Bound to SaleStatus::COMPLETED */
            }
            state 'Cancelled redefines SaleLifecycle:' {
                doc /* Bound to SaleStatus::CANCELLED */
            }
        }
    }
    @SourceFile {
        :>> path = "packages/shared-types/src/entities/user.types.ts";
    }
    state def UserLifecycle {
        transition toInactive first Active then Inactive;
        transition toActive first Inactive then Active;
        state Active;
        state Inactive;
    }

    item def UserStatusBehavior {
        exhibit state UserLifecycle {
            state 'Active redefines UserLifecycle:' {
                doc /* Bound to User::isActive = true */
            }
            state 'Inactive redefines UserLifecycle:' {
                doc /* Bound to User::isActive = false */
            }
        }
    }
}
