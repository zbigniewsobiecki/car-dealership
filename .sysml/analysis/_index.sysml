package Analysis {
    import SysMLPrimitives::*;
    import SystemArchitecture::*;
    import SystemBehavior::*;

    doc /*Analysis. Non-functional analysis and system properties. System analysis and quality attributes. */

    // Performance analysis
    analysis def PerformanceProfile {
        subject system : System;

        attribute hasCaching : Boolean = false;
        attribute hasRateLimiting : Boolean = false;
        attribute hasAsyncProcessing : Boolean = false;
        attribute hasConnectionPooling : Boolean = false;

        results {
            attribute expectedLatencyMs : Real;
            attribute expectedThroughput : Real;
        }
    }

    // Reliability analysis
    analysis def ReliabilityProfile {
        attribute hasRetries : Boolean = false;
        attribute hasCircuitBreaker : Boolean = false;
        attribute hasGracefulDegradation : Boolean = false;
        attribute hasHealthChecks : Boolean = false;

        results {
            attribute failureHandling : String;
            attribute recoveryStrategy : String;
        }
    }

    // Security analysis
    analysis def SecurityProfile {
        attribute authenticationMethod : String;
        attribute authorizationModel : String;
        attribute hasInputValidation : Boolean = false;
        attribute hasEncryption : Boolean = false;
        attribute hasRateLimiting : Boolean = false;

        results {
            attribute securityPosture : String;
        }
    }

    // Observability analysis
    analysis def ObservabilityProfile {
        attribute hasLogging : Boolean = false;
        attribute hasMetrics : Boolean = false;
        attribute hasTracing : Boolean = false;
        attribute hasAlerting : Boolean = false;
    }

    // Performance constraint definitions
    constraint def ResponseTimeConstraint {
        doc /*Response time must be within acceptable limit */
        in measured : Real;
        in limit : Real;
        measured <= limit
    }

    constraint def ThroughputConstraint {
        doc /*Throughput must meet minimum requirement */
        in actual : Real;
        in minimum : Real;
        actual >= minimum
    }

    constraint def AvailabilityConstraint {
        doc /*Availability must meet SLA */
        in uptime : Real;
        in target : Real;
        uptime >= target
    }

    // Allocation definitions for traceability
    package BehaviorAllocations {
        doc /*Maps behaviors to implementing modules */

        allocation def OperationToModule :> BehaviorToModule {
            doc /*Maps operations to their implementing modules */
        }
    }

    // Performance requirements
    package PerformanceConstraints {
        doc /*Performance constraints and assertions */
    }

    // Analysis instances (to be populated by analysis)
    package AnalysisResults {
        doc /*Concrete analysis results */
    }
}
