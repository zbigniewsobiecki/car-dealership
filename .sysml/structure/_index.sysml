package SystemArchitecture {
    import SystemModules::*;
    import SysMLPrimitives::*;
    import SystemInterfaces::*;
    import SystemContext::*;
    import SystemConnections::*;
    doc /*System Architecture. Module structure and organization discovered from codebase analysis. */
    attribute architectureStyle : String = "monorepo";
    part def Module :> Part {
        doc /* Base module - aligns with Parts::Part */
        attribute path : FilePath;
        attribute responsibility : String;
        attribute layer : String [0..1];
    }
    part def ServiceModule :> Module {
        doc /* Backend service module */
    }

    part def UIModule :> Module {
        doc /* Frontend UI component or page */
    }
}
