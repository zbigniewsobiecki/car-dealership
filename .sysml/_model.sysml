package car_dealership_appModel {
    doc /*car-dealership-app - SysML v2 Model. Master index file importing all model packages. Generated: 2026-01-26T20:03:49.804Z. */

    // Import all model packages by their package names
    import Analysis::*;
    import BackendConfigsAnalysis::*;
    import BackendServices::*;
    import BackendUtilities::*;
    import BehaviorAllocations::*;
    import CoverageAnalysis::*;
    import DataModel::*;
    import DataTransferObjects::*;
    import DatabaseOperations::*;
    import DomainEntities::*;
    import DomainEnums::*;
    import EntityStateMachines::*;
    import EventHandlers::*;
    import FrontendHooks::*;
    import FrontendServices::*;
    import MonorepoConfiguration::*;
    import ObservabilityAnalysis::*;
    import PerformanceAnalysis::*;
    import PerformanceConstraints::*;
    import ProjectMetadata::*;
    import ReliabilityAnalysis::*;
    import SecurityAnalysis::*;
    import SharedTypesBarrel::*;
    import SystemArchitecture::*;
    import SystemBehavior::*;
    import SystemConnections::*;
    import SystemContext::*;
    import SystemInterfaces::*;
    import SystemModules::*;
    import SystemOperations::*;
    import SystemRequirements::*;
    import TestCoverage::*;
    import TestMappings::*;
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
