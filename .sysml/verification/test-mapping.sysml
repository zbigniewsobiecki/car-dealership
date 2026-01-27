package TestMappings {
    package TestFixtures {
        import SysMLPrimitives::*;
        @SourceFile {
            :>> path = "apps/backend/test/factories/customer.factory.ts";
        }
        part customerFactory {
            doc /* Provides mock Customer entities and DTOs for testing. */
        }
        @SourceFile {
            :>> path = "apps/backend/test/factories/sale.factory.ts";
        }
        part saleFactory {
            doc /* Provides mock Sale entities and DTOs for testing. */
        }
        @SourceFile {
            :>> path = "apps/backend/test/factories/user.factory.ts";
        }
        part userFactory {
            doc /* Provides mock User entities and DTOs for testing. */
        }
        @SourceFile {
            :>> path = "apps/backend/test/factories/vehicle.factory.ts";
        }
        part vehicleFactory {
            doc /* Provides mock Vehicle entities and DTOs for testing. */
        }
        @SourceFile {
            :>> path = "apps/backend/test/helpers/auth.helper.ts";
        }
        part authTestHelper {
            doc /* Utilities for generating test JWT tokens. */
        }
    }
    package AuthIntegrationTests {
        import SysMLPrimitives::*;
        import Verification::*;
        import SystemBehavior::SystemOperations::*;
        @SourceFile {
            :>> path = "apps/backend/test/integration/auth.routes.test.ts";
        }
        verification loginSuccessTest : TestCase {
            doc /* Verifies the Login operation and JWT generation. */
             :>> testFile = "apps/backend/test/integration/auth.routes.test.ts";
             :>> testName = "POST /api/auth/login - should login successfully with valid credentials";
             :>> category = TestCategory::Integration;
        }
        @SourceFile {
            :>> path = "apps/backend/test/integration/auth.routes.test.ts";
        }
        verification loginInvalidCredsTest : TestCase {
             :>> testFile = "apps/backend/test/integration/auth.routes.test.ts";
             :>> testName = "POST /api/auth/login - should return 401 for invalid credentials";
             :>> category = TestCategory::Integration;
        }
        @SourceFile {
            :>> path = "apps/backend/test/integration/auth.routes.test.ts";
        }
        verification tokenRefreshTest : TestCase {
             :>> testFile = "apps/backend/test/integration/auth.routes.test.ts";
             :>> testName = "POST /api/auth/refresh - should refresh tokens successfully";
             :>> category = TestCategory::Integration;
        }
    }
    package CustomerIntegrationTests {
        import SysMLPrimitives::*;
        import Verification::*;
        @SourceFile {
            :>> path = "apps/backend/test/integration/customers.routes.test.ts";
        }
        verification getAllCustomersTest : TestCase {
             :>> testFile = "apps/backend/test/integration/customers.routes.test.ts";
             :>> testName = "GET /api/customers - should return all customers";
             :>> category = TestCategory::Integration;
        }
        @SourceFile {
            :>> path = "apps/backend/test/integration/customers.routes.test.ts";
        }
        verification createCustomerTest : TestCase {
             :>> testFile = "apps/backend/test/integration/customers.routes.test.ts";
             :>> testName = "POST /api/customers - should create a new customer";
             :>> category = TestCategory::Integration;
        }
    }
    package SalesIntegrationTests {
        import SysMLPrimitives::*;
        import Verification::*;
        @SourceFile {
            :>> path = "apps/backend/test/integration/sales.routes.test.ts";
        }
        verification createSaleIntegrationTest : TestCase {
             :>> testFile = "apps/backend/test/integration/sales.routes.test.ts";
             :>> testName = "POST /api/sales - should create a new sale";
             :>> category = TestCategory::Integration;
        }
        @SourceFile {
            :>> path = "apps/backend/test/integration/sales.routes.test.ts";
        }
        verification getSaleStatsIntegrationTest : TestCase {
             :>> testFile = "apps/backend/test/integration/sales.routes.test.ts";
             :>> testName = "GET /api/sales/stats - should return sales statistics";
             :>> category = TestCategory::Integration;
        }
    }
    package VehicleIntegrationTests {
        import SysMLPrimitives::*;
        import Verification::*;
        @SourceFile {
            :>> path = "apps/backend/test/integration/vehicles.routes.test.ts";
        }
        verification getAllVehiclesIntegrationTest : TestCase {
             :>> testFile = "apps/backend/test/integration/vehicles.routes.test.ts";
             :>> testName = "GET /api/vehicles - should return all vehicles";
             :>> category = TestCategory::Integration;
        }
        @SourceFile {
            :>> path = "apps/backend/test/integration/vehicles.routes.test.ts";
        }
        verification createVehicleIntegrationTest : TestCase {
             :>> testFile = "apps/backend/test/integration/vehicles.routes.test.ts";
             :>> testName = "POST /api/vehicles - should create a new vehicle";
             :>> category = TestCategory::Integration;
        }
    }
    package ServiceUnitTests {
        import SysMLPrimitives::*;
        import Verification::*;
        @SourceFile {
            :>> path = "apps/backend/test/unit/services/auth.service.test.ts";
        }
        verification authServiceLoginTest : TestCase {
             :>> testFile = "apps/backend/test/unit/services/auth.service.test.ts";
             :>> testName = "AuthService.login - should return user and tokens";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/backend/test/unit/services/customers.service.test.ts";
        }
        verification customerServiceCreateTest : TestCase {
             :>> testFile = "apps/backend/test/unit/services/customers.service.test.ts";
             :>> testName = "CustomerService.create - should create customer";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/backend/test/unit/services/sales.service.test.ts";
        }
        verification salesServiceCreateTest : TestCase {
             :>> testFile = "apps/backend/test/unit/services/sales.service.test.ts";
             :>> testName = "SalesService.create - should create sale and update vehicle status";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/backend/test/unit/services/vehicles.service.test.ts";
        }
        verification vehicleServiceGetStatsTest : TestCase {
             :>> testFile = "apps/backend/test/unit/services/vehicles.service.test.ts";
             :>> testName = "VehicleService.getStats - should return inventory stats";
             :>> category = TestCategory::Unit;
        }
    }
    package FrontendE2ETests {
        import SysMLPrimitives::*;
        import Verification::*;
        @SourceFile {
            :>> path = "apps/frontend/e2e/auth.spec.ts";
        }
        verification e2eLoginFlow : TestCase {
            doc /* Verifies the Login flow and redirection. */
             :>> testFile = "apps/frontend/e2e/auth.spec.ts";
             :>> testName = "Login flow - should login and redirect to dashboard";
             :>> category = TestCategory::E2E;
        }
        @SourceFile {
            :>> path = "apps/frontend/e2e/dashboard.spec.ts";
        }
        verification e2eDashboardStats : TestCase {
             :>> testFile = "apps/frontend/e2e/dashboard.spec.ts";
             :>> testName = "Dashboard - should display correct statistics";
             :>> category = TestCategory::E2E;
        }
    }
    package MiddlewareUnitTests {
        import SysMLPrimitives::*;
        import Verification::*;
        @SourceFile {
            :>> path = "apps/backend/test/unit/middleware/auth.middleware.test.ts";
        }
        verification authMiddlewareTest : TestCase {
             :>> testFile = "apps/backend/test/unit/middleware/auth.middleware.test.ts";
             :>> testName = "AuthMiddleware - should verify token and attach user to request";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/backend/test/unit/middleware/errorHandler.middleware.test.ts";
        }
        verification errorHandlerTest : TestCase {
             :>> testFile = "apps/backend/test/unit/middleware/errorHandler.middleware.test.ts";
             :>> testName = "ErrorHandler - should return correct status code and message";
             :>> category = TestCategory::Unit;
        }
    }
    package UtilityUnitTests {
        import SysMLPrimitives::*;
        import Verification::*;
        @SourceFile {
            :>> path = "apps/backend/test/unit/utils/jwt.util.test.ts";
        }
        verification jwtUtilTest : TestCase {
             :>> testFile = "apps/backend/test/unit/utils/jwt.util.test.ts";
             :>> testName = "JWT Util - should sign and verify tokens";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/backend/test/unit/utils/password.util.test.ts";
        }
        verification passwordUtilTest : TestCase {
             :>> testFile = "apps/backend/test/unit/utils/password.util.test.ts";
             :>> testName = "Password Util - should hash and compare passwords";
             :>> category = TestCategory::Unit;
        }
    }
    package FrontendE2EExtended {
        import SysMLPrimitives::*;
        import Verification::*;
        @SourceFile {
            :>> path = "apps/frontend/e2e/customers.spec.ts";
        }
        verification e2eCustomerManagement : TestCase {
             :>> testFile = "apps/frontend/e2e/customers.spec.ts";
             :>> testName = "Customers - should create and list customers";
             :>> category = TestCategory::E2E;
        }
        @SourceFile {
            :>> path = "apps/frontend/e2e/sales.spec.ts";
        }
        verification e2eSalesWorkflow : TestCase {
             :>> testFile = "apps/frontend/e2e/sales.spec.ts";
             :>> testName = "Sales - should process a new sale";
             :>> category = TestCategory::E2E;
        }
        @SourceFile {
            :>> path = "apps/frontend/e2e/vehicles.spec.ts";
        }
        verification e2eVehicleInventory : TestCase {
             :>> testFile = "apps/frontend/e2e/vehicles.spec.ts";
             :>> testName = "Vehicles - should filter and view vehicle details";
             :>> category = TestCategory::E2E;
        }
    }
    package FrontendUnitTests {
        import SysMLPrimitives::*;
        import Verification::*;
        import SystemBehavior::SystemOperations::*;
        @SourceFile {
            :>> path = "apps/frontend/test/components/VehicleCard.test.tsx";
        }
        verification vehicleCardComponentTest : TestCase {
             :>> testFile = "apps/frontend/test/components/VehicleCard.test.tsx";
             :>> testName = "VehicleCard - should render vehicle details correctly";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/frontend/test/unit/hooks/useVehicles.test.tsx";
        }
        verification useVehiclesHookTest : TestCase {
             :>> testFile = "apps/frontend/test/unit/hooks/useVehicles.test.tsx";
             :>> testName = "useVehicles - should fetch and return vehicles";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/frontend/test/unit/services/auth.service.test.ts";
        }
        verification frontendAuthServiceTest : TestCase {
             :>> testFile = "apps/frontend/test/unit/services/auth.service.test.ts";
             :>> testName = "AuthService - should handle login and store token";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/frontend/test/unit/store/authStore.test.ts";
        }
        verification authStoreTest : TestCase {
             :>> testFile = "apps/frontend/test/unit/store/authStore.test.ts";
             :>> testName = "AuthStore - should update state on login/logout";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/frontend/test/unit/services/vehicles.service.test.ts";
        }
        verification vehiclesServiceUnit : TestCase {
            doc /* Verifies frontend API calls for vehicle inventory, including filtering and pagination. */
             :>> testFile = "apps/frontend/test/unit/services/vehicles.service.test.ts";
             :>> testName = "Vehicles Service Unit Tests";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/frontend/test/unit/hooks/useVehicles.test.tsx";
        }
        verification useVehiclesHookUnit : TestCase {
            doc /* Verifies React hook logic for fetching and caching vehicle data using TanStack Query. */
             :>> testFile = "apps/frontend/test/unit/hooks/useVehicles.test.tsx";
             :>> testName = "useVehicles Hook Unit Tests";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/frontend/test/components/VehicleCard.test.tsx";
        }
        verification vehicleCardComponentUnit : TestCase {
            doc /* Verifies rendering of vehicle details and status badges in the UI. */
             :>> testFile = "apps/frontend/test/components/VehicleCard.test.tsx";
             :>> testName = "VehicleCard Component Unit Tests";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/frontend/test/unit/hooks/useCustomers.test.tsx";
        }
        verification useCustomersHookUnit : TestCase {
             :>> testFile = "apps/frontend/test/unit/hooks/useCustomers.test.tsx";
             :>> testName = "useCustomers Hook Unit Tests";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/frontend/test/unit/hooks/useSales.test.tsx";
        }
        verification useSalesHookUnit : TestCase {
             :>> testFile = "apps/frontend/test/unit/hooks/useSales.test.tsx";
             :>> testName = "useSales Hook Unit Tests";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/frontend/test/unit/services/api.test.ts";
        }
        verification apiServiceUnit : TestCase {
            doc /* Verifies axios interceptors and base API configuration. */
             :>> testFile = "apps/frontend/test/unit/services/api.test.ts";
             :>> testName = "API Service Unit Tests";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/frontend/test/unit/services/auth.service.test.ts";
        }
        verification frontendAuthServiceUnit : TestCase {
             :>> testFile = "apps/frontend/test/unit/services/auth.service.test.ts";
             :>> testName = "Frontend Auth Service Unit Tests";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/frontend/test/components/CustomerCard.test.tsx";
        }
        verification customerCardComponentUnit : TestCase {
             :>> testFile = "apps/frontend/test/components/CustomerCard.test.tsx";
             :>> testName = "CustomerCard Component Unit Tests";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/frontend/test/components/SaleCard.test.tsx";
        }
        verification saleCardComponentUnit : TestCase {
             :>> testFile = "apps/frontend/test/components/SaleCard.test.tsx";
             :>> testName = "SaleCard Component Unit Tests";
             :>> category = TestCategory::Unit;
        }
    }
    package TestInfrastructure {
        import SysMLPrimitives::*;
        @SourceFile {
            :>> path = "apps/backend/test/setup.ts";
        }
        part backendTestSetup {
            doc /* Global setup for backend Vitest environment. */
        }
        @SourceFile {
            :>> path = "apps/frontend/test/setup.ts";
        }
        part frontendTestSetup {
            doc /* Global setup for frontend Vitest environment (MSW, DOM). */
        }
        @SourceFile {
            :>> path = "apps/frontend/test/mocks/handlers.ts";
        }
        part mswHandlers {
            doc /* MSW API mocking handlers for frontend tests. */
        }
        @SourceFile {
            :>> path = "apps/backend/test/factories/user.factory.ts";
        }
        part testFactories {
            doc /* Data factories for generating test entities. */
        }
    }
    package BackendIntegrationTests {
        import SysMLPrimitives::*;
        import Verification::*;
        import SystemBehavior::SystemOperations::*;
        import SystemRequirements::*;
        @SourceFile {
            :>> path = "apps/backend/test/integration/sales.routes.test.ts";
        }
        verification salesRoutesIntegration : TestCase {
            doc /* Verifies CRUD operations for sales, statistics retrieval, and vehicle status synchronization. */
             :>> testFile = "apps/backend/test/integration/sales.routes.test.ts";
             :>> testName = "Sales Routes Integration Suite";
             :>> category = TestCategory::Integration;
        }
        @SourceFile {
            :>> path = "apps/backend/test/integration/vehicles.routes.test.ts";
        }
        verification vehiclesRoutesIntegration : TestCase {
            doc /* Verifies vehicle inventory management, VIN uniqueness constraints, and filtering logic. */
             :>> testFile = "apps/backend/test/integration/vehicles.routes.test.ts";
             :>> testName = "Vehicles Routes Integration Suite";
             :>> category = TestCategory::Integration;
        }
        @SourceFile {
            :>> path = "apps/backend/test/integration/auth.routes.test.ts";
        }
        verification authRoutesIntegration : TestCase {
            doc /* Verifies API endpoints for registration, login, and token refresh. */
             :>> testFile = "apps/backend/test/integration/auth.routes.test.ts";
             :>> testName = "Auth Routes Integration Suite";
             :>> category = TestCategory::Integration;
        }
        @SourceFile {
            :>> path = "apps/backend/test/integration/customers.routes.test.ts";
        }
        verification customersRoutesIntegration : TestCase {
            doc /* Verifies customer CRUD operations and sales history retrieval. */
             :>> testFile = "apps/backend/test/integration/customers.routes.test.ts";
             :>> testName = "Customers Routes Integration Suite";
             :>> category = TestCategory::Integration;
        }
        @SourceFile {
            :>> path = "apps/backend/test/helpers/db.helper.ts";
        }
        part dbTestHelper {
            doc /* Utility for cleaning and seeding the test database. */
        }
    }
    package BackendUnitTests {
        import SysMLPrimitives::*;
        import Verification::*;
        import SystemBehavior::SystemOperations::*;
        @SourceFile {
            :>> path = "apps/backend/test/unit/middleware/auth.middleware.test.ts";
        }
        verification authMiddlewareUnit : TestCase {
            doc /* Verifies JWT token validation and RBAC (Role-Based Access Control) enforcement. */
             :>> testFile = "apps/backend/test/unit/middleware/auth.middleware.test.ts";
             :>> testName = "Auth Middleware Unit Tests";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/backend/test/unit/services/auth.service.test.ts";
        }
        verification authServiceUnit : TestCase {
            doc /* Verifies registration, login, and token refresh business logic. */
             :>> testFile = "apps/backend/test/unit/services/auth.service.test.ts";
             :>> testName = "Auth Service Unit Tests";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/backend/test/unit/services/sales.service.test.ts";
        }
        verification salesServiceUnit : TestCase {
            doc /* Verifies sales processing logic and vehicle status transitions (Available -> Sold). */
             :>> testFile = "apps/backend/test/unit/services/sales.service.test.ts";
             :>> testName = "Sales Service Unit Tests";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/backend/test/unit/utils/jwt.util.test.ts";
        }
        verification jwtUtilUnit : TestCase {
            doc /* Verifies token signing and verification logic. */
             :>> testFile = "apps/backend/test/unit/utils/jwt.util.test.ts";
             :>> testName = "JWT Utility Unit Tests";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/backend/test/unit/utils/password.util.test.ts";
        }
        verification passwordUtilUnit : TestCase {
            doc /* Verifies password hashing and comparison. */
             :>> testFile = "apps/backend/test/unit/utils/password.util.test.ts";
             :>> testName = "Password Utility Unit Tests";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/backend/test/unit/services/customers.service.test.ts";
        }
        verification customersServiceUnit : TestCase {
            doc /* Verifies customer management and sales history retrieval logic. */
             :>> testFile = "apps/backend/test/unit/services/customers.service.test.ts";
             :>> testName = "Customers Service Unit Tests";
             :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/backend/test/unit/services/vehicles.service.test.ts";
        }
        verification vehiclesServiceUnit : TestCase {
            doc /* Verifies vehicle inventory management and filtering logic. */
             :>> testFile = "apps/backend/test/unit/services/vehicles.service.test.ts";
             :>> testName = "Vehicles Service Unit Tests";
             :>> category = TestCategory::Unit;
        }
    }
    package E2ETests {
        import SysMLPrimitives::*;
        import Verification::*;
        import SystemRequirements::*;
        @SourceFile {
            :>> path = "apps/frontend/e2e/auth.spec.ts";
        }
        verification authE2E : TestCase {
            doc /* Verifies full login/logout flow and protected route redirection in the browser. */
             :>> testFile = "apps/frontend/e2e/auth.spec.ts";
             :>> testName = "Authentication E2E Flow";
             :>> category = TestCategory::E2E;
        }
        @SourceFile {
            :>> path = "apps/frontend/e2e/vehicles.spec.ts";
        }
        verification vehiclesE2E : TestCase {
            doc /* Verifies vehicle listing, searching, and creation workflows from a user perspective. */
             :>> testFile = "apps/frontend/e2e/vehicles.spec.ts";
             :>> testName = "Vehicle Management E2E";
             :>> category = TestCategory::E2E;
        }
        @SourceFile {
            :>> path = "apps/frontend/e2e/customers.spec.ts";
        }
        verification customersE2E : TestCase {
             :>> testFile = "apps/frontend/e2e/customers.spec.ts";
             :>> testName = "Customer Management E2E";
             :>> category = TestCategory::E2E;
        }
        @SourceFile {
            :>> path = "apps/frontend/e2e/sales.spec.ts";
        }
        verification salesE2E : TestCase {
             :>> testFile = "apps/frontend/e2e/sales.spec.ts";
             :>> testName = "Sales Workflow E2E";
             :>> category = TestCategory::E2E;
        }
        @SourceFile {
            :>> path = "apps/frontend/e2e/dashboard.spec.ts";
        }
        verification dashboardE2E : TestCase {
             :>> testFile = "apps/frontend/e2e/dashboard.spec.ts";
             :>> testName = "Dashboard Overview E2E";
             :>> category = TestCategory::E2E;
        }
    }
}
