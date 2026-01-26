package SystemConnections {
    import SysMLPrimitives::*;
    import SystemModules::*;
    import SystemInterfaces::*;
    doc /* Internal module wiring within the Backend application. */

    // Note: Wiring should be defined within the part definitions in SystemModules 
    // or via explicit interface/connection definitions here that don't use :>> on external features.

    connection def AppToDb {
        end app:~DatabasePort;
        end db:DatabasePort;
    }
}
