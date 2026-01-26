package DatabaseOperations {
    import SysMLPrimitives::*;
    import DomainEntities::*;
    
    @SourceFile { :>> path = "apps/backend/src/models/db.ts"; }
    action def DbUtils {
        action testConnection {
            out success : Boolean;
        }
        action tableExists {
            in tableName : String;
            out exists : Boolean;
        }
    }
    
    @SourceFile { :>> path = "apps/backend/src/models/Customer.model.ts"; }
    action def CustomerOperations {
        action findAll { out customers : Customer [0..*]; }
        action findById { in id : Identifier; out customer : Customer [0..1]; }
        action create { in data : BaseDTO; in createdBy : Identifier; out customer : Customer; }
        action update { in id : Identifier; in data : BaseDTO; out customer : Customer [0..1]; }
        action delete { in id : Identifier; out success : Boolean; }
    }
    
    @SourceFile { :>> path = "apps/backend/src/models/Sale.model.ts"; }
    action def SaleOperations {
        action getStats { out stats : JSON; }
        action getMonthlyStats { out monthlyStats : JSON [0..*]; }
        action findByCustomerId { in customerId : Identifier; out sales : Sale [0..*]; }
    }
    
    @SourceFile { :>> path = "apps/backend/src/models/Vehicle.model.ts"; }
    action def VehicleOperations {
        action getStats { out stats : JSON; }
        action findByVin { in vin : String; out vehicle : Vehicle [0..1]; }
    }
}
