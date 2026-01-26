package Verification {
    import TestMappings::*;
    import CoverageAnalysis::*;
    import SysMLPrimitives::*;
    import SystemRequirements::*;
    import SystemBehavior::*;
    doc /*Verification. Test coverage and requirement traceability. Base definitions for verification modeling. TestMappings and CoverageAnalysis packages are created as sibling files during Cycle 5. */


    // Test category enumeration
    enum def TestCategory {
        Unit;
        Integration;
        E2E;
        Performance;
        Security;
        Smoke;
        Regression;
    }

    // Test case definition - base type for all test cases
    verification def TestCase {
        doc /*Base verification definition for test cases */
        attribute testFile : FilePath;
        attribute testName : String;
        attribute category : TestCategory;
        attribute description : String [0..1];
    }

    // Test coverage analysis template
    analysis def TestCoverage {
        doc /*Template for test coverage analysis */
        results {
            attribute testedOperations : Integer;
            attribute totalOperations : Integer;
            attribute coveragePercent : Real;
        }
    }
}
