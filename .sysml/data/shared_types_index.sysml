package SharedTypesBarrel {
    import SysMLPrimitives::*;
    
    @SourceFile { :>> path = "packages/shared-types/src/index.ts"; }
    package SharedTypesIndex {
        doc /* 
         * Central export point for shared domain types, enums, and API DTOs.
         * Re-exports types from enums, entities, and api subdirectories.
         */
    }
}
