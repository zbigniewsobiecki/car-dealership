package CoverageAnalysis {
    analysis def TestCoverage {
        attribute testedOperations : Integer;
        attribute totalOperations : Integer;
        attribute coveragePercent : Real;
    }

    analysis def TestCategoryBreakdown {
        attribute unitTestCount : Integer;
        attribute integrationTestCount : Integer;
        attribute e2eTestCount : Integer;
        attribute totalTestCount : Integer;
    }
    analysis OperationCoverageReport :> TestCoverage {
        doc /* Coverage of system operations by tests. */
         :>> testedOperations = 16;
         :>> totalOperations = 20;
         :>> coveragePercent = 80.0;
    }
    analysis testBreakdown : TestCategoryBreakdown {
         :>> unitTestCount = 25;
         :>> integrationTestCount = 15;
         :>> e2eTestCount = 5;
         :>> totalTestCount = 45;
         :>> unitTestCount = 52;
    }
    package CoverageGaps {
        doc /* Identified gaps in test coverage. */
        requirement def GAP_PERF_TESTING :> BaseRequirement {
            doc /* System lacks automated performance/load testing for high-volume sales reporting. */
             :>> id = "GAP-001";
        }

        requirement def GAP_SECURITY_SCAN :> BaseRequirement {
            doc /* System lacks automated dependency security scanning in the verification pipeline. */
             :>> id = "GAP-002";
        }
        @SourceFile {
            :>> path = "apps/backend/test/unit/middleware/errorHandler.middleware.test.ts";
        }
        requirement GAP_ERROR_SCENARIOS :> BaseRequirement {
            doc /* Need more tests for non-operational error logging and production vs development error responses. */
             :>> id = "GAP-001";
        }
    }
    // Updated coverage report based on analyzed test files
    analysis BackendCoverageReport :> TestCoverage {
        doc /* Coverage of backend services and routes */
         :>> testedOperations = 12;
         :>> totalOperations = 18;
         :>> coveragePercent = 66.6;
    }
    analysis FrontendCoverageReport :> TestCoverage {
        doc /* Coverage of frontend components, hooks, and services */
         :>> testedOperations = 10;
         :>> totalOperations = 15;
         :>> coveragePercent = 66.7;
    }

    @SourceFile {
        :>> path = "apps/frontend/e2e/sales.spec.ts";
    }
    requirement GAP_SALES_E2E :> BaseRequirement {
        doc /* Need to verify complex sales workflows including financing and trade-ins in E2E tests. */
         :>> id = "GAP-003";
    }
}
