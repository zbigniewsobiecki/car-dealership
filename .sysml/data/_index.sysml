package DataModel {
    import SharedTypesBarrel::*;
    import SysMLPrimitives::*;
    import DomainEntities::*;
    doc /*Data Model. Domain entities, data transfer objects, and enumerations. Data structures discovered from type definitions and schemas. */
    import DomainEnums::*;
    import DataTransferObjects::*;
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
        end [1] source;
        end [0..*] target;
    }
    // Entity definitions
    package Entities {
        import DataModel::*;
        import DomainEntities::*;
        item def User :> DomainEntities::User {
            doc /* User domain entity reference */
        }
        item def Customer :> DomainEntities::Customer {
            doc /* Customer domain entity reference */
        }
        item def Vehicle :> DomainEntities::Vehicle {
            doc /* Vehicle domain entity reference */
        }
        item def Sale :> DomainEntities::Sale {
            doc /* Sale domain entity reference */
        }
        item def VehicleImage :> DomainEntities::VehicleImage {
            doc /* VehicleImage domain entity reference */
        }
    }
    // Data transfer objects
    package DTOs {
        import DataModel::*;
        import DomainEntities::*;
        import DomainEnums::*;
        import DataTransferObjects::*;
        item def LoginRequest :> DataTransferObjects::LoginRequest;
        item def AuthResponse :> DataTransferObjects::AuthResponse;
        item def CreateCustomerDto :> DataTransferObjects::CreateCustomerDto;
        item def CreateSaleDto :> DataTransferObjects::CreateSaleDto;
        item def CreateVehicleDto :> DataTransferObjects::CreateVehicleDto;
        item def UpdateVehicleDto :> DataTransferObjects::UpdateVehicleDto;
        item def UpdateCustomerDto :> DataTransferObjects::UpdateCustomerDto;
        item def UpdateSaleDto :> DataTransferObjects::UpdateSaleDto;
    }
    // Enumerations
    package Enums {
        import DataModel::*;
        import DomainEnums::*;
        item def UserRole :> DomainEnums::UserRole;
        item def VehicleStatus :> DomainEnums::VehicleStatus;
        item def VehicleCondition :> DomainEnums::VehicleCondition;
        item def SaleStatus :> DomainEnums::SaleStatus;
    }
}
