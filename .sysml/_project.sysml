package ProjectMetadata {
    import SysMLPrimitives::*;

    doc /*Project Metadata. Auto-discovered from package.json. Project: car-dealership-app */
    comment /* META: {
  "name": "car-dealership-app",
  "description": "",
  "version": "1.0.0",
  "projectType": "web-app",
  "primaryLanguage": "typescript",
  "secondaryLanguages": [
    "javascript"
  ],
  "runtime": "Node.js + TypeScript",
  "framework": "express + react",
  "architectureStyle": "monorepo",
  "entryPoints": [
    "apps/backend/src/server.ts",
    "apps/frontend/src/main.tsx",
    "packages/shared-types/src/index.ts"
  ],
  "externalDependencies": [
    {
      "name": "PostgreSQL",
      "version": "^8.11.0",
      "purpose": "Data persistence",
      "type": "database"
    },
    {
      "name": "HTTP Client",
      "purpose": "External API communication",
      "type": "api"
    }
  ],
  "ports": {
    "http": true
  },
  "discoveredAt": "2026-01-26T13:40:13.675Z",
  "manifestFile": "package.json"
} */

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
    attribute discoveredAt : DateTime = "2026-01-26T13:40:13.675Z";
}
