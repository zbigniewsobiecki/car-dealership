package TestMappings {
    import SysMLPrimitives::*;
    import Verification::*;
    import SystemBehavior::SystemOperations::*;
    package AuthIntegrationTests {
        import SysMLPrimitives::*;
        import Verification::*;
        import SystemRequirements::*;
        import SystemOperations::*;

        @SourceFile {
            :>> path = "apps/backend/test/integration/auth.routes.test.ts";
        }
        verification loginSuccess : TestCase {
            doc /* Verifies the Login operation and FR002. */
             :>> testFile = "apps/backend/test/integration/auth.routes.test.ts";
             :>> testName = "should login successfully with valid credentials";
             :>> category = Integration;
        }

        @SourceFile {
            :>> path = "apps/backend/test/integration/auth.routes.test.ts";
        }
        verification registerUserAdmin : TestCase {
            doc /* Verifies the RegisterUser operation and FR002. */
             :>> testFile = "apps/backend/test/integration/auth.routes.test.ts";
             :>> testName = "should register new user when admin is authenticated";
             :>> category = Integration;
        }

        @SourceFile {
            :>> path = "apps/backend/test/integration/auth.routes.test.ts";
        }
        verification refreshToken : TestCase {
             :>> testFile = "apps/backend/test/integration/auth.routes.test.ts";
             :>> testName = "should refresh tokens successfully";
             :>> category = Integration;
        }
    }
    package CustomerIntegrationTests {
        import SysMLPrimitives::*;
        import Verification::*;
        import SystemBehavior::BackendServices::*;

        @SourceFile {
            :>> path = "apps/backend/test/integration/customers.routes.test.ts";
        }
        verification getAllCustomers : TestCase {
             :>> testFile = "apps/backend/test/integration/customers.routes.test.ts";
             :>> testName = "should return all customers";
             :>> category = Integration;
        }

        @SourceFile {
            :>> path = "apps/backend/test/integration/customers.routes.test.ts";
        }
        verification createCustomer : TestCase {
             :>> testFile = "apps/backend/test/integration/customers.routes.test.ts";
             :>> testName = "should create a new customer";
             :>> category = Integration;
        }
        @SourceFile {
            :>> path = "apps/backend/test/integration/customers.routes.test.ts";
        }
        verification getCustomerSales : TestCase {
             :>> testFile = "apps/backend/test/integration/customers.routes.test.ts";
             :>> testName = "should return sales for a customer";
             :>> category = Integration;
        }

        @SourceFile {
            :>> path = "apps/backend/test/integration/sales.routes.test.ts";
        }
        verification updateVehicleOnSale : TestCase {
             :>> testFile = "apps/backend/test/integration/sales.routes.test.ts";
             :>> testName = "should update vehicle status when sale is completed";
             :>> category = Integration;
        }
    }
    package SalesIntegrationTests {
        import SysMLPrimitives::*;
        import Verification::*;
        import SystemOperations::*;

        @SourceFile {
            :>> path = "apps/backend/test/integration/sales.routes.test.ts";
        }
        verification getAllSales : TestCase {
             :>> testFile = "apps/backend/test/integration/sales.routes.test.ts";
             :>> testName = "should return all sales";
             :>> category = Integration;
        }

        @SourceFile {
            :>> path = "apps/backend/test/integration/sales.routes.test.ts";
        }
        verification createSale : TestCase {
            doc /* Verifies CreateSale operation and vehicle status updates. */
             :>> testFile = "apps/backend/test/integration/sales.routes.test.ts";
             :>> testName = "should create a new sale";
             :>> category = Integration;
        }

        @SourceFile {
            :>> path = "apps/backend/test/integration/sales.routes.test.ts";
        }
        verification getSalesStats : TestCase {
             :>> testFile = "apps/backend/test/integration/sales.routes.test.ts";
             :>> testName = "should return sales stats";
             :>> category = Integration;
        }
    }
    package VehicleIntegrationTests {
        import SysMLPrimitives::*;
        import Verification::*;
        import SystemBehavior::BackendServices::*;

        @SourceFile {
            :>> path = "apps/backend/test/integration/vehicles.routes.test.ts";
        }
        verification getAllVehicles : TestCase {
             :>> testFile = "apps/backend/test/integration/vehicles.routes.test.ts";
             :>> testName = "should return all vehicles";
             :>> category = Integration;
        }

        @SourceFile {
            :>> path = "apps/backend/test/integration/vehicles.routes.test.ts";
        }
        verification createVehicle : TestCase {
             :>> testFile = "apps/backend/test/integration/vehicles.routes.test.ts";
             :>> testName = "should create a new vehicle";
             :>> category = Integration;
        }

        @SourceFile {
            :>> path = "apps/backend/test/integration/vehicles.routes.test.ts";
        }
        verification getVehicleStats : TestCase {
             :>> testFile = "apps/backend/test/integration/vehicles.routes.test.ts";
             :>> testName = "should return vehicle stats";
             :>> category = Integration;
        }
    }
    package ServiceUnitTests {
        import SysMLPrimitives::*;
        import Verification::*;
        import SystemOperations::*;
        import SystemBehavior::BackendServices::*;

        @SourceFile {
            :>> path = "apps/backend/test/unit/services/auth.service.test.ts";
        }
        verification authServiceRegister : TestCase {
             :>> testFile = "apps/backend/test/unit/services/auth.service.test.ts";
             :>> testName = "should register a new user successfully";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/services/customers.service.test.ts";
        }
        verification customerServiceGetAll : TestCase {
             :>> testFile = "apps/backend/test/unit/services/customers.service.test.ts";
             :>> testName = "should return all customers";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/services/sales.service.test.ts";
        }
        verification salesServiceCreate : TestCase {
             :>> testFile = "apps/backend/test/unit/services/sales.service.test.ts";
             :>> testName = "should create a sale successfully";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/services/vehicles.service.test.ts";
        }
        verification vehicleServiceCreate : TestCase {
             :>> testFile = "apps/backend/test/unit/services/vehicles.service.test.ts";
             :>> testName = "should create a vehicle successfully";
             :>> category = Unit;
        }
        @SourceFile {
            :>> path = "apps/backend/test/unit/services/auth.service.test.ts";
        }
        verification authServiceLogin : TestCase {
             :>> testFile = "apps/backend/test/unit/services/auth.service.test.ts";
             :>> testName = "should login successfully with valid credentials";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/services/sales.service.test.ts";
        }
        verification salesServiceVehicleUpdate : TestCase {
             :>> testFile = "apps/backend/test/unit/services/sales.service.test.ts";
             :>> testName = "should update vehicle status to SOLD when sale is completed";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/services/vehicles.service.test.ts";
        }
        verification vehicleServiceVinCheck : TestCase {
             :>> testFile = "apps/backend/test/unit/services/vehicles.service.test.ts";
             :>> testName = "should throw error if VIN already exists";
             :>> category = Unit;
        }
    }
    package MiddlewareTests {
        import SysMLPrimitives::*;
        import Verification::*;
        import SystemBehavior::BackendUtilities::*;

        @SourceFile {
            :>> path = "apps/backend/test/unit/middleware/auth.middleware.test.ts";
        }
        verification authenticateTokenValid : TestCase {
             :>> testFile = "apps/backend/test/unit/middleware/auth.middleware.test.ts";
             :>> testName = "should set user on request when token is valid";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/middleware/errorHandler.middleware.test.ts";
        }
        verification errorHandlerAppError : TestCase {
             :>> testFile = "apps/backend/test/unit/middleware/errorHandler.middleware.test.ts";
             :>> testName = "should handle AppError with correct status and message";
             :>> category = Unit;
        }
    }
    package TestFixtures {
        import SysMLPrimitives::*;
        import Verification::*;

        @SourceFile {
            :>> path = "apps/backend/test/factories/customer.factory.ts";
        }
        part customerFactory : Module {
            :>> responsibility = "Generates mock customer data for tests.";
        }

        @SourceFile {
            :>> path = "apps/backend/test/factories/sale.factory.ts";
        }
        part saleFactory : Module {
            :>> responsibility = "Generates mock sale data for tests.";
        }

        @SourceFile {
            :>> path = "apps/backend/test/factories/user.factory.ts";
        }
        part userFactory : Module {
            :>> responsibility = "Generates mock user data for tests.";
        }

        @SourceFile {
            :>> path = "apps/backend/test/factories/vehicle.factory.ts";
        }
        part vehicleFactory : Module {
            :>> responsibility = "Generates mock vehicle data for tests.";
        }

        @SourceFile {
            :>> path = "apps/backend/test/helpers/auth.helper.ts";
        }
        part authHelper : Module {
            :>> responsibility = "Provides JWT token generation for integration tests.";
        }

        @SourceFile {
            :>> path = "apps/backend/test/helpers/db.helper.ts";
        }
        part dbHelper : Module {
            :>> responsibility = "Provides database mocking utilities.";
        }
    }
    @SourceFile {
        :>> path = "apps/backend/test/setup.ts";
    }
    part backendTestSetup : Module {
        :>> responsibility = "Global test configuration and environment setup for Vitest.";
    }
    package FrontendE2ETests {
        import SysMLPrimitives::*;
        import Verification::*;
        import SystemRequirements::*;

        @SourceFile {
            :>> path = "apps/frontend/e2e/auth.spec.ts";
        }
        verification e2eLoginFlow : TestCase {
            doc /* Verifies FR002 and FR006 from a user perspective. */
             :>> testFile = "apps/frontend/e2e/auth.spec.ts";
             :>> testName = "should login successfully and navigate to dashboard";
             :>> category = E2E;
        }

        @SourceFile {
            :>> path = "apps/frontend/e2e/customers.spec.ts";
        }
        verification e2eCustomerNavigation : TestCase {
             :>> testFile = "apps/frontend/e2e/customers.spec.ts";
             :>> testName = "should navigate to customers page";
             :>> category = E2E;
        }

        @SourceFile {
            :>> path = "apps/frontend/e2e/sales.spec.ts";
        }
        verification e2eSalesStatsVisibility : TestCase {
             :>> testFile = "apps/frontend/e2e/sales.spec.ts";
             :>> testName = "should display sales stats on dashboard";
             :>> category = E2E;
        }

        @SourceFile {
            :>> path = "apps/frontend/e2e/vehicles.spec.ts";
        }
        verification e2eVehicleFilter : TestCase {
             :>> testFile = "apps/frontend/e2e/vehicles.spec.ts";
             :>> testName = "should filter vehicles by status";
             :>> category = E2E;
        }
    }
    package FrontendUnitTests {
        import SysMLPrimitives::*;
        import Verification::*;

        @SourceFile {
            :>> path = "apps/frontend/test/unit/services/auth.service.test.ts";
        }
        verification frontendAuthLogin : TestCase {
             :>> testFile = "apps/frontend/test/unit/services/auth.service.test.ts";
             :>> testName = "should login successfully with valid credentials";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/unit/services/vehicles.service.test.ts";
        }
        verification frontendVehicleGetAll : TestCase {
             :>> testFile = "apps/frontend/test/unit/services/vehicles.service.test.ts";
             :>> testName = "should return all vehicles";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/unit/store/authStore.test.ts";
        }
        verification authStoreLogin : TestCase {
            doc /* Verifies FR006 (Zustand state management). */
             :>> testFile = "apps/frontend/test/unit/store/authStore.test.ts";
             :>> testName = "should set user, token and isAuthenticated on login";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/components/ProtectedRoute.test.tsx";
        }
        verification verifyProtectedRoute : TestCase {
             :>> testFile = "apps/frontend/test/components/ProtectedRoute.test.tsx";
             :>> testName = "should redirect to login when not authenticated";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/unit/hooks/useVehicles.test.tsx";
        }
        verification verifyVehicleHooks : TestCase {
             :>> testFile = "apps/frontend/test/unit/hooks/useVehicles.test.tsx";
             :>> testName = "should fetch all vehicles";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/unit/services/api.test.ts";
        }
        verification verifyApiInterceptors : TestCase {
             :>> testFile = "apps/frontend/test/unit/services/api.test.ts";
             :>> testName = "should add Authorization header when token exists";
             :>> category = Unit;
        }
    }
    package UtilityUnitTests {
        import SysMLPrimitives::*;
        import Verification::*;
        import SystemBehavior::BackendUtilities::*;

        @SourceFile {
            :>> path = "apps/backend/test/unit/utils/jwt.util.test.ts";
        }
        verification jwtSignVerify : TestCase {
             :>> testFile = "apps/backend/test/unit/utils/jwt.util.test.ts";
             :>> testName = "should sign and verify a token successfully";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/utils/password.util.test.ts";
        }
        verification passwordHashCompare : TestCase {
             :>> testFile = "apps/backend/test/unit/utils/password.util.test.ts";
             :>> testName = "should hash and compare passwords correctly";
             :>> category = Unit;
        }
    }
    package FrontendHookTests {
        import SysMLPrimitives::*;
        import Verification::*;
        import SystemBehavior::FrontendHooks::*;

        @SourceFile {
            :>> path = "apps/frontend/test/unit/hooks/useCustomers.test.tsx";
        }
        verification useCustomersHook : TestCase {
             :>> testFile = "apps/frontend/test/unit/hooks/useCustomers.test.tsx";
             :>> testName = "should fetch customers successfully";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/unit/hooks/useSales.test.tsx";
        }
        verification useSalesHook : TestCase {
             :>> testFile = "apps/frontend/test/unit/hooks/useSales.test.tsx";
             :>> testName = "should fetch sales stats";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/unit/services/api.test.ts";
        }
        verification apiInterceptorAuth : TestCase {
             :>> testFile = "apps/frontend/test/unit/services/api.test.ts";
             :>> testName = "should attach auth header to requests";
             :>> category = Unit;
        }
    }
    package ComponentTests {
        import SysMLPrimitives::*;
        import Verification::*;
        import SystemModules::*;

        @SourceFile {
            :>> path = "apps/frontend/test/components/CustomerCard.test.tsx";
        }
        verification customerCardRender : TestCase {
             :>> testFile = "apps/frontend/test/components/CustomerCard.test.tsx";
             :>> testName = "should render customer information correctly";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/components/Login.test.tsx";
        }
        verification loginFormSubmit : TestCase {
             :>> testFile = "apps/frontend/test/components/Login.test.tsx";
             :>> testName = "should call login service on form submission";
             :>> category = Unit;
        }
    }

    package BackendIntegrationTests {
        @SourceFile {
            :>> path = "apps/backend/test/integration/sales.routes.test.ts";
        }
        verification verifyGetAllSales : TestCase {
             :>> testFile = "apps/backend/test/integration/sales.routes.test.ts";
             :>> testName = "GET /api/sales - should return all sales";
             :>> category = Integration;
        }

        @SourceFile {
            :>> path = "apps/backend/test/integration/sales.routes.test.ts";
        }
        verification verifyCreateSaleFlow : TestCase {
            doc /* Verifies the orchestration between Sales and Vehicle status updates. */
             :>> testFile = "apps/backend/test/integration/sales.routes.test.ts";
             :>> testName = "POST /api/sales - should create a new sale and update vehicle status";
             :>> category = Integration;
        }

        @SourceFile {
            :>> path = "apps/backend/test/integration/vehicles.routes.test.ts";
        }
        verification verifyVehicleCreation : TestCase {
             :>> testFile = "apps/backend/test/integration/vehicles.routes.test.ts";
             :>> testName = "POST /api/vehicles - should create a new vehicle";
             :>> category = Integration;
        }
    }

    package BackendUnitTests {
        @SourceFile {
            :>> path = "apps/backend/test/unit/middleware/auth.middleware.test.ts";
        }
        verification verifyAuthTokenMiddleware : TestCase {
             :>> testFile = "apps/backend/test/unit/middleware/auth.middleware.test.ts";
             :>> testName = "authenticateToken - should set user on request when token is valid";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/services/auth.service.test.ts";
        }
        verification verifyUserRegistration : TestCase {
             :>> testFile = "apps/backend/test/unit/services/auth.service.test.ts";
             :>> testName = "register - should register a new user successfully";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/services/sales.service.test.ts";
        }
        verification verifyVehicleStatusReversion : TestCase {
             :>> testFile = "apps/backend/test/unit/services/sales.service.test.ts";
             :>> testName = "delete - should revert vehicle status when deleting completed sale";
             :>> category = Unit;
        }
    }
    package E2ETests {
        import SysMLPrimitives::*;
        import Verification::*;

        @SourceFile {
            :>> path = "apps/frontend/e2e/auth.spec.ts";
        }
        verification verifyFullAuthJourney : TestCase {
            doc /* Verifies the complete authentication flow from UI to Backend. */
             :>> testFile = "apps/frontend/e2e/auth.spec.ts";
             :>> testName = "should login successfully and navigate to dashboard";
             :>> category = E2E;
        }

        @SourceFile {
            :>> path = "apps/frontend/e2e/sales.spec.ts";
        }
        verification verifySalesDashboardStats : TestCase {
             :>> testFile = "apps/frontend/e2e/sales.spec.ts";
             :>> testName = "should display sales stats on dashboard";
             :>> category = E2E;
        }

        @SourceFile {
            :>> path = "apps/frontend/e2e/vehicles.spec.ts";
        }
        verification verifyVehicleFiltering : TestCase {
             :>> testFile = "apps/frontend/e2e/vehicles.spec.ts";
             :>> testName = "should filter vehicles by status";
             :>> category = E2E;
        }
    }
}
