package AccessControlAnalysis {
    import SysMLPrimitives::*;
    import SystemBehavior::SystemOperations::*;
    import SystemOperations::*;
    import DomainEnums::*;
    import DomainEntities::*;
    doc /*Access control mapping - which roles can perform which operations. */
    import DataTransferObjects::*;
    import APIEndpoints::*;
    part def EndpointAccessPolicy {
        doc /*Maps endpoints to required authentication/authorization */
        part publicEndpoints {
            doc /*Accessible without authentication */
            item :> LoginEndpoint;
            item :> RefreshTokenEndpoint;
        }
        part authenticatedEndpoints {
            doc /*Requires valid JWT */
            item :> GetMeEndpoint;
            item :> ListVehiclesEndpoint;
            item :> GetVehicleByIdEndpoint;
            item :> GetVehicleStatsEndpoint;
            item :> CreateVehicleEndpoint;
            item :> UpdateVehicleEndpoint;
            item :> DeleteVehicleEndpoint;
            item :> ListCustomersEndpoint;
            item :> GetCustomerByIdEndpoint;
            item :> GetCustomerSalesEndpoint;
            item :> CreateCustomerEndpoint;
            item :> UpdateCustomerEndpoint;
            item :> DeleteCustomerEndpoint;
            item :> ListSalesEndpoint;
            item :> GetSaleByIdEndpoint;
            item :> GetSalesStatsEndpoint;
            item :> GetMonthlySalesStatsEndpoint;
            item :> CreateSaleEndpoint;
            item :> UpdateSaleEndpoint;
            item :> DeleteSaleEndpoint;
        }
        part adminOnlyEndpoints {
            doc /*Requires ADMIN role */
            item :> RegisterUserEndpoint;
        }
        part salespersonEndpoints {
            doc /*Requires SALESPERSON role */
            // Inherits authenticated endpoints, but could have specific ones
        }
    }
    allocation def RoutePermissions {
        allocate LoginUser to publicEndpoints;
        allocate RegisterUser to adminOnlyEndpoints;
        allocate GetMeEndpoint to authenticatedEndpoints;
        allocate CreateVehicle to authenticatedEndpoints;
        allocate UpdateVehicleEndpoint to authenticatedEndpoints;
        allocate DeleteVehicleEndpoint to authenticatedEndpoints;
        allocate CreateSale to authenticatedEndpoints;
        allocate UpdateSaleEndpoint to authenticatedEndpoints;
        allocate DeleteSaleEndpoint to authenticatedEndpoints;
        allocate CustomerServiceOperations::createCustomer to authenticatedEndpoints;
        allocate UpdateCustomerEndpoint to authenticatedEndpoints;
        allocate DeleteCustomerEndpoint to authenticatedEndpoints;
    }
}
