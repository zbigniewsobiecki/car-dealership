package SystemBehavior {
    import BackendUtilities::*;
    import BackendServices::*;
    import SystemOperations::*;
    import FrontendHooks::*;
    import EntityStateMachines::*;
    import SysMLPrimitives::*;
    import EventHandlers::*;
    import DataModel::*;
    import SystemArchitecture::*;
    doc /*System Behavior. Operations, state machines, and event handlers. Behavioral aspects of the system. */


    // State machine template with transitions
    state def EntityLifecycle {
        doc /*Template for entity state machines */
        entry ;
        transition first entry then Initial;
        transition first Initial then Processing;
        transition first Processing then Completed;
        transition first Processing then Error;

        state Initial;
        state Processing;
        state Completed;
        state Error;
    }


    // Operation template with flow pattern
    action def Operation {
        doc /*Template for system operations with data flow */
        flow from input to validate;
        flow from validate.validated to process.data;
        flow from process.result to respond.result;
        flow from respond to output;
        first validate then process;
        first process then respond;

        in input;
        out output;
        out error [0..1];

        action validate {
            out validated;
        }
        action process {
            in data;
            out result;
        }
        action respond {
            in result;
        }

        // Data flows between steps

        // Control flow sequencing
    }

    // Event handler template
    action def EventHandler {
        doc /*Template for event-driven operations */
        flow from event to handle.eventData;
        flow from handle.result to notify.result;
        first handle then notify;

        in event;

        action handle {
            in eventData;
            out result;
        }
        action notify {
            in result;
        }
    }


    // Operations (to be populated by analysis)
    package Operations {
        doc /*System operations discovered from handlers/controllers */
    }

    // State machines (to be populated by analysis)
    package StateMachines {
        doc /*State machines discovered from code patterns */
    }

    // Event handlers (to be populated by analysis)
    package EventHandlers {
        doc /*Event handlers discovered from code */
    }

    // System-level operations with data flows
    package SystemOperations {
        import SysMLPrimitives::*;
        import DataModel::*;
        doc /*System operations/actions with data flows */
    }

    // Service-level behavioral definitions
    package ServiceBehaviors {
        import SysMLPrimitives::*;
        import SystemArchitecture::*;
        doc /*Service-level behavioral definitions */
    }

    // Entity lifecycle state machines
    package EntityStateMachines {
        import SysMLPrimitives::*;
        import DataModel::*;
        doc /*Entity lifecycle state machines */
    }

    // Domain event definitions
    package DomainEvents {
        import SysMLPrimitives::*;
        import DataModel::*;
        doc /*Domain event definitions */
    }
}
