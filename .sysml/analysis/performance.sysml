package PerformanceAnalysis {
    import SysMLPrimitives::*;
    import SystemArchitecture::*;


    @SourceFile {
        :>> path = "apps/backend/src/app.ts";
    }
    @SourceFile {
        :>> path = "apps/backend/src/config/database.ts";
    }
    analysis def PerformanceProfile {
        subject system : System;

        // Discovered patterns

        // Discovered patterns
        attribute hasCaching : Boolean = false;
        attribute cacheProvider : String = "none";

        attribute hasRateLimiting : Boolean = true;
        attribute rateLimitStrategy : String = "fixed-window";
        // express-rate-limit default

        attribute hasAsyncProcessing : Boolean = false;
        attribute asyncMechanism : String = "none";

        attribute hasConnectionPooling : Boolean = true;
        attribute pooledConnections : String [1] = "PostgreSQL (pg Pool)";

        attribute hasCompression : Boolean = false;
        attribute hasCDN : Boolean = false;

        results {
            attribute estimatedLatencyMs : Real;
            attribute estimatedThroughput : Real;
            attribute scalabilityNotes : String;
        }
    }

    analysis def CachingAnalysis {
        attribute cacheLocations : String [0..*];
        attribute cacheStrategies : String [0..*];
        attribute ttlPatterns : String [0..*];

        results {
            attribute cacheHitRatioEstimate : Real;
        }
    }
}
