package TestCoverage {
    import SysMLPrimitives::*;
    import DomainEntities::*;
    import DataTransferObjects::*;
    import DomainEnums::*;
    
    @SourceFile { :>> path = "apps/frontend/test/components/SaleCard.test.tsx"; }
    verification def SaleCardTest {
        doc /* Tests for the SaleCard component, verifying rendering of sale info, status colors, and interaction callbacks. */
        subject saleCard : SaleCardComponent;
    }
    
    @SourceFile { :>> path = "apps/frontend/test/components/VehicleCard.test.tsx"; }
    verification def VehicleCardTest {
        doc /* Tests for the VehicleCard component, verifying rendering of vehicle details and action buttons. */
        subject vehicleCard : VehicleCardComponent;
    }
    
    @SourceFile { :>> path = "apps/frontend/test/mocks/handlers.ts"; }
    part def MockApiHandlers :> Module {
        doc /* MSW handlers providing mock responses for Auth, Vehicles, Customers, and Sales APIs. */
        :>> path = "apps/frontend/test/mocks/handlers.ts";
        
        attribute apiUrl : URL = "http://localhost:3000/api";
        
        item mockUser : User;
        item mockVehicle : Vehicle;
        item mockCustomer : Customer;
        item mockSale : Sale;
    }
    
    @SourceFile { :>> path = "apps/frontend/test/mocks/server.ts"; }
    part mockServer : WebApplication {
        doc /* Mock server instance for frontend integration testing. */
        part handlers : MockApiHandlers;
    }
}
