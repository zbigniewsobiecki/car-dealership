package ConfigCoverage {
    import SysMLPrimitives::*;

    @SourceFile {
        :>> path = "apps/backend/src/config/env.ts";
    }
    part def EnvironmentConfig :> Module {
        attribute nodeEnv : String;
        attribute port : Integer;
        part dbConfig {
            attribute host : String;
            attribute port : Integer;
            attribute name : String;
            attribute user : String;
        }
        part jwtConfig {
            attribute secret : String;
            attribute expiresIn : String;
            attribute refreshSecret : String;
            attribute refreshExpiresIn : String;
        }
        part uploadConfig {
            attribute maxFileSize : Integer;
            attribute uploadDir : FilePath;
        }
        part corsConfig {
            attribute origin : String;
        }
    }

    @SourceFile {
        :>> path = "apps/backend/src/config/jwt.ts";
    }
    part def JwtConfiguration :> Module {
        doc /* Specialized JWT configuration derived from environment variables. */
        attribute secret : String;
        attribute expiresIn : String;
        attribute refreshSecret : String;
        attribute refreshExpiresIn : String;
    }
    @SourceFile {
        :>> path = "packages/eslint-config/index.js";
    }
    part def EslintConfigModule :> Module {
        doc /* Shared ESLint configuration for the monorepo. */
        attribute parser : String = "@typescript-eslint/parser";
        attribute plugins : String [1..*];
        attribute extends : String [1..*];
    }

    @SourceFile {
        :>> path = "packages/typescript-config/package.json";
    }
    part def TypescriptConfigPackage :> Module {
        doc /* Monorepo package for shared TypeScript configurations. */
        :>> name = "@car-dealership/typescript-config";
    }

    @SourceFile {
        :>> path = "packages/typescript-config/base.json";
    }
    part def TsBaseConfig :> Module {
        doc /* Base TypeScript compiler options. */
        attribute target : String = "ES2020";
        attribute module : String = "ESNext";
        attribute strict : Boolean = true;
    }

    @SourceFile {
        :>> path = "packages/typescript-config/node.json";
    }
    part def TsNodeConfig :> TsBaseConfig {
        doc /* Node.js specific TypeScript configuration. */
        :>> path = "packages/typescript-config/node.json";
    }

    @SourceFile {
        :>> path = "packages/typescript-config/react.json";
    }
    part def TsReactConfig :> TsBaseConfig {
        doc /* React specific TypeScript configuration. */
        attribute jsx : String = "react-jsx";
    }
}
