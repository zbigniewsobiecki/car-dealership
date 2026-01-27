package SystemInterfaces {
    import SysMLPrimitives::*;
    
    doc /* Module interface definitions with typed ports for the Car Dealership System. */
    
    port def AuthPort :> HTTPPort {
        doc /* Authentication service port */
    }
    
    port def CustomerPort :> HTTPPort {
        doc /* Customer management service port */
    }
    
    port def VehiclePort :> HTTPPort {
        doc /* Vehicle inventory service port */
    }
    
    port def SalePort :> HTTPPort {
        doc /* Sales processing service port */
    }
}
