package SystemOperations {
    import DataModel::Entities::*;
    import DataTransferObjects::*;
    import DataModel::DTOs::*;
    import DomainEnums::*;
    import DomainEntities::*;

    @SourceFile {
        :>> path = "apps/backend/src/services/auth.service.ts";
    }
    action def RegisterUser {
        flow from request.email to checkExisting.email;
        flow from request.password to hashPassword.raw;
        flow from request to createUser.data;
        flow from hashPassword.hashed to createUser.pwdHash;
        flow from createUser.user to signTokens.user;
        flow from signTokens.res to response;
        first checkExisting then hashPassword;
        first hashPassword then createUser;
        first createUser then signTokens;
        in request : CreateUserDto;
        out response : AuthResponse;
        out error : ApiError [0..1];

        action checkExisting {
            in email : String;
            out exists : Boolean;
        }
        action hashPassword {
            in raw : String;
            out hashed : String;
        }
        action createUser {
            in data : CreateUserDto;
            in pwdHash : String;
            out user : User;
        }
        action signTokens {
            in user : User;
            out res : AuthResponse;
            action signTokens {
                in user : User;
                out res : AuthResponse;
                out refreshToken : String;
            }
        }
    }


    @SourceFile {
        :>> path = "apps/backend/src/services/auth.service.ts";
    }
    action def Login {
        flow from email to findUser.email;
        flow from password to verifyPassword.raw;
        flow from findUser.user.passwordHash to verifyPassword.hashed;
        flow from findUser.user to signTokens.user;
        flow from signTokens.res to response;
        first findUser then verifyPassword;
        first verifyPassword then signTokens;
        in email : String;
        in password : String;
        out response : AuthResponse;
        out error : ApiError [0..1];

        action findUser {
            in email : String;
            out user : UserWithPassword;
        }
        action verifyPassword {
            in raw : String;
            in hashed : String;
            out valid : Boolean;
        }
        action signTokens {
            in user : User;
            out res : AuthResponse;
            action signTokens {
                in user : User;
                out res : AuthResponse;
                out refreshToken : String;
            }
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/services/sales.service.ts";
    }
    action def CreateSale {
        flow from request.vehicleId to verifyVehicle.id;
        flow from request.customerId to verifyCustomer.id;
        flow from request to persistSale.data;
        flow from persistSale.sale to sale;
        flow from request.vehicleId to updateVehicleStatus.id;
        first verifyVehicle then verifyCustomer;
        first verifyCustomer then persistSale;
        first persistSale then updateVehicleStatus;
        in request : CreateSaleDto;
        out sale : Sale;
        out error : ApiError [0..1];

        action verifyVehicle {
            in id : Identifier;
            out vehicle : Vehicle;
        }
        action verifyCustomer {
            in id : Identifier;
            out customer : Customer;
        }
        action persistSale {
            in data : CreateSaleDto;
            out sale : Sale;
        }
        action updateVehicleStatus {
            in id : Identifier;
            in status : VehicleStatus;
        }
    }
}
