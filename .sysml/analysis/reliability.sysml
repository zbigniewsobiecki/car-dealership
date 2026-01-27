package ReliabilityAnalysis {
    import SysMLPrimitives::*;
    
    doc /*Reliability patterns and error handling discovered in the backend. */
    
    analysis def ReliabilityProfile {
        // Retry patterns
        attribute hasRetries : Boolean = false;
    
        // Circuit breaker
        attribute hasCircuitBreaker : Boolean = false;
    
        // Graceful degradation
        attribute hasGracefulDegradation : Boolean = true;
        attribute fallbackStrategies : String = "Global Error Handler (AppError)";
    
        // Health checks
        attribute hasHealthChecks : Boolean = true;
        attribute healthEndpoints : String = "/health";
    
        // Timeouts
        attribute hasTimeouts : Boolean = true;
        attribute defaultTimeoutMs : Integer = 30000; // Database idle timeout
    
        results {
            attribute failureHandling : String = "Centralized middleware with status codes";
            attribute recoveryStrategy : String = "Process exit on critical DB error; SIGTERM/SIGINT handling";
        }
    }
    
    @SourceFile { :>> path = "apps/backend/src/middleware/errorHandler.middleware.ts"; }
    analysis def ErrorHandlingAnalysis {
        doc /* Analysis of the centralized error handling mechanism. */
        attribute globalErrorHandler : Boolean = true;
        attribute errorLogging : Boolean = true;
        attribute customErrorClass : String = "AppError";
    }
    
    @SourceFile { :>> path = "apps/backend/src/server.ts"; }
    analysis def ShutdownAnalysis {
        doc /* Analysis of graceful shutdown procedures. */
        attribute handlesSigterm : Boolean = true;
        attribute handlesSigint : Boolean = true;
    }
}
