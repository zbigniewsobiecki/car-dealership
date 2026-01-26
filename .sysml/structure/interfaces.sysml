package SystemInterfaces {
    import SysMLPrimitives::*;
    doc /* Module interface definitions with typed ports. */
    port def NavigationPort {
        out item route : String;
    }
    port def AuthStatePort {
        in item isAuthenticated : Boolean;
        in item user : JSON;
    }
    port def AuthApiPort :> HTTPPort {
        doc /* Port for authentication endpoints */
    }

    port def CustomerApiPort :> HTTPPort {
        doc /* Port for customer management endpoints */
    }

    port def VehicleApiPort :> HTTPPort {
        doc /* Port for vehicle inventory endpoints */
    }

    port def SaleApiPort :> HTTPPort {
        doc /* Port for sales transaction endpoints */
    }
    port def DataPort :> ServicePort {
        doc /* Generic data access port for fetching entities. */
    }
}
