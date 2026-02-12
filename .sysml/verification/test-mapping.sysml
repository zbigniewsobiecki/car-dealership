package TestMappings {
    import SysMLPrimitives::*;
    import Verification::*;
    import SystemRequirements::*;
    import SystemBehavior::SystemOperations::*;
    import FrontendBehavior::*;
    import DomainEntities::*;
    import DataTransferObjects::*;


    package FrontendComponentTests {
        @SourceFile {
            :>> path = "apps/frontend/test/components/CustomerCard.test.tsx";
        }
        item def CustomerCardRendering :> TestCase {
            :>> testFile = "apps/frontend/test/components/CustomerCard.test.tsx";
            :>> testName = "should render customer information";
            :>> category = TestCategory::Unit;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/components/Login.test.tsx";
        }
        item def LoginFlowTest :> TestCase {
            doc /* Verifies LoginUser operation from UI perspective */
            :>> testFile = "apps/frontend/test/components/Login.test.tsx";
            :>> testName = "should navigate to dashboard on successful login";
            :>> category = TestCategory::Unit;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/components/ProtectedRoute.test.tsx";
        }
        item def ProtectedRouteGuard :> TestCase {
            :>> testFile = "apps/frontend/test/components/ProtectedRoute.test.tsx";
            :>> testName = "should redirect to login when not authenticated";
            :>> category = TestCategory::Unit;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/components/SaleCard.test.tsx";
        }
        item def SaleCardRendering :> TestCase {
            :>> testFile = "apps/frontend/test/components/SaleCard.test.tsx";
            :>> testName = "should render sale information";
            :>> category = TestCategory::Unit;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/components/VehicleCard.test.tsx";
        }
        item def VehicleCardRendering :> TestCase {
            :>> testFile = "apps/frontend/test/components/VehicleCard.test.tsx";
            :>> testName = "should render vehicle information";
            :>> category = TestCategory::Unit;
        }
    }

    package FrontendHookTests {
        @SourceFile {
            :>> path = "apps/frontend/test/unit/hooks/useCustomers.test.tsx";
        }
        item def UseCustomersHookTest :> TestCase {
            :>> testFile = "apps/frontend/test/unit/hooks/useCustomers.test.tsx";
            :>> testName = "should fetch all customers";
            :>> category = TestCategory::Unit;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/unit/hooks/useSales.test.tsx";
        }
        item def UseSalesHookTest :> TestCase {
            :>> testFile = "apps/frontend/test/unit/hooks/useSales.test.tsx";
            :>> testName = "should fetch all sales";
            :>> category = TestCategory::Unit;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/unit/hooks/useVehicles.test.tsx";
        }
        item def UseVehiclesHookTest :> TestCase {
            :>> testFile = "apps/frontend/test/unit/hooks/useVehicles.test.tsx";
            :>> testName = "should fetch all vehicles";
            :>> category = TestCategory::Unit;
        }
    }
    package BackendServiceUnitTests {
        import SystemBehavior::SystemOperations::*;

        @SourceFile {
            :>> path = "apps/backend/test/unit/services/auth.service.test.ts";
        }
        item def AuthServiceRegisterTest :> TestCase {
            doc /* Verifies RegisterUser operation logic */
            :>> testFile = "apps/backend/test/unit/services/auth.service.test.ts";
            :>> testName = "should register a new user successfully";
            :>> category = TestCategory::Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/services/customers.service.test.ts";
        }
        item def CustomerServiceCreateTest :> TestCase {
            doc /* Verifies CustomerServiceOperations::createCustomer */
            :>> testFile = "apps/backend/test/unit/services/customers.service.test.ts";
            :>> testName = "should create a customer successfully";
            :>> category = TestCategory::Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/services/sales.service.test.ts";
        }
        item def SalesServiceCreateTest :> TestCase {
            doc /* Verifies CreateSale operation logic and vehicle status updates */
            :>> testFile = "apps/backend/test/unit/services/sales.service.test.ts";
            :>> testName = "should create a sale successfully";
            :>> category = TestCategory::Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/services/vehicles.service.test.ts";
        }
        item def VehicleServiceCreateTest :> TestCase {
            doc /* Verifies CreateVehicle operation logic and VIN uniqueness check */
            :>> testFile = "apps/backend/test/unit/services/vehicles.service.test.ts";
            :>> testName = "should create a vehicle successfully";
            :>> category = TestCategory::Unit;
        }
    }
    package BackendIntegrationTests {
        import APIEndpoints::*;
        import SystemRequirements::*;

        @SourceFile {
            :>> path = "apps/backend/test/integration/auth.routes.test.ts";
        }
        item def AuthRoutesIntegration :> TestCase {
            doc /* Verifies LoginEndpoint and SR_AUTH_001 (JWT) */
            :>> testFile = "apps/backend/test/integration/auth.routes.test.ts";
            :>> testName = "should login successfully with valid credentials";
            :>> category = TestCategory::Integration;
        }

        @SourceFile {
            :>> path = "apps/backend/test/integration/customers.routes.test.ts";
        }
        item def CustomerRoutesIntegration :> TestCase {
            doc /* Verifies CreateCustomerEndpoint */
            :>> testFile = "apps/backend/test/integration/customers.routes.test.ts";
            :>> testName = "should create a new customer";
            :>> category = TestCategory::Integration;
        }

        @SourceFile {
            :>> path = "apps/backend/test/integration/sales.routes.test.ts";
        }
        item def SalesRoutesIntegration :> TestCase {
            doc /* Verifies CreateSaleEndpoint and business logic side-effects */
            :>> testFile = "apps/backend/test/integration/sales.routes.test.ts";
            :>> testName = "should update vehicle status when sale is completed";
            :>> category = TestCategory::Integration;
        }

        @SourceFile {
            :>> path = "apps/backend/test/integration/vehicles.routes.test.ts";
        }
        item def VehicleRoutesIntegration :> TestCase {
            doc /* Verifies ListVehiclesEndpoint filtering */
            :>> testFile = "apps/backend/test/integration/vehicles.routes.test.ts";
            :>> testName = "should filter vehicles by make";
            :>> category = TestCategory::Integration;
        }
    }
    package FrontendE2ETests {
        import SystemRequirements::*;

        @SourceFile {
            :>> path = "apps/frontend/e2e/auth.spec.ts";
        }
        item def AuthE2EJourney :> TestCase {
            doc /* Verifies full authentication lifecycle in the browser */
            :>> testFile = "apps/frontend/e2e/auth.spec.ts";
            :>> testName = "user can login and logout";
            :>> category = TestCategory::E2E;
        }

        @SourceFile {
            :>> path = "apps/frontend/e2e/customers.spec.ts";
        }
        item def CustomerManagementE2E :> TestCase {
            :>> testFile = "apps/frontend/e2e/customers.spec.ts";
            :>> testName = "user can create and edit customers";
            :>> category = TestCategory::E2E;
        }

        @SourceFile {
            :>> path = "apps/frontend/e2e/sales.spec.ts";
        }
        item def SalesWorkflowE2E :> TestCase {
            :>> testFile = "apps/frontend/e2e/sales.spec.ts";
            :>> testName = "user can record a new sale";
            :>> category = TestCategory::E2E;
        }

        @SourceFile {
            :>> path = "apps/frontend/e2e/vehicles.spec.ts";
        }
        item def VehicleInventoryE2E :> TestCase {
            :>> testFile = "apps/frontend/e2e/vehicles.spec.ts";
            :>> testName = "user can filter and manage vehicles";
            :>> category = TestCategory::E2E;
        }
    }
    package BackendUtilTests {
        import SystemBehavior::SystemOperations::*;

        @SourceFile {
            :>> path = "apps/backend/test/unit/middleware/auth.middleware.test.ts";
        }
        item def AuthMiddlewareTest :> TestCase {
            doc /* Verifies AuthenticateRequest middleware action */
            :>> testFile = "apps/backend/test/unit/middleware/auth.middleware.test.ts";
            :>> testName = "should authenticate valid token";
            :>> category = TestCategory::Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/middleware/errorHandler.middleware.test.ts";
        }
        item def ErrorHandlerTest :> TestCase {
            doc /* Verifies HandleError middleware action */
            :>> testFile = "apps/backend/test/unit/middleware/errorHandler.middleware.test.ts";
            :>> testName = "should handle AppError correctly";
            :>> category = TestCategory::Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/utils/jwt.util.test.ts";
        }
        item def JwtUtilTest :> TestCase {
            doc /* Verifies SignToken utility action */
            :>> testFile = "apps/backend/test/unit/utils/jwt.util.test.ts";
            :>> testName = "should sign and verify tokens";
            :>> category = TestCategory::Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/utils/password.util.test.ts";
        }
        item def PasswordUtilTest :> TestCase {
            doc /* Verifies HashPassword utility action */
            :>> testFile = "apps/backend/test/unit/utils/password.util.test.ts";
            :>> testName = "should hash and compare passwords";
            :>> category = TestCategory::Unit;
        }
    }
    package FrontendServiceTests {
        import FrontendBehavior::*;

        @SourceFile {
            :>> path = "apps/frontend/test/unit/services/api.test.ts";
        }
        item def ApiClientTest :> TestCase {
            doc /* Verifies ApiClientConfiguration interceptors */
            :>> testFile = "apps/frontend/test/unit/services/api.test.ts";
            :>> testName = "should include auth header when token exists";
            :>> category = TestCategory::Unit;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/unit/services/auth.service.test.ts";
        }
        item def AuthClientServiceTest :> TestCase {
            doc /* Verifies AuthClientService::login */
            :>> testFile = "apps/frontend/test/unit/services/auth.service.test.ts";
            :>> testName = "should login and store token";
            :>> category = TestCategory::Unit;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/unit/services/vehicles.service.test.ts";
        }
        item def VehicleClientServiceTest :> TestCase {
            doc /* Verifies FetchAllVehicles and ConstructQueryParams */
            :>> testFile = "apps/frontend/test/unit/services/vehicles.service.test.ts";
            :>> testName = "should fetch vehicles with filters";
            :>> category = TestCategory::Unit;
        }
        @SourceFile {
            :>> path = "apps/frontend/test/unit/store/authStore.test.ts";
        }
        item def AuthStoreUnitTest :> TestCase {
            doc /* Verifies login/logout state transitions, localStorage persistence, and user updates in authStore. */
            :>> testFile = "apps/frontend/test/unit/store/authStore.test.ts";
            :>> testName = "authStore state management";
            :>> category = TestCategory::Unit;
        }
    }
    package TestInfrastructure {
        @SourceFile {
            :>> path = "apps/backend/test/factories/user.factory.ts";
        }
        part def UserFactory :> Module {
            :>> path = "apps/backend/test/factories/user.factory.ts";
            :>> responsibility = "Generates mock user data for tests.";
        }

        @SourceFile {
            :>> path = "apps/backend/test/factories/vehicle.factory.ts";
        }
        part def VehicleFactory :> Module {
            :>> path = "apps/backend/test/factories/vehicle.factory.ts";
            :>> responsibility = "Generates mock vehicle data for tests.";
        }

        @SourceFile {
            :>> path = "apps/backend/test/helpers/auth.helper.ts";
        }
        part def AuthTestHelper :> Module {
            :>> path = "apps/backend/test/helpers/auth.helper.ts";
            :>> responsibility = "Provides helper methods for authenticated integration tests.";
        }

        @SourceFile {
            :>> path = "apps/backend/test/setup.ts";
        }
        part def BackendTestSetup :> Module {
            :>> path = "apps/backend/test/setup.ts";
            :>> responsibility = "Global test environment setup and teardown.";
        }
        @SourceFile {
            :>> path = "apps/backend/test/factories/customer.factory.ts";
        }
        part def CustomerFactory :> Module {
            :>> path = "apps/backend/test/factories/customer.factory.ts";
            :>> responsibility = "Generates mock customer data and DTOs for testing.";
            action createMockCustomer {
                in overrides : JSON [0..1];
                out customer : Customer;
            }
            action createMockCreateCustomerDto {
                in overrides : JSON [0..1];
                out dto : CreateCustomerDto;
            }
        }

        @SourceFile {
            :>> path = "apps/backend/test/factories/sale.factory.ts";
        }
        part def SaleFactory :> Module {
            :>> path = "apps/backend/test/factories/sale.factory.ts";
            :>> responsibility = "Generates mock sale data and DTOs for testing.";
            action createMockSale {
                in overrides : JSON [0..1];
                out sale : Sale;
            }
            action createMockCreateSaleDto {
                in overrides : JSON [0..1];
                out dto : CreateSaleDto;
            }
        }
        @SourceFile {
            :>> path = "apps/backend/test/helpers/db.helper.ts";
        }
        part def DbTestHelper :> Module {
            :>> path = "apps/backend/test/helpers/db.helper.ts";
            :>> responsibility = "Provides utilities for mocking database queries in Vitest.";
            action createMockQuery;
            action resetDbMocks;
        }

        @SourceFile {
            :>> path = "apps/frontend/test/mocks/server.ts";
        }
        part def MockServer :> Module {
            :>> path = "apps/frontend/test/mocks/server.ts";
            :>> responsibility = "Configures MSW (Mock Service Worker) node server for frontend tests.";
        }

        @SourceFile {
            :>> path = "apps/frontend/test/setup.ts";
        }
        part def FrontendTestSetup :> Module {
            :>> path = "apps/frontend/test/setup.ts";
            :>> responsibility = "Global frontend test configuration, including MSW lifecycle and DOM cleanup.";
        }
    }
    package MockingInfrastructure {
        import SysMLPrimitives::*;
        import DomainEntities::*;

        @SourceFile {
            :>> path = "apps/frontend/test/mocks/handlers.ts";
        }
        part def ApiMockHandlers :> Module {
            :>> path = "apps/frontend/test/mocks/handlers.ts";
            :>> responsibility = "Defines MSW request handlers for Auth, Vehicles, Customers, and Sales APIs.";
            item mockUser : User;
            item mockVehicle : Vehicle;
            item mockCustomer : Customer;
            item mockSale : Sale;
        }
    }

    @SourceFile {
        :>> path = "apps/frontend/e2e/dashboard.spec.ts";
    }
    item def DashboardE2EJourney :> TestCase {
        doc /* Verifies dashboard visibility, navigation sidebar links, and section transitions. */
        :>> testFile = "apps/frontend/e2e/dashboard.spec.ts";
        :>> testName = "Dashboard Navigation and Visibility";
        :>> category = TestCategory::E2E;
    }
}
