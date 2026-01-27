package SharedTypesConfig {
    import SysMLPrimitives::*;

    @SourceFile {
        :>> path = "packages/shared-types/package.json";
    }
    part sharedTypesModule : Module {
        doc /* 
     * Shared types package providing common TypeScript definitions 
     * across the monorepo.
     */
        :>> name = "@car-dealership/shared-types";
        :>> path = "packages/shared-types";
        attribute version : String = "1.0.0";
        attribute isPrivate : Boolean = true;
        attribute mainEntry : FilePath = "./src/index.ts";
        attribute typesEntry : FilePath = "./src/index.ts";
    }
}
