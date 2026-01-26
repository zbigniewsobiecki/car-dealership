package CoverageAnalysis {
    import SysMLPrimitives::*;
    import Verification::*;
    import TestMappings::*;
    analysis def BackendTestCoverage :> TestCoverageReport {
        doc /* Analysis of backend test coverage across services and routes. */
        results {
            :>> totalOperations = 15;
            :>> testedOperations = 12;
        }
    }
}
