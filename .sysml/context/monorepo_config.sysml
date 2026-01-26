package MonorepoConfiguration {
    import SysMLPrimitives::*;

    @SourceFile {
        :>> path = "pnpm-workspace.yaml";
    }
    part def PnpmWorkspace :> Module {
        doc /* PNPM Monorepo workspace configuration defining package boundaries. */
        attribute appsPath : String = "apps/*";
        attribute packagesPath : String = "packages/*";
    }

    @SourceFile {
        :>> path = "packages/eslint-config/index.js";
    }
    part def EslintConfig :> Module {
        doc /* Shared ESLint configuration for the monorepo. */
        attribute parser : String = "@typescript-eslint/parser";
        attribute plugins : String [1..*];
        attribute extends : String [1..*];
        constraint def LintRules {
            doc /* Enforced linting constraints */
            attribute noUnusedVars : String = "error";
            attribute noExplicitAny : String = "warn";
        }
    }

    part workspace : PnpmWorkspace {
        :>> path = "pnpm-workspace.yaml";
    }

    part sharedLintConfig : EslintConfig {
        :>> path = "packages/eslint-config/index.js";
        :>> plugins = "['@typescript-eslint']";
        :>> extends = "['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier']";
    }
}
