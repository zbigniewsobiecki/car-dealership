package ReliabilityAnalysis {
    import SysMLPrimitives::*;


    @SourceFile {
        :>> path = "apps/backend/src/app.ts";
    }
    @SourceFile {
        :>> path = "apps/backend/src/config/database.ts";
    }
    analysis def ReliabilityProfile {
        // Retry patterns
        attribute hasRetries : Boolean = false;
        attribute retryStrategy : String = "none";
        attribute maxRetries : Integer [0..1];

        // Circuit breaker
        attribute hasCircuitBreaker : Boolean = false;
        attribute circuitBreakerThreshold : Integer [0..1];

        // Graceful degradation
        attribute hasGracefulDegradation : Boolean = false;
        attribute fallbackStrategies : String [0..*];

        // Health checks
        attribute hasHealthChecks : Boolean = true;
        attribute healthEndpoints : String [1] = "/health";

        // Timeouts
        attribute hasTimeouts : Boolean = true;
        attribute defaultTimeoutMs : Integer = 30000;
        // idleTimeoutMillis

        results {
            attribute failureHandling : String;
            attribute recoveryStrategy : String;
            attribute estimatedAvailability : String;
        }
    }

    analysis def ErrorHandlingAnalysis {
        attribute errorBoundaries : String [0..*];
        attribute globalErrorHandler : Boolean = true;
        attribute errorLogging : Boolean = true;
        attribute errorReporting : String [0..1];

        results {
            attribute errorRecoveryNotes : String;
        }
    }
}
