package CoverageAnalysis {
    import SysMLPrimitives::*;
    import Verification::*;
    doc /* Test coverage analysis and gap identification. */
    analysis def TestCoverageReport {
        subject testSuite : TestMappings;
        results {
            attribute testedOperations : Integer;
            attribute totalOperations : Integer;
            attribute verifiedRequirements : Integer;
            attribute totalRequirements : Integer;
        }
    }
    package CoverageGaps {
        doc /* Identified gaps in test coverage. */

        package UntestedOperations {
            doc /* Operations with no identified verification. */
            // TODO: Check if VehiclesControllerOperations.getStats has tests
        }

        package RequirementCoverage {
            doc /* Requirements mapping to verification. */
            // FR-001 (Auth) -> Verified by BackendIntegrationTests::loginSuccess
            // FR-002 (Uploads) -> GAP: No tests found for multer/file uploads yet.
            // FR-003 (Validation) -> Verified by various integration tests (400 responses).
        }
    }
}
