package TestMappings {
    import SysMLPrimitives::*;
    import Verification::*;
    import SystemRequirements::*;
    import SystemBehavior::SystemOperations::*;
    doc /* Test to requirement/operation mappings. */
    package BackendIntegrationTests {
        doc /* Integration tests for backend routes. */
        @SourceFile {
            :>> path = "apps/backend/test/integration/auth.routes.test.ts";
        }
        verification loginSuccess : TestCase {
            doc /* Verifies LoginUser operation and FR-001. */
             :>> testFile = "apps/backend/test/integration/auth.routes.test.ts";
             :>> testName = "should login successfully with valid credentials";
             :>> category = Integration;
        }
        @SourceFile {
            :>> path = "apps/backend/test/integration/auth.routes.test.ts";
        }
        verification registerUserAdmin : TestCase {
            doc /* Verifies RegisterUser operation and FR-001. */
             :>> testFile = "apps/backend/test/integration/auth.routes.test.ts";
             :>> testName = "should register new user when admin is authenticated";
             :>> category = Integration;
        }
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
            doc /* Verifies CreateCustomer operation. */
             :>> testFile = "apps/backend/test/integration/customers.routes.test.ts";
             :>> testName = "should create a new customer";
             :>> category = Integration;
        }
        @SourceFile {
            :>> path = "apps/backend/test/integration/sales.routes.test.ts";
        }
        verification createSaleIntegration : TestCase {
            doc /* Verifies SystemOperations::ProcessSale. */
             :>> testFile = "apps/backend/test/integration/sales.routes.test.ts";
             :>> testName = "POST /api/sales should create sale and update vehicle status";
             :>> category = Integration;
        }

        @SourceFile {
            :>> path = "apps/backend/test/integration/vehicles.routes.test.ts";
        }
        verification addVehicleIntegration : TestCase {
            doc /* Verifies SystemOperations::AddVehicle. */
             :>> testFile = "apps/backend/test/integration/vehicles.routes.test.ts";
             :>> testName = "POST /api/vehicles should add new vehicle to inventory";
             :>> category = Integration;
        }
    }
    package TestFixtures {
        doc /* Test data factories and helpers. */
        @SourceFile {
            :>> path = "apps/backend/test/factories/customer.factory.ts";
        }
        part customerFactory;
        @SourceFile {
            :>> path = "apps/backend/test/factories/sale.factory.ts";
        }
        part saleFactory;
        @SourceFile {
            :>> path = "apps/backend/test/factories/user.factory.ts";
        }
        part userFactory;
        @SourceFile {
            :>> path = "apps/backend/test/factories/vehicle.factory.ts";
        }
        part vehicleFactory;
    }
    package BackendUnitTests {
        doc /* Unit tests for backend services. */

        @SourceFile {
            :>> path = "apps/backend/test/unit/services/auth.service.test.ts";
        }
        verification authServiceLogin : TestCase {
            doc /* Verifies SystemOperations::LoginUser. */
             :>> testFile = "apps/backend/test/unit/services/auth.service.test.ts";
             :>> testName = "login should return tokens for valid credentials";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/services/customers.service.test.ts";
        }
        verification customerServiceCreate : TestCase {
            doc /* Verifies SystemOperations::CreateCustomer. */
             :>> testFile = "apps/backend/test/unit/services/customers.service.test.ts";
             :>> testName = "create should persist customer data";
             :>> category = Unit;
        }
        @SourceFile {
            :>> path = "apps/backend/test/unit/services/sales.service.test.ts";
        }
        verification salesServiceProcess : TestCase {
            doc /* Verifies SystemOperations::ProcessSale. */
             :>> testFile = "apps/backend/test/unit/services/sales.service.test.ts";
             :>> testName = "processSale should create record and update vehicle";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/services/vehicles.service.test.ts";
        }
        verification vehiclesServiceAdd : TestCase {
            doc /* Verifies SystemOperations::AddVehicle. */
             :>> testFile = "apps/backend/test/unit/services/vehicles.service.test.ts";
             :>> testName = "addVehicle should save new vehicle";
             :>> category = Unit;
        }
    }
    package FrontendE2ETests {
        doc /* Playwright/Cypress E2E tests for user journeys. */

        @SourceFile {
            :>> path = "apps/frontend/e2e/auth.spec.ts";
        }
        verification userLoginJourney : TestCase {
            doc /* Verifies FR-001 and FR-005. */
             :>> testFile = "apps/frontend/e2e/auth.spec.ts";
             :>> testName = "user can login and see dashboard";
             :>> category = E2E;
        }

        @SourceFile {
            :>> path = "apps/frontend/e2e/customers.spec.ts";
        }
        verification customerManagementJourney : TestCase {
             :>> testFile = "apps/frontend/e2e/customers.spec.ts";
             :>> testName = "user can create and view customers";
             :>> category = E2E;
        }

        @SourceFile {
            :>> path = "apps/frontend/e2e/vehicles.spec.ts";
        }
        verification vehicleInventoryJourney : TestCase {
             :>> testFile = "apps/frontend/e2e/vehicles.spec.ts";
             :>> testName = "user can filter and view vehicle details";
             :>> category = E2E;
        }

        @SourceFile {
            :>> path = "apps/frontend/e2e/sales.spec.ts";
        }
        verification salesProcessJourney : TestCase {
             :>> testFile = "apps/frontend/e2e/sales.spec.ts";
             :>> testName = "user can complete a vehicle sale";
             :>> category = E2E;
        }
    }
    package BackendUtilTests {
        doc /* Unit tests for backend utility functions. */

        @SourceFile {
            :>> path = "apps/backend/test/unit/utils/jwt.util.test.ts";
        }
        verification jwtSignVerify : TestCase {
            doc /* Verifies SystemOperations::JwtOperations. */
             :>> testFile = "apps/backend/test/unit/utils/jwt.util.test.ts";
             :>> testName = "should sign and verify tokens correctly";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/utils/password.util.test.ts";
        }
        verification passwordHashCompare : TestCase {
            doc /* Verifies SystemOperations::PasswordOperations. */
             :>> testFile = "apps/backend/test/unit/utils/password.util.test.ts";
             :>> testName = "should hash and compare passwords securely";
             :>> category = Unit;
        }
    }
    package BackendMiddlewareTests {
        doc /* Tests for Express middleware. */

        @SourceFile {
            :>> path = "apps/backend/test/unit/middleware/auth.middleware.test.ts";
        }
        verification authMiddlewareGuard : TestCase {
            doc /* Verifies security requirement FR-001. */
             :>> testFile = "apps/backend/test/unit/middleware/auth.middleware.test.ts";
             :>> testName = "should allow valid tokens and block invalid ones";
             :>> category = Unit;
        }

        @SourceFile {
            :>> path = "apps/backend/test/unit/middleware/errorHandler.middleware.test.ts";
        }
        verification errorHandling : TestCase {
             :>> testFile = "apps/backend/test/unit/middleware/errorHandler.middleware.test.ts";
             :>> testName = "should format errors consistently for the API";
             :>> category = Unit;
        }
    }
}
