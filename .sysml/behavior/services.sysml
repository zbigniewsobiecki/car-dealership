package BackendServices {
    import SysMLPrimitives::*;
    import DomainEntities::*;
    import DataTransferObjects::*;
    import BackendUtilities::*;
    
    @SourceFile { :>> path = "apps/backend/src/services/customers.service.ts"; }
    action def CustomersService {
        action getAll { out customers : Customer [0..*]; }
        action getById { in id : Identifier; out customer : Customer; }
        action create { in data : CreateCustomerDto; in createdBy : Identifier; out customer : Customer; }
        action update { in id : Identifier; in data : UpdateCustomerDto; out customer : Customer; }
        action delete { in id : Identifier; out success : Boolean; }
        action getSales { in id : Identifier; out sales : Sale [0..*]; }
    }
    
    @SourceFile { :>> path = "apps/backend/src/services/vehicles.service.ts"; }
    action def VehiclesService {
        action getAll { out vehicles : Vehicle [0..*]; }
        action getById { in id : Identifier; out vehicle : Vehicle; }
        action create { in data : CreateVehicleDto; in createdBy : Identifier; out vehicle : Vehicle; }
        action update { in id : Identifier; in data : UpdateVehicleDto; out vehicle : Vehicle; }
        action delete { in id : Identifier; out success : Boolean; }
        action getStats { out stats : JSON; }
    }
}
