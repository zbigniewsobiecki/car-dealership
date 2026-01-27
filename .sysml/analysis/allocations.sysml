package BehaviorAllocations {
    import SysMLPrimitives::*;
    import SystemArchitecture::*;
    import SystemBehavior::*;
    import SystemModules::*;
    
    doc /*Maps operations to implementing modules for traceability. */
    
    allocation def OperationAllocation :> BehaviorToModule {
        doc /*Maps an operation to its implementing module. */
    }
    
    // Backend Allocations
    allocate Login to AuthModule;
    allocate RegisterUser to AuthModule;
    allocate CreateVehicle to VehicleModule;
    allocate CreateSale to SaleModule;
    allocate CreateCustomer to CustomerModule;
    
    // Frontend Allocations
    allocate FrontendLogin to MainApp;
}
