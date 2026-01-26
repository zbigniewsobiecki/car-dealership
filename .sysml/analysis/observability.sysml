package ObservabilityAnalysis {
    import SysMLPrimitives::*;


    @SourceFile {
        :>> path = "apps/backend/src/app.ts";
    }
    @SourceFile {
        :>> path = "apps/backend/src/config/env.ts";
    }
    analysis def ObservabilityProfile {
        // Logging
        attribute hasStructuredLogging : Boolean = true;
        attribute loggingLibrary : String = "morgan";
        attribute logLevels : String [2] = "dev, combined";
        attribute logDestinations : String [1] = "stdout";

        // Metrics
        attribute hasMetrics : Boolean = false;
        attribute metricsLibrary : String [0..1];
        attribute metricsExporter : String [0..1];
        attribute customMetrics : String [0..*];

        // Tracing
        attribute hasDistributedTracing : Boolean = false;
        attribute tracingLibrary : String [0..1];
        attribute tracingBackend : String [0..1];

        // Alerting
        attribute hasAlerting : Boolean = false;
        attribute alertingPlatform : String [0..1];

        results {
            attribute observabilityMaturity : String;
            attribute monitoringGaps : String [0..*];
        }
    }
}
