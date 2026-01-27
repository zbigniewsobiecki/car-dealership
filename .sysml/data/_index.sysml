package DataModel {
    import SysMLPrimitives::*;

    doc /*Data Model. Domain entities, data transfer objects, and enumerations. Data structures discovered from type definitions and schemas. */

    // Base entity with common attributes - extends Item for standard library compatibility
    item def BaseEntity :> Item {
        doc /*Common base for domain entities. Aligns with Items::Item. */
        attribute id : Identifier;
        attribute createdAt : DateTime;
        attribute updatedAt : DateTime;
    }

    // Base DTO for API transfers - extends Item
    item def BaseDTO :> Item {
        doc /*Common base for data transfer objects. Aligns with Items::Item. */
    }

    // Base event for domain events - extends Item
    item def BaseDomainEvent :> Item {
        doc /*Common base for domain events. Aligns with Items::Item. */
        attribute eventId : Identifier;
        attribute timestamp : DateTime;
        attribute eventType : String;
    }

    // Relationship template for entity connections
    connection def EntityRelation {
        doc /*Template for entity relationships */
        end source [1];
        end target [0..*];
    }

    // Entity definitions (to be populated by analysis)
    package Entities {
        import DataModel::*;

        // Stub - attributes populated in Cycle 3
        item def User :> BaseEntity {
            doc /* User domain entity */
        }

        item def CreateUserDto :> BaseDTO {
            doc /* Request DTO for creating a User */
        }

        item def UpdateUserDto :> BaseDTO {
            doc /* Request DTO for updating a User */
        }

        // Stub - attributes populated in Cycle 3
        item def Customer :> BaseEntity {
            doc /* Customer domain entity */
        }

        item def CreateCustomerDto :> BaseDTO {
            doc /* Request DTO for creating a Customer */
        }

        item def UpdateCustomerDto :> BaseDTO {
            doc /* Request DTO for updating a Customer */
        }

        // Stub - attributes populated in Cycle 3
        item def Vehicle :> BaseEntity {
            doc /* Vehicle domain entity */
        }

        item def CreateVehicleDto :> BaseDTO {
            doc /* Request DTO for creating a Vehicle */
        }

        item def UpdateVehicleDto :> BaseDTO {
            doc /* Request DTO for updating a Vehicle */
        }

        // Stub - attributes populated in Cycle 3
        item def Sale :> BaseEntity {
            doc /* Sale domain entity */
        }

        item def CreateSaleDto :> BaseDTO {
            doc /* Request DTO for creating a Sale */
        }

        item def UpdateSaleDto :> BaseDTO {
            doc /* Request DTO for updating a Sale */
        }
    }

    // Data transfer objects (to be populated by analysis)
    package DTOs {
        import DataModel::*;

        // Authentication types - stub for Cycle 2 ports
        item def LoginRequest :> BaseDTO {
            doc /* Login credentials */
        }

        item def AuthResponse :> BaseDTO {
            doc /* Authentication response with token */
        }

        item def TokenPayload :> BaseDTO {
            doc /* JWT token payload */
        }
    }

    // Events (to be populated by analysis)
    package Events {
        doc /*Domain events - specialize from BaseDomainEvent */
    }

    // Enumerations (to be populated by analysis)
    package Enums {
        doc /*Enumeration types */
    }
}
