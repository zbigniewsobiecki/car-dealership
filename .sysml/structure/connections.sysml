package SystemConnections {
    import SysMLPrimitives::*;
    import SystemModules::*;
    doc /* Inter-module connections and wiring for the Car Dealership System. */
    connection def BackendConnection :> APIConnection {
        end client;
        end server;
    }
    connection dashboardToSales {
        connect SystemModules::carDealershipSystem.frontendApp.api to SystemModules::carDealershipSystem.backendApp.sales.api;
    }
    connection vehiclesToApi {
        connect SystemModules::carDealershipSystem.frontendApp.api to SystemModules::carDealershipSystem.backendApp.vehicles.api;
    }
    connection customersToApi {
        connect SystemModules::carDealershipSystem.frontendApp.api to SystemModules::carDealershipSystem.backendApp.customers.api;
    }
}
