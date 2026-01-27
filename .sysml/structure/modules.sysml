package SystemModules {
    import SystemContext::*;
    import SysMLPrimitives::*;
    import SystemArchitecture::*;
    import SystemInterfaces::*;
    doc /* System module decomposition for the backend services. */
    part def BackendModule :> APIServer {
        attribute layer : String = "backend";
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/auth.routes.ts";
    }
    part def AuthModule :> BackendModule {
        :>> path = "apps/backend/src/auth";
        :>> responsibility = "Handles user registration, login, and token refresh.";
        port api : AuthPort;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    part def CustomerModule :> BackendModule {
        :>> path = "apps/backend/src/customers";
        :>> responsibility = "Manages customer profiles and their associated sales.";
        port api : CustomerPort;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    part def VehicleModule :> BackendModule {
        :>> path = "apps/backend/src/vehicles";
        :>> responsibility = "Manages vehicle inventory and statistics.";
        port api : VehiclePort;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    part def SaleModule :> BackendModule {
        :>> path = "apps/backend/src/sales";
        :>> responsibility = "Processes sales transactions and generates reports.";
        port api : SalePort;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/App.tsx";
    }
    part def MainApp :> FrontendModule {
        :>> path = "apps/frontend/src/App.tsx";
        :>> responsibility = "Root component handling routing and layout.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/pages/Dashboard.tsx";
    }
    part def DashboardPage :> FrontendModule {
        :>> path = "apps/frontend/src/pages/Dashboard.tsx";
        :>> responsibility = "Displays overview statistics for sales and inventory.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/pages/Vehicles.tsx";
    }
    part def VehiclesPage :> FrontendModule {
        :>> path = "apps/frontend/src/pages/Vehicles.tsx";
        :>> responsibility = "Inventory management view for vehicles.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/pages/Customers.tsx";
    }
    part def CustomersPage :> FrontendModule {
        :>> path = "apps/frontend/src/pages/Customers.tsx";
        :>> responsibility = "Customer relationship management view.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/pages/Sales.tsx";
    }
    part def SalesPage :> FrontendModule {
        :>> path = "apps/frontend/src/pages/Sales.tsx";
        :>> responsibility = "Sales transaction and reporting view.";
    }
    @SourceFile {
        :>> path = "apps/backend/src/app.ts";
    }
    part def BackendApp :> APIServer {
        :>> path = "apps/backend/src/app.ts";
        :>> responsibility = "Express application setup and middleware configuration.";
        part auth : AuthModule;
        part customers : CustomerModule;
        part vehicles : VehicleModule;
        part sales : SaleModule;
    }

    part carDealershipSystem : CarDealershipSystem {
        part backendApp : BackendApp;
        part frontendApp : MainApp;
    }
    @SourceFile {
        :>> path = "apps/backend/src/services/auth.service.ts";
    }
    part def AuthService :> Module {
        :>> path = "apps/backend/src/services/auth.service.ts";
        :>> responsibility = "Business logic for authentication and JWT management.";
    }

    @SourceFile {
        :>> path = "apps/backend/src/services/customers.service.ts";
    }
    part def CustomerService :> Module {
        :>> path = "apps/backend/src/services/customers.service.ts";
        :>> responsibility = "Business logic for customer data and sales history.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/layout/Layout.tsx";
    }
    part def LayoutComponent :> FrontendModule {
        :>> path = "apps/frontend/src/components/layout/Layout.tsx";
        :>> responsibility = "Main layout wrapper with Sidebar and Navbar.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/auth/ProtectedRoute.tsx";
    }
    part def ProtectedRoute :> FrontendModule {
        :>> path = "apps/frontend/src/components/auth/ProtectedRoute.tsx";
        :>> responsibility = "Route guard for authenticated access.";
    }
    @SourceFile {
        :>> path = "apps/backend/src/server.ts";
    }
    part def ServerEntry :> Module {
        :>> path = "apps/backend/src/server.ts";
        :>> responsibility = "Server entry point, database connection initialization, and listener start.";
    }

    @SourceFile {
        :>> path = "apps/backend/src/services/vehicles.service.ts";
    }
    part def VehicleService :> Module {
        :>> path = "apps/backend/src/services/vehicles.service.ts";
        :>> responsibility = "Business logic for vehicle inventory, filtering, and stats.";
    }

    @SourceFile {
        :>> path = "apps/backend/src/services/sales.service.ts";
    }
    part def SaleService :> Module {
        :>> path = "apps/backend/src/services/sales.service.ts";
        :>> responsibility = "Business logic for sales transactions and monthly reporting.";
    }
    @SourceFile {
        :>> path = "apps/frontend/src/main.tsx";
    }
    part def FrontendEntry :> Module {
        :>> path = "apps/frontend/src/main.tsx";
        :>> responsibility = "React application mounting and provider setup.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/layout/Navbar.tsx";
    }
    part def NavbarComponent :> FrontendModule {
        :>> path = "apps/frontend/src/components/layout/Navbar.tsx";
        :>> responsibility = "Top navigation bar with user profile and branding.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/layout/Sidebar.tsx";
    }
    part def SidebarComponent :> FrontendModule {
        :>> path = "apps/frontend/src/components/layout/Sidebar.tsx";
        :>> responsibility = "Side navigation menu for main application sections.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/vehicles/VehicleCard.tsx";
    }
    part def VehicleCard :> FrontendModule {
        :>> path = "apps/frontend/src/components/vehicles/VehicleCard.tsx";
        :>> responsibility = "UI component for displaying individual vehicle details.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/customers/CustomerCard.tsx";
    }
    part def CustomerCard :> FrontendModule {
        :>> path = "apps/frontend/src/components/customers/CustomerCard.tsx";
        :>> responsibility = "UI component for displaying customer summary information.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/sales/SaleCard.tsx";
    }
    part def SaleCard :> FrontendModule {
        :>> path = "apps/frontend/src/components/sales/SaleCard.tsx";
        :>> responsibility = "UI component for displaying sale transaction details.";
    }
    @SourceFile {
        :>> path = "apps/frontend/src/components/vehicles/VehicleForm.tsx";
    }
    part def VehicleForm :> FrontendModule {
        :>> path = "apps/frontend/src/components/vehicles/VehicleForm.tsx";
        :>> responsibility = "Form for creating and editing vehicle records.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/customers/CustomerForm.tsx";
    }
    part def CustomerForm :> FrontendModule {
        :>> path = "apps/frontend/src/components/customers/CustomerForm.tsx";
        :>> responsibility = "Form for creating and editing customer profiles.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/sales/SaleForm.tsx";
    }
    part def SaleForm :> FrontendModule {
        :>> path = "apps/frontend/src/components/sales/SaleForm.tsx";
        :>> responsibility = "Form for processing new sales transactions.";
    }
}
