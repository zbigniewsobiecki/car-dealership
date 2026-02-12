package CoverageAnalysis {
    import SysMLPrimitives::*;
    import Verification::*;
    analysis OperationCoverageReport :> TestCoverage {
        doc /* Final Coverage of system operations by unit, integration, and E2E tests */
         :>> testedOperations = 25;
         :>> totalOperations = 25;
         :>> coveragePercent = 100.0;
    }
    analysis testBreakdown : TestCategoryBreakdown {
         :>> unitTestCount = 26;
         :>> integrationTestCount = 8;
         :>> e2eTestCount = 4;
         :>> totalTestCount = 38;
    }

    analysis def TestCategoryBreakdown {
        doc /* Breakdown of tests by category */
        attribute unitTestCount : Integer;
        attribute integrationTestCount : Integer;
        attribute e2eTestCount : Integer;
        attribute totalTestCount : Integer;
    }
    package CoverageGaps {
        doc /* All identified gaps have been addressed or documented. */
        @Deprecated;
        requirement def Gap_E2E :> BaseRequirement {
            doc /* Resolved: E2E tests for auth, customers, sales, and vehicles analyzed. */
             :>> id = "GAP-001";
        }
        requirement def Gap_Middleware :> BaseRequirement {
            doc /* Unit tests for auth and error handling middleware not yet mapped. */
             :>> id = "GAP-002";
        }
    }

    analysis RequirementCoverageReport :> TestCoverage {
        doc /* Coverage of functional and security requirements by verification */
         :>> testedOperations = 10;
         :>> totalOperations = 12;
         :>> coveragePercent = 83.3;
    }
}
