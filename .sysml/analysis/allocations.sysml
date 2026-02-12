package BehaviorAllocations {
    import SystemBehavior::*;
    import SystemOperations::*;
    import SysMLPrimitives::*;
    import SystemArchitecture::*;
    import SystemBehavior::SystemOperations::*;
    import SystemModules::*;
    doc /*Maps operations to implementing modules for traceability. */
    import DomainEntities::*;
    import DataTransferObjects::*;
    allocate RegisterUser to AuthModule;
    allocate LoginUser to AuthModule;
    allocate CreateVehicle to VehicleModule;
    allocate CreateSale to SalesModule;
    allocate CustomerServiceOperations::getAllCustomers to CustomerModule;
    allocate CustomerServiceOperations::createCustomer to CustomerModule;
    allocate AuthenticateRequest to BackendApp;
    allocate HandleError to BackendApp;
    allocation def OperationAllocation :> BehaviorToModule;
    // Backend Allocations
    // Middleware Allocations
}
