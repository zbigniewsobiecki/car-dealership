package PerformanceConstraints {
    import SysMLPrimitives::*;
    import SystemArchitecture::*;
    
    doc /*Performance constraints with expressions based on configuration. */
    
    constraint def ResponseTimeLimit {
        doc /*API response must be within limit. */
        in actual : Real;
        in limit : Real = 500.0;
        actual <= limit
    }
    
    constraint def DatabaseConnectionLimit {
        doc /*Database pool must not exceed max connections. */
        in current : Integer;
        in max : Integer = 20;
        current <= max
    }
    
    constraint def RateLimitConstraint {
        doc /*Requests per window must be within limit. */
        in requests : Integer;
        in limit : Integer = 100;
        requests <= limit
    }
}
