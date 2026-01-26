package car_dealership_appModel {
    doc /*car-dealership-app - SysML v2 Model. Master index file importing all model packages. Generated: 2026-01-26T13:47:03.539Z. */

    // Import all model packages by their package names
    import Analysis::*;
    import DataModel::*;
    import DataTransferObjects::*;
    import DomainEntities::*;
    import DomainEnums::*;
    import EntityStateMachines::*;
    import ProjectMetadata::*;
    import SystemArchitecture::*;
    import SystemBehavior::*;
    import SystemConnections::*;
    import SystemContext::*;
    import SystemInterfaces::*;
    import SystemModules::*;
    import SystemOperations::*;
    import SystemRequirements::*;
    import Verification::*;

    // Re-export key packages for convenience
    alias QualityAnalysis for Analysis;
    alias Data for DataModel;
    alias Architecture for SystemArchitecture;
    alias Behavior for SystemBehavior;
    alias Context for SystemContext;
    alias Requirements for SystemRequirements;
    alias Tests for Verification;
}
