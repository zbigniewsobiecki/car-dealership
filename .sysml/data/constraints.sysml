package DataConstraints {
    import SysMLPrimitives::*;

    @SourceFile {
        :>> path = "apps/backend/src/models/Vehicle.model.ts";
    }
    constraint def VinUniqueness :> UniqueConstraint {
        doc /* Vehicle VIN must be unique. Enforced by findByVin check in service/db. */
    }

    @SourceFile {
        :>> path = "apps/backend/src/models/User.model.ts";
    }
    constraint def EmailUniqueness :> UniqueConstraint {
        doc /* User email must be unique. Enforced by findByEmail check. */
    }

    @SourceFile {
        :>> path = "apps/backend/src/models/Vehicle.model.ts";
    }
    constraint def VinFormat :> PatternConstraint {
        doc /* Standard 17-character VIN format. */
         :>> pattern = "^[A-HJ-NPR-Z0-9]{17}$";
    }
}
