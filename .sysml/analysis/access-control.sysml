package AccessControlAnalysis {
    import SysMLPrimitives::*;
    import SystemBehavior::*;
    import DomainEnums::*;
    
    doc /*Access control mapping - which roles can perform which operations. */
    
    // Access policy mapping
    part def EndpointAccessPolicy {
        doc /*Maps endpoints to required authentication/authorization. */
    
        part publicEndpoints {
            doc /*Accessible without authentication. */
        }
    
        part authenticatedEndpoints {
            doc /*Requires authentication but no specific role. */
        }
    
        part adminOnlyEndpoints {
            doc /*Requires admin role. */
        }
    }
    
    @SourceFile { :>> path = "apps/backend/src/app.ts"; }
    @SourceFile { :>> path = "apps/backend/src/middleware/auth.middleware.ts"; }
    allocation def RoutePermissions {
        doc /*Maps specific operations to access requirements. */
        
        // Public
        allocate Login to publicEndpoints;
        allocate HealthCheck to publicEndpoints;
    
        // Authenticated (Default for most API routes)
        allocate ListVehicles to authenticatedEndpoints;
        allocate CreateVehicle to authenticatedEndpoints;
        allocate CreateSale to authenticatedEndpoints;
        allocate ListCustomers to authenticatedEndpoints;
    }
}
