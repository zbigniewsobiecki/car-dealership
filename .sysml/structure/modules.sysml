package SystemModules {
    import SysMLPrimitives::*;
    import SystemArchitecture::*;
    import SystemInterfaces::*;
    doc /* System module decomposition with typed ports */
    @SourceFile {
        :>> path = "apps/backend/src/routes/auth.routes.ts";
    }
    part def AuthModule :> ServiceModule {
        :>> path = "apps/backend/src/routes/auth.routes.ts";
        :>> responsibility = "Handles login, registration, and token refresh.";
        :>> layer = "routing";
        port api : AuthPort;
        part controller : AuthController;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    part def CustomerModule :> ServiceModule {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
        :>> responsibility = "CRUD operations for customers and their sales history.";
        :>> layer = "routing";
        port api : CustomerPort;
        part controller : CustomersController;
        part customerRepository : CustomerRepository;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    part def SalesModule :> ServiceModule {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
        :>> responsibility = "Handles sales transactions and statistics.";
        :>> layer = "routing";
        port api : SalesPort;
        part controller : SalesController;
    }
    @SourceFile {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    part def VehicleModule :> ServiceModule {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
        :>> responsibility = "Inventory management and vehicle stats.";
        :>> layer = "routing";
        port api : VehiclePort;
        part controller : VehiclesController;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/layout/Layout.tsx";
    }
    part def AppLayout :> UIModule {
        :>> path = "apps/frontend/src/components/layout/Layout.tsx";
        :>> responsibility = "Main application shell with Navbar and Sidebar.";
        :>> layer = "presentation";
    }
    @SourceFile {
        :>> path = "apps/backend/src/app.ts";
    }
    part def BackendApp :> APIServer {
        :>> path = "apps/backend/src/app.ts";
        :>> responsibility = "Express application configuration, middleware setup, and route registration.";
        :>> layer = "application";
        part authRoutes : AuthModule;
        part customerRoutes : CustomerModule;
        part salesRoutes : SalesModule;
        part vehicleRoutes : VehicleModule;
        port api : ServicePort;
    }

    @SourceFile {
        :>> path = "apps/backend/src/server.ts";
    }
    part def BackendServer :> Part {
        doc /* Entry point for the backend server, handles database connection and port listening. */
        :>> path = "apps/backend/src/server.ts";
        part app : BackendApp;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/App.tsx";
    }
    part def FrontendApp :> UIModule {
        :>> path = "apps/frontend/src/App.tsx";
        :>> responsibility = "Root component handling routing and global providers.";
        :>> layer = "presentation";
        part layout : AppLayout;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/pages/Dashboard.tsx";
    }
    part def DashboardPage :> UIModule {
        :>> path = "apps/frontend/src/pages/Dashboard.tsx";
        :>> responsibility = "Overview page showing key metrics and stats.";
        :>> layer = "presentation";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/pages/Vehicles.tsx";
    }
    part def VehiclesPage :> UIModule {
        :>> path = "apps/frontend/src/pages/Vehicles.tsx";
        :>> responsibility = "Inventory management page for vehicles.";
        :>> layer = "presentation";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/layout/Navbar.tsx";
    }
    part def NavbarComponent :> UIModule {
        :>> path = "apps/frontend/src/components/layout/Navbar.tsx";
        :>> responsibility = "Top navigation bar with user profile and branding.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/layout/Sidebar.tsx";
    }
    part def SidebarComponent :> UIModule {
        :>> path = "apps/frontend/src/components/layout/Sidebar.tsx";
        :>> responsibility = "Side navigation menu for main application sections.";
    }
    @SourceFile {
        :>> path = "apps/frontend/src/pages/Customers.tsx";
    }
    part def CustomersPage :> UIModule {
        :>> path = "apps/frontend/src/pages/Customers.tsx";
        :>> responsibility = "Customer listing and management view.";
        part customerCard : CustomerCardComponent;
        part customerForm : CustomerFormComponent;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/pages/Sales.tsx";
    }
    part def SalesPage :> UIModule {
        :>> path = "apps/frontend/src/pages/Sales.tsx";
        :>> responsibility = "Sales transaction history and reporting view.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/pages/Login.tsx";
    }
    part def LoginPage :> UIModule {
        :>> path = "apps/frontend/src/pages/Login.tsx";
        :>> responsibility = "User authentication entry point.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/customers/CustomerCard.tsx";
    }
    part def CustomerCardComponent :> UIModule {
        :>> path = "apps/frontend/src/components/customers/CustomerCard.tsx";
        :>> responsibility = "Displays individual customer details and actions.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/customers/CustomerForm.tsx";
    }
    part def CustomerFormComponent :> UIModule {
        :>> path = "apps/frontend/src/components/customers/CustomerForm.tsx";
        :>> responsibility = "Form for creating and editing customer records.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/auth/ProtectedRoute.tsx";
    }
    part def ProtectedRouteComponent :> UIModule {
        :>> path = "apps/frontend/src/components/auth/ProtectedRoute.tsx";
        :>> responsibility = "Guard component for authenticated routes.";
    }
    @SourceFile {
        :>> path = "apps/frontend/src/components/sales/SaleCard.tsx";
    }
    part def SaleCardComponent :> UIModule {
        :>> path = "apps/frontend/src/components/sales/SaleCard.tsx";
        :>> responsibility = "Displays summary of a sale transaction.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/sales/SaleForm.tsx";
    }
    part def SaleFormComponent :> UIModule {
        :>> path = "apps/frontend/src/components/sales/SaleForm.tsx";
        :>> responsibility = "Form for recording new vehicle sales.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/vehicles/VehicleCard.tsx";
    }
    part def VehicleCardComponent :> UIModule {
        :>> path = "apps/frontend/src/components/vehicles/VehicleCard.tsx";
        :>> responsibility = "Displays vehicle details, price, and status.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/vehicles/VehicleForm.tsx";
    }
    part def VehicleFormComponent :> UIModule {
        :>> path = "apps/frontend/src/components/vehicles/VehicleForm.tsx";
        :>> responsibility = "Form for adding or updating vehicle inventory.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/main.tsx";
    }
    part def FrontendEntry :> Part {
        doc /* React application mount point and global provider setup. */
        :>> path = "apps/frontend/src/main.tsx";
        part app : FrontendApp;
    }
    @SourceFile {
        :>> path = "apps/backend/src/controllers/auth.controller.ts";
    }
    part def AuthController :> Part {
        :>> path = "apps/backend/src/controllers/auth.controller.ts";
        :>> responsibility = "Business logic for authentication and session management.";
    }

    @SourceFile {
        :>> path = "apps/backend/src/controllers/customers.controller.ts";
    }
    part def CustomersController :> Part {
        :>> path = "apps/backend/src/controllers/customers.controller.ts";
        :>> responsibility = "Business logic for customer data and sales history.";
    }

    @SourceFile {
        :>> path = "apps/backend/src/controllers/sales.controller.ts";
    }
    part def SalesController :> Part {
        :>> path = "apps/backend/src/controllers/sales.controller.ts";
        :>> responsibility = "Business logic for processing sales and generating stats.";
    }

    @SourceFile {
        :>> path = "apps/backend/src/controllers/vehicles.controller.ts";
    }
    part def VehiclesController :> Part {
        :>> path = "apps/backend/src/controllers/vehicles.controller.ts";
        :>> responsibility = "Business logic for vehicle inventory and status tracking.";
    }
    @SourceFile {
        :>> path = "apps/frontend/src/services/sales.service.ts";
    }
    part def SalesServiceClient :> Module {
        doc /* Frontend service for interacting with the Sales API */
        :>> responsibility = "Encapsulates API calls for sales management and statistics.";
        port api : ~SalesPort;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/vehicles.service.ts";
    }
    part def VehiclesServiceClient :> Module {
        doc /* Frontend service for interacting with the Vehicles API */
        :>> responsibility = "Encapsulates API calls for vehicle inventory and filtering.";
        port api : ~VehiclePort;
    }
    part def CustomerRepository {
        doc /* Repository for Customer entity persistence using CustomerModelRow */
        import DomainEntities::CustomerModelRow;
        import DomainEntities::Customer;
        action mapToEntity {
            in row : CustomerModelRow;
            out entity : Customer;
        }
    }
}
