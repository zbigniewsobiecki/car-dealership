package SystemModules {
    import SysMLPrimitives::*;
    import SystemArchitecture::*;
    import SystemInterfaces::*;
    doc /* Backend module decomposition following the Express routing structure. */
    @SourceFile {
        :>> path = "apps/backend/src/app.ts";
    }
    @SourceFile {
        :>> path = "apps/backend/src/server.ts";
    }
    part def BackendApp :> APIServer {
        :>> framework = "express";
        :>> path = "apps/backend/src/app.ts";
        port authApi : AuthPort;
        port customerApi : CustomerPort;
        port vehicleApi : VehiclePort;
        port salesApi : SalesPort;
    }
    @SourceFile {
        :>> path = "apps/backend/src/controllers/auth.controller.ts";
    }
    part def AuthModule :> Module {
        :>> path = "apps/backend/src/auth";
        :>> responsibility = "Handles user registration, login, and session refreshing.";
        :>> layer = "service";
        port api : AuthPort;
    }
    @SourceFile {
        :>> path = "apps/backend/src/controllers/customers.controller.ts";
    }
    part def CustomerModule :> Module {
        :>> path = "apps/backend/src/users";
        :>> responsibility = "Manages customer profiles and their associated sales history.";
        :>> layer = "service";
        port api : CustomerPort;
        part def CustomerModule :> Module {
            :>> path = "apps/backend/src/controllers/customers.controller.ts";
            :>> responsibility = "Manages customer profiles and their associated sales history.";
            :>> layer = "service";
            port api : CustomerPort;
        }
    }
    @SourceFile {
        :>> path = "apps/backend/src/controllers/vehicles.controller.ts";
    }
    part def VehicleModule :> Module {
        :>> path = "apps/backend/src/services/vehicles.service.ts";
        :>> responsibility = "Manages vehicle inventory, filtering, and statistics.";
        :>> layer = "service";
        port api : VehiclePort;
    }
    @SourceFile {
        :>> path = "apps/backend/src/controllers/sales.controller.ts";
    }
    part def SalesModule :> Module {
        :>> path = "apps/backend/src/services/sales.service.ts";
        :>> responsibility = "Processes sales transactions and generates financial stats.";
        :>> layer = "service";
        port api : SalesPort;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/main.tsx";
    }
    @SourceFile {
        :>> path = "apps/frontend/src/App.tsx";
    }
    part def FrontendApp :> Frontend {
        :>> framework = "react";
        :>> path = "apps/frontend/src/main.tsx";
        port authClient : ~AuthPort;
        port customerClient : ~CustomerPort;
        port vehicleClient : ~VehiclePort;
        port salesClient : ~SalesPort;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/pages/Dashboard.tsx";
    }
    part def DashboardPage :> Module {
        :>> layer = "presentation";
        :>> responsibility = "Displays high-level metrics for vehicles and sales.";
        port salesData : ~SalesPort;
        port vehicleStats : ~VehiclePort;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/pages/Vehicles.tsx";
    }
    part def VehiclesPage :> Module {
        :>> layer = "presentation";
        :>> responsibility = "Inventory management view with search and filtering.";
        port api : ~VehiclePort;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/pages/Login.tsx";
    }
    part def LoginPage :> Module {
        :>> layer = "presentation";
        :>> responsibility = "User authentication entry point.";
        port auth : ~AuthPort;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/pages/Customers.tsx";
    }
    part def CustomersPage :> Module {
        :>> layer = "presentation";
        :>> responsibility = "Customer relationship management view.";
        port api : ~CustomerPort;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/pages/Sales.tsx";
    }
    part def SalesPage :> Module {
        :>> layer = "presentation";
        :>> responsibility = "Sales transaction history and creation view.";
        port api : ~SalesPort;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/auth.service.ts";
    }
    part def AuthServiceClient :> Module {
        :>> layer = "infrastructure";
        port api : ~AuthPort;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/customers.service.ts";
    }
    part def CustomerServiceClient :> Module {
        :>> layer = "infrastructure";
        port api : ~CustomerPort;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/vehicles.service.ts";
    }
    part def VehicleServiceClient :> Module {
        :>> layer = "infrastructure";
        port api : ~VehiclePort;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/services/sales.service.ts";
    }
    part def SalesServiceClient :> Module {
        :>> layer = "infrastructure";
        port api : ~SalesPort;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/layout/Layout.tsx";
    }
    part def LayoutComponent :> Module {
        :>> layer = "presentation";
        attribute hasSidebar : Boolean = true;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/auth/ProtectedRoute.tsx";
    }
    part def ProtectedRoute :> Module {
        :>> layer = "presentation";
        port authCheck : ~AuthPort;
    }
    @SourceFile {
        :>> path = "apps/backend/src/middleware/auth.middleware.ts";
    }
    part def AuthMiddleware :> Module {
        :>> responsibility = "JWT validation and role-based access control.";
        :>> layer = "infrastructure";
    }

    @SourceFile {
        :>> path = "apps/backend/src/middleware/errorHandler.middleware.ts";
    }
    part def ErrorHandler :> Module {
        :>> responsibility = "Global exception handling and standardized error responses.";
        :>> layer = "infrastructure";
    }

    @SourceFile {
        :>> path = "apps/backend/src/config/env.ts";
    }
    part def ConfigModule :> Module {
        :>> responsibility = "Environment variable validation and configuration management.";
        :>> layer = "infrastructure";
    }

    @SourceFile {
        :>> path = "apps/backend/src/models/db.ts";
    }
    part def DatabaseModule :> Module {
        :>> responsibility = "Database connection pooling and utility functions.";
        :>> layer = "data";
        port dbPort : DatabasePort;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/components/layout/Navbar.tsx";
    }
    part def NavbarComponent :> Module {
        :>> layer = "presentation";
        :>> responsibility = "Top navigation bar with user profile and links.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/layout/Sidebar.tsx";
    }
    part def SidebarComponent :> Module {
        :>> layer = "presentation";
        :>> responsibility = "Side navigation menu for main application sections.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/vehicles/VehicleCard.tsx";
    }
    part def VehicleCardComponent :> Module {
        :>> layer = "presentation";
        :>> responsibility = "Display card for vehicle summary information.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/vehicles/VehicleForm.tsx";
    }
    part def VehicleFormComponent :> Module {
        :>> layer = "presentation";
        :>> responsibility = "Form for creating and editing vehicle records.";
        port api : ~VehiclePort;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/sales/SaleCard.tsx";
    }
    part def SaleCardComponent :> Module {
        :>> layer = "presentation";
        :>> responsibility = "Display card for sale transaction details.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/sales/SaleForm.tsx";
    }
    part def SaleFormComponent :> Module {
        :>> layer = "presentation";
        :>> responsibility = "Form for recording new sales transactions.";
        port api : ~SalesPort;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/customers/CustomerCard.tsx";
    }
    part def CustomerCardComponent :> Module {
        :>> layer = "presentation";
        :>> responsibility = "Display card for customer contact and summary info.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/customers/CustomerForm.tsx";
    }
    part def CustomerFormComponent :> Module {
        :>> layer = "presentation";
        :>> responsibility = "Form for managing customer profile data.";
        port api : ~CustomerPort;
    }
    // System instances
    part backendApp : BackendApp;
    part frontendApp : FrontendApp;
    @SourceFile {
        :>> path = "apps/frontend/src/store/authStore.ts";
    }
    part def AuthStore :> Module {
        :>> layer = "infrastructure";
        :>> responsibility = "Client-side authentication state management using Zustand.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/hooks/useVehicles.ts";
    }
    part def VehicleHooks :> Module {
        :>> layer = "infrastructure";
        :>> responsibility = "React Query hooks for vehicle data fetching and mutations.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/hooks/useCustomers.ts";
    }
    part def CustomerHooks :> Module {
        :>> layer = "infrastructure";
        :>> responsibility = "React Query hooks for customer data management.";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/hooks/useSales.ts";
    }
    part def SalesHooks :> Module {
        :>> layer = "infrastructure";
        :>> responsibility = "React Query hooks for sales transactions and stats.";
    }
}
