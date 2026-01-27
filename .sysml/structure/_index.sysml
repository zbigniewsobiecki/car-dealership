package SystemArchitecture {
    import SystemModules::*;
    import SystemInterfaces::*;
    import SysMLPrimitives::*;
    import SystemConnections::*;
    import SystemContext::*;
    doc /*System Architecture. Module structure and organization discovered from codebase analysis. */


    // Architecture style (to be set by analysis)
    attribute architectureStyle : String;

    // Base module definition - extends Part for standard library compatibility
    part def Module :> Part {
        doc /*Base module - aligns with Parts::Part */
        attribute path : FilePath;
        attribute responsibility : String;
        attribute layer : String [0..1];
    }

    // Service module with standard ports
    part def ServiceModule :> Module {
        doc /*Module that exposes a service interface */
        port api : ServicePort;
        port events : EventPort [0..1];
    }

    // Data module with database connectivity
    part def DataModule :> Module {
        doc /*Module that manages data persistence */
        port data : DataPort;
    }

    // Interface definitions for module contracts
    interface def ModuleInterface {
        doc /*Contract between module provider and consumer */
        end provider;
        end consumer;
    }

    interface def ServiceInterface {
        doc /*Service contract with typed endpoints */
        end server:ServicePort;
        end client:~ServicePort;
    }

    // Connection patterns
    connection def ModuleConnection {
        doc /*Standard connection between modules */
        end source;
        end target;
    }

    // System decomposition (to be populated by analysis)
    part def SystemDecomposition {
        doc /*System broken down into modules */
    }

    part decomposition : SystemDecomposition;

    part def FrontendModule :> Frontend {
        attribute layer : String = "frontend";
    }
}
