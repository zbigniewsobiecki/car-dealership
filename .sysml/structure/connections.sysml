package SystemConnections {
    import SysMLPrimitives::*;
    import SystemModules::*;
    import SystemInterfaces::*;
    
    doc /* Inter-module wiring for the Car Dealership system. */
    
    connection authWiring connect backendApp.auth to authRoutes.api;
    connection customerWiring connect backendApp.customers to customerRoutes.api;
    connection vehicleWiring connect backendApp.vehicles to vehicleRoutes.api;
    connection saleWiring connect backendApp.sales to saleRoutes.api;
}
