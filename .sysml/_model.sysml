package car_dealership_appModel {
    doc /*car-dealership-app - SysML v2 Model. Master index file importing all model packages. Generated: 2026-01-27T11:34:29.575Z. */

    // Import all model packages by their package names
    import APIEndpoints::*;
    import AccessControlAnalysis::*;
    import Analysis::*;
    import BehaviorAllocations::*;
    import ComponentTests::*;
    import ConfigCoverage::*;
    import CoverageAnalysis::*;
    import CustomerOperations::*;
    import DataConstraints::*;
    import DataModel::*;
    import DataTransferObjects::*;
    import DatabaseModels::*;
    import DomainEntities::*;
    import DomainEnums::*;
    import EntityStateMachines::*;
    import ObservabilityAnalysis::*;
    import PerformanceAnalysis::*;
    import PerformanceConstraints::*;
    import ProjectMetadata::*;
    import ReliabilityAnalysis::*;
    import SecurityAnalysis::*;
    import SharedTypesConfig::*;
    import SystemArchitecture::*;
    import SystemBehavior::*;
    import SystemConnections::*;
    import SystemContext::*;
    import SystemInterfaces::*;
    import SystemModules::*;
    import SystemOperations::*;
    import SystemRequirements::*;
    import TestMappings::*;
    import VehicleOperations::*;
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
