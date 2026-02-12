package ProjectMetadata {
    import SysMLPrimitives::*;
    doc /*Project Metadata. Auto-discovered from package.json. Project: car-dealership-app */


    // Project identification
    attribute projectName : String = "car-dealership-app";
    attribute projectVersion : String = "1.0.0";
    attribute projectDescription : String = "";

    // Technology stack
    attribute projectType : String = "web-app";
    attribute primaryLanguage : String = "typescript";
    attribute runtime : String = "Node.js + TypeScript";
    attribute framework : String = "express + react";

    // Architecture
    attribute architectureStyle : String = "monorepo";

    // Discovery timestamp
    attribute discoveredAt : DateTime = "2026-02-03T12:57:23.766Z";
}
