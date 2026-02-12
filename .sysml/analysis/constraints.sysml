package PerformanceConstraints {
        import SysMLPrimitives::*;
    
        doc /*Performance constraints with expressions. */
    
        constraint def ResponseTimeLimit {
            in actual : Real;
            in limit : Real = 500.0;
            actual <= limit
        }
    
        constraint def DatabaseConnectionLimit {
            in current : Integer;
            in max : Integer = 20;
            current <= max
        }
    
        constraint def FileUploadLimit {
            in size : Integer;
            in max : Integer = 5242880; // 5MB
            size <= max
        }
}
