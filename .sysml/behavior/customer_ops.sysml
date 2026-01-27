package CustomerOperations {
    import SysMLPrimitives::*;
    import DomainEntities::*;
    import DataTransferObjects::*;
    
    @SourceFile { :>> path = "apps/backend/src/controllers/customers.controller.ts"; }
    action def CustomerController {
        action getAll;
        action getById;
        action create;
        action update;
        action delete;
        action getSales;
    }
    
    @SourceFile { :>> path = "apps/backend/src/services/customers.service.ts"; }
    action def CustomerService {
        action getAll {
            out customers : Customer [0..*];
        }
    
        action getById {
            in id : Identifier;
            out customer : Customer;
        }
    
        action create {
            in data : CreateCustomerDto;
            in createdBy : Identifier;
            out customer : Customer;
        }
    
        action update {
            in id : Identifier;
            in data : BaseDTO;
            out customer : Customer;
        }
    
        action delete {
            in id : Identifier;
            out success : Boolean;
        }
    
        action getSales {
            in id : Identifier;
            out sales : Sale [0..*];
        }
    }
}
