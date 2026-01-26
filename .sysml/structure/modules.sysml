package SystemModules {
    import SysMLPrimitives::*;
    import SystemArchitecture::*;
    import SystemInterfaces::*;
    doc /* System module decomposition with typed ports and component definitions. */
    @SourceFile {
        :>> path = "apps/frontend/src/components/auth/ProtectedRoute.tsx";
    }
    part def ProtectedRoute :> UIComponent {
        doc /* Guards routes based on authentication state. */
        port authIn : AuthStatePort;
        port navOut : NavigationPort;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/layout/Layout.tsx";
    }
    part def Layout :> UIComponent {
        doc /* Main application shell containing Navbar and Sidebar. */
        part navbar : Navbar;
        part sidebar : Sidebar;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/layout/Navbar.tsx";
    }
    part def Navbar :> UIComponent {
        doc /* Top navigation bar with user profile and logout. */
        port auth : AuthStatePort;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/layout/Sidebar.tsx";
    }
    part def Sidebar :> UIComponent {
        doc /* Side navigation with links to main modules. */
        port nav : NavigationPort;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/components/customers/CustomerCard.tsx";
    }
    part def CustomerCard :> UIComponent {
        doc /* Displays summary information for a customer. */
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/customers/CustomerForm.tsx";
    }
    part def CustomerForm :> UIComponent {
        doc /* Form for creating or editing customer data. */
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/sales/SaleCard.tsx";
    }
    part def SaleCard :> UIComponent {
        doc /* Displays summary information for a sale. */
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/sales/SaleForm.tsx";
    }
    part def SaleForm :> UIComponent {
        doc /* Form for creating or editing sale records. */
        port vehicleData : DataPort;
        port customerData : DataPort;
    }
    @SourceFile {
        :>> path = "apps/backend/src/app.ts";
    }
    part def BackendApp :> APIServer {
        doc /* Express application setup and middleware configuration. */
        :>> layer = "application";
        port auth : AuthApiPort;
        port customers : CustomerApiPort;
        port vehicles : VehicleApiPort;
        port sales : SaleApiPort;
    }

    @SourceFile {
        :>> path = "apps/backend/src/routes/auth.routes.ts";
    }
    part def AuthRoutes :> Module {
        doc /* Routes for authentication. */
        :>> layer = "presentation";
        port api : AuthApiPort;
    }

    @SourceFile {
        :>> path = "apps/backend/src/routes/customers.routes.ts";
    }
    part def CustomerRoutes :> Module {
        doc /* Routes for customer management. */
        :>> layer = "presentation";
        port api : CustomerApiPort;
    }

    @SourceFile {
        :>> path = "apps/backend/src/routes/vehicles.routes.ts";
    }
    part def VehicleRoutes :> Module {
        doc /* Routes for vehicle inventory. */
        :>> layer = "presentation";
        port api : VehicleApiPort;
    }

    @SourceFile {
        :>> path = "apps/backend/src/routes/sales.routes.ts";
    }
    part def SaleRoutes :> Module {
        doc /* Routes for sales processing. */
        :>> layer = "presentation";
        port api : SaleApiPort;
    }
    @SourceFile {
        :>> path = "apps/frontend/src/App.tsx";
    }
    part def FrontendApp :> UIComponent {
        doc /* Root component with routing and providers. */
        part router : ProtectedRoute;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/pages/Dashboard.tsx";
    }
    part def DashboardPage :> UIComponent {
        doc /* Overview page with key metrics. */
    }

    @SourceFile {
        :>> path = "apps/frontend/src/pages/Customers.tsx";
    }
    part def CustomersPage :> UIComponent {
        doc /* Customer management view. */
        part list : CustomerCard;
        part form : CustomerForm;
    }

    @SourceFile {
        :>> path = "apps/frontend/src/pages/Sales.tsx";
    }
    part def SalesPage :> UIComponent {
        doc /* Sales transaction view. */
        part list : SaleCard;
        part form : SaleForm;
    }
    @SourceFile {
        :>> path = "apps/backend/src/server.ts";
    }
    part def ServerEntry :> Module {
        doc /* Entry point for the backend server, handles DB connection and server start. */
        :>> layer = "infrastructure";
    }

    @SourceFile {
        :>> path = "apps/frontend/src/pages/Vehicles.tsx";
    }
    part def VehiclesPage :> UIComponent {
        doc /* Vehicle inventory management page. */
    }

    @SourceFile {
        :>> path = "apps/frontend/src/pages/Login.tsx";
    }
    part def LoginPage :> UIComponent {
        doc /* User login page. */
        port auth : AuthStatePort;
    }

    // Instances
    part backendApp : BackendApp;
    part frontendApp : FrontendApp;
    part authRoutes : AuthRoutes;
    part customerRoutes : CustomerRoutes;
    part vehicleRoutes : VehicleRoutes;
    part saleRoutes : SaleRoutes;
    @SourceFile {
        :>> path = "apps/frontend/src/components/vehicles/VehicleCard.tsx";
    }
    part def VehicleCard :> UIComponent {
        doc /* Displays summary information for a vehicle. */
    }

    @SourceFile {
        :>> path = "apps/frontend/src/components/vehicles/VehicleForm.tsx";
    }
    part def VehicleForm :> UIComponent {
        doc /* Form for creating or editing vehicle inventory. */
    }

    @SourceFile {
        :>> path = "apps/frontend/src/main.tsx";
    }
    part def FrontendEntry :> Module {
        doc /* React application mount point. */
        :>> layer = "infrastructure";
    }
}
