package EntityStateMachines {
    import SysMLPrimitives::*;
    import DomainEnums::*;
    doc /* Entity lifecycle state machines. */
    @SourceFile {
        :>> path = "packages/shared-types/src/enums/sale-status.enum.ts";
    }
    state def SaleLifecycle {
        transition toCompleted first pending then completed;
        transition toCancelled first pending then cancelled;
        state pending;
        state completed;
        state cancelled;
    }


    @SourceFile {
        :>> path = "packages/shared-types/src/enums/vehicle-status.enum.ts";
    }
    state def VehicleLifecycle {
        transition reserve first available then reserved;
        transition sell first available then sold;
        transition sellReserved first reserved then sold;
        transition maintain first available then maintenance;
        transition ready first maintenance then available;
        state available;
        state reserved;
        state sold;
        state maintenance;
    }
    @SourceFile {
        :>> path = "apps/backend/src/models/User.model.ts";
    }
    state def UserAccountState {
        transition deactivate first Active then Inactive;
        transition activate first Inactive then Active;
        state Active;
        state Inactive;
    }
}
