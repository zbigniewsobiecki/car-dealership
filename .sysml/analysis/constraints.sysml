package PerformanceConstraints {
    import SysMLPrimitives::*;
    import SystemArchitecture::*;


    constraint def ResponseTimeLimit {
        doc /*API response must be within limit */
        in actual : Real;
        in limit : Real = 200;
        actual <= limit
    }

    constraint def ThroughputMinimum {
        doc /*System must handle minimum requests per second */
        in actual : Real;
        in minimum : Real = 100;
        actual >= minimum
    }

    constraint def AvailabilityTarget {
        doc /*System uptime must meet SLA */
        in uptime : Real;
        in target : Real = 99.9;
        uptime >= target
    }
}
