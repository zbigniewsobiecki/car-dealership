package ObservabilityAnalysis {
    import SysMLPrimitives::*;
    
    doc /*Observability and monitoring patterns discovered in the application setup. */
    
    analysis def ObservabilityProfile {
        // Logging
        attribute hasStructuredLogging : Boolean = true;
        attribute loggingLibrary : String = "morgan";
        attribute logLevels : String = "dev/combined";
    
        // Metrics
        attribute hasMetrics : Boolean = false;
    
        // Tracing
        attribute hasDistributedTracing : Boolean = false;
    
        // Alerting
        attribute hasAlerting : Boolean = false;
    
        results {
            attribute hasHealthCheck : Boolean = true;
            attribute healthEndpoint : String = "/health";
        }
    }
    
    @SourceFile { :>> path = "apps/backend/src/app.ts"; }
    analysis def LoggingAnalysis {
        doc /* Analysis of HTTP request logging. */
        attribute developmentFormat : String = "dev";
        attribute productionFormat : String = "combined";
    }
}
