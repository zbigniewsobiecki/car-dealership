package SystemArchitecture {
    import SystemModules::*;
    import SystemInterfaces::*;
    import SysMLPrimitives::*;
    import SystemConnections::*;
    import SystemContext::*;
    doc /*System Architecture. Module structure and organization discovered from codebase analysis. */


    attribute architectureStyle : String = "monorepo";

    part def Module :> Part {
        doc /* Base module - aligns with Parts::Part */
        attribute path : FilePath;
        attribute responsibility : String;
        attribute layer : String [0..1];
    }

    part def UIComponent :> Module {
        doc /* Base for React components */
        :>> layer = "presentation";
    }

    interface def ModuleInterface {
        doc /*Contract between module provider and consumer */
        attribute name : String;
        attribute methods : String [0..*];
    }
}
