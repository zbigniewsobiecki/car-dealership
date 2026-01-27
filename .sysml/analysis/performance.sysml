package PerformanceAnalysis {
    import SysMLPrimitives::*;
    import SystemArchitecture::*;
    
    doc /*Performance characteristics and patterns discovered in the backend configuration. */
    
    analysis def PerformanceProfile {
        subject system : System;
    
        // Discovered patterns
        attribute hasCaching : Boolean = false;
        attribute cacheProvider : String = "none";
    
        attribute hasRateLimiting : Boolean = true;
        attribute rateLimitStrategy : String = "fixed-window"; // express-rate-limit default
    
        attribute hasAsyncProcessing : Boolean = false;
        
        attribute hasConnectionPooling : Boolean = true;
        attribute pooledConnections : String = "PostgreSQL (pg Pool)";
    
        results {
            attribute maxConnections : Integer = 20;
            attribute idleTimeoutMs : Integer = 30000;
            attribute rateLimitMaxRequests : Integer = 100;
            attribute rateLimitWindowMs : Integer = 900000; // 15 minutes
        }
    }
    
    @SourceFile { :>> path = "apps/backend/src/config/database.ts"; }
    analysis def DatabasePoolingAnalysis {
        doc /* Analysis of PostgreSQL connection pooling configuration. */
        attribute poolSize : Integer = 20;
        attribute connectionTimeoutMs : Integer = 2000;
        attribute idleTimeoutMs : Integer = 30000;
    }
    
    @SourceFile { :>> path = "apps/backend/src/app.ts"; }
    analysis def RateLimitingAnalysis {
        doc /* Analysis of API rate limiting using express-rate-limit. */
        attribute windowMs : Integer = 900000;
        attribute maxRequests : Integer = 100;
    }
}
