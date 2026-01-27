package VehicleOperations {
    import SysMLPrimitives::*;
    import DomainEntities::*;
    import DataTransferObjects::*;
    @SourceFile {
        :>> path = "apps/backend/src/services/vehicles.service.ts";
    }
    action def VehicleService {
        action getAll {
            in filters : VehicleFilters [0..1];
            out vehicles : Vehicle [0..*];
        }
        action getById {
            in id : Identifier;
            out vehicle : Vehicle;
        }
        action create {
            in data : CreateVehicleDto;
            in createdBy : Identifier;
            out vehicle : Vehicle;
        }
        action update {
            in id : Identifier;
            in data : BaseDTO;
            out vehicle : Vehicle;
        }
        action delete {
            in id : Identifier;
            out success : Boolean;
        }
        action getStats {
            out stats : VehicleStats;
        }
    }
}
