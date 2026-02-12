package DataConstraints {
    import SysMLPrimitives::*;

    @SourceFile {
        :>> path = "apps/backend/src/models/Vehicle.model.ts";
    }
    constraint def VinUniqueness :> UniqueConstraint {
        doc /* Vehicle VIN must be unique across the inventory. */
    }

    @SourceFile {
        :>> path = "apps/backend/src/models/User.model.ts";
    }
    constraint def EmailUniqueness :> UniqueConstraint {
        doc /* User email must be unique for authentication. */
    }

    @SourceFile {
        :>> path = "packages/shared-types/src/entities/vehicle.types.ts";
    }
    constraint def VinFormat :> PatternConstraint {
        doc /* Standard VIN format validation. */
         :>> pattern = "^[A-HJ-NPR-Z0-9]{17}$";
    }

    @SourceFile {
        :>> path = "apps/backend/src/models/Sale.model.ts";
    }
    constraint def SalePriceNonNegative :> NonNegative {
        doc /* Sale price must be zero or greater. */
    }

    @SourceFile {
        :>> path = "apps/backend/src/models/Vehicle.model.ts";
    }
    constraint def VehicleYearRange :> ValidRange {
        doc /* Vehicle year must be within a reasonable range. */
         :>> minVal = 1900.0;
         :>> maxVal = 2100.0;
    }

    @SourceFile {
        :>> path = "apps/backend/src/models/db.ts";
    }
    constraint def DatabaseConnectionRequired :> RequiredConstraint {
        doc /* Database queries require an active pool connection. */
    }
}
