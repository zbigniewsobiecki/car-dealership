package FrontendHooks {
    import SysMLPrimitives::*;
    import DataTransferObjects::*;
    
    @SourceFile { :>> path = "apps/frontend/src/hooks/useCustomers.ts"; }
    action def useCustomersHooks {
        action useCustomers { out data : AnyItem [0..*]; }
        action useCreateCustomer { in data : CreateCustomerDto; }
    }
    
    @SourceFile { :>> path = "apps/frontend/src/hooks/useSales.ts"; }
    action def useSalesHooks {
        action useSales { out data : AnyItem [0..*]; }
        action useSalesStats { out stats : JSON; }
    }
    
    @SourceFile { :>> path = "apps/frontend/src/hooks/useVehicles.ts"; }
    action def useVehiclesHooks {
        action useVehicles { out data : AnyItem [0..*]; }
        action useVehicleStats { out stats : JSON; }
    }
}
