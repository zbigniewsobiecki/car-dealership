package EntityStateMachines {
    import DomainEnums::*;

    @SourceFile {
        :>> path = "packages/shared-types/src/enums/vehicle-status.enum.ts";
    }
    state def VehicleLifecycle {
        transition first Available then Reserved;
        transition first Reserved then Sold;
        transition first Reserved then Available;
        transition first Available then Sold;
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
        transition first Completed then Cancelled;
        state Pending;
        state Completed;
        state Cancelled;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/store/authStore.ts";
    }
    state def AuthSessionState {
        transition first Unauthenticated then Authenticating;
        transition first Authenticating then Authenticated;
        transition first Authenticating then Error;
        transition first Authenticated then Unauthenticated;
        transition first Error then Authenticating;
        state Unauthenticated;
        state Authenticating;
        state Authenticated;
        state Error;
    }
}
