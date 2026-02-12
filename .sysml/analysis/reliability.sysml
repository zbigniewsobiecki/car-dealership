package ReliabilityAnalysis {
        import SysMLPrimitives::*;
    
        doc /*Reliability patterns and error handling strategies. */
    
        analysis def ReliabilityProfile {
            // Retry patterns
            attribute hasRetries : Boolean = false;
            
            // Circuit breaker
            attribute hasCircuitBreaker : Boolean = false;
    
            // Graceful degradation
            attribute hasGracefulDegradation : Boolean = true;
            attribute fallbackStrategies : String = "Graceful shutdown on SIGTERM/SIGINT";
    
            // Health checks
            attribute hasHealthChecks : Boolean = true;
            attribute healthEndpoints : String = "/health";
    
            // Timeouts
            attribute hasTimeouts : Boolean = true;
            attribute defaultTimeoutMs : Integer = 30000; // DB idle timeout
    
            results {
                attribute failureHandling : String = "Centralized Express error middleware";
                attribute recoveryStrategy : String = "Process restart via host/orchestrator";
            }
        }
    
        @SourceFile { :>> path = "apps/backend/src/middleware/errorHandler.middleware.ts"; }
        analysis def ErrorHandlingAnalysis {
            attribute globalErrorHandler : Boolean = true;
            attribute distinguishesOperationalErrors : Boolean = true;
            attribute errorLogging : Boolean = true;
    
            results {
                attribute errorRecoveryNotes : String = "Operational errors returned as JSON; unexpected errors logged and return 500";
            }
        }
}
