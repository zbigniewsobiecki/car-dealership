package Verification {
    import TestMappings::*;
    import CoverageAnalysis::*;
    import SysMLPrimitives::*;
    import SystemRequirements::*;
    import SystemBehavior::*;
    doc /*Verification. Test coverage and requirement traceability. Base definitions for verification modeling. TestMappings and CoverageAnalysis packages are created as sibling files during Cycle 5. */
    enum def TestCategory {
        Unit;
        Integration;
        E2E;
        Performance;
        Security;
        Smoke;
        Regression;
    }
    item def TestCase :> BaseDTO {
        doc /*Base verification definition for test cases */
        attribute testFile : FilePath;
        attribute testName : String;
        attribute category : TestCategory;
        attribute description : String [0..1];
    }
    analysis def TestCoverage {
        doc /*Template for test coverage analysis. Specialize with :> and redefine with :>> */
        attribute testedOperations : Integer;
        attribute totalOperations : Integer;
        attribute coveragePercent : Real;
    }
}
