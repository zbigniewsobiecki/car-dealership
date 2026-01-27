package DatabaseModels {
    import SysMLPrimitives::*;
    import DomainEntities::*;
    
    @SourceFile { :>> path = "apps/backend/src/models/db.ts"; }
    part def DatabaseUtility :> Module {
        doc /* Database utility module for connection testing and schema checks. */
        
        action testConnection : Boolean;
        action tableExists {
            in tableName : String;
            out exists : Boolean;
        }
    }
    
    @SourceFile { :>> path = "apps/backend/src/models/Customer.model.ts"; }
    part def CustomerModel :> Module {
        doc /* Data access object for Customer entities. */
    
        action findAll {
            out customers : Customer [0..*];
        }
    
        action findById {
            in id : Identifier;
            out customer : Customer [0..1];
        }
    
        action create {
            in data : BaseDTO; // CreateCustomerDto
            in createdBy : Identifier;
            out customer : Customer;
        }
    
        action update {
            in id : Identifier;
            in data : BaseDTO; // UpdateCustomerDto
            out customer : Customer [0..1];
        }
    
        action delete {
            in id : Identifier;
            out success : Boolean;
        }
    }
}
