package ComponentTests {
    import SysMLPrimitives::*;
    import Verification::*;

    @SourceFile {
        :>> path = "apps/frontend/test/mocks/server.ts";
    }
    part mswServer {
        doc /* MSW Node server setup for frontend testing. */
    }

    @SourceFile {
        :>> path = "apps/frontend/test/components/Login.test.tsx";
    }
    verification loginComponentTest : TestCase {
        doc /* Verifies the Login page rendering, form interactions, and authentication flow. */
         :>> testFile = "apps/frontend/test/components/Login.test.tsx";
         :>> testName = "Login Component Suite";
         :>> category = TestCategory::Unit;
    }

    @SourceFile {
        :>> path = "apps/frontend/test/components/ProtectedRoute.test.tsx";
    }
    verification protectedRouteComponentTest : TestCase {
        doc /* Verifies the ProtectedRoute guard logic for authenticated and unauthenticated states. */
         :>> testFile = "apps/frontend/test/components/ProtectedRoute.test.tsx";
         :>> testName = "ProtectedRoute Component Suite";
         :>> category = TestCategory::Unit;
    }
}
