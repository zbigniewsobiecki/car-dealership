library package SysMLPrimitives {
    doc /*
     * AU SysML v2 Primitives for software project modeling.
     * Self-contained - no external dependencies required.
     * All model files should import SysMLPrimitives::* to access these types.
     */

    // ========== PRIMITIVE DATATYPES ==========
    // These can be used to type attributes: `attribute x : String;`
    datatype String;
    datatype Integer;
    datatype Real;
    datatype Boolean;
    datatype DateTime;
    datatype Duration;
    datatype Identifier;
    datatype URL;
    datatype FilePath;
    datatype JSON;

    // ========== BASE ITEM TYPES ==========
    // IMPORTANT: Use BaseEntity, BaseDTO, BaseDomainEvent - NOT Item directly

    abstract item def Item {
        doc /*Internal base - do NOT extend directly. Use BaseEntity, BaseDTO, etc. */
    }

    item def BaseEntity :> Item {
        doc /*Extend for domain entities: item def User :> BaseEntity { ... } */
        attribute id : Identifier;
        attribute createdAt : DateTime [0..1];
        attribute updatedAt : DateTime [0..1];
    }

    item def BaseDTO :> Item {
        doc /*Extend for DTOs: item def CreateUserRequest :> BaseDTO { ... } */
    }

    item def BaseDomainEvent :> Item {
        doc /*Extend for events: item def UserCreated :> BaseDomainEvent { ... } */
        attribute eventId : Identifier;
        attribute eventType : String;
        attribute timestamp : DateTime;
    }

    item def AnyItem :> Item {
        doc /*Concrete marker for polymorphic item fields.
             Use when a field can hold any item type (e.g., API response data).
             Example: item data : AnyItem [0..1]; */
    }

    // ========== BASE REQUIREMENT TYPE ==========
    requirement def BaseRequirement {
        doc /*Extend for requirements: requirement def FR001 :> BaseRequirement { ... } */
        attribute id : Identifier;
        attribute source : String [0..1];
        attribute priority : String [0..1];
    }

    // ========== BASE PART TYPES ==========
    abstract part def Part {
        doc /*Base for system components */
    }

    part def Module :> Part {
        doc /*Software module */
        attribute path : FilePath;
        attribute layer : String;
    }

    // ========== PORT TYPES ==========
    abstract port def Port {
        doc /*Base connection point */
    }

    port def DataPort :> Port {
        doc /*Data exchange port */
    }

    port def EventPort :> Port {
        doc /*Event emission port */
    }

    port def ServicePort :> Port {
        doc /*Service interface port */
    }

    // ========== CONNECTIONS ==========
    connection def DataFlow {
        end source;
        end target;
    }

    connection def ServiceBinding {
        end client;
        end server;
    }

    // ========== ALLOCATIONS ==========
    allocation def Implements {
        end requirement;
        end implementation;
    }

    allocation def BehaviorToModule {
        doc /*Maps behavior definitions to module implementations */
        end behavior;
        end module;
    }
    // ========== METADATA ==========
    // Usage: @SourceFile { :>> path = "package.json"; :>> line = 1; }
    // Or prefix: #SourceFile { :>> path = "package.json"; }
    metadata def SourceFile {
        attribute path : FilePath;
        attribute line : Integer [0..1];
    }

    // Stereotype markers - use with semicolon: @external; or prefix: #external
    metadata def external;
    metadata def internal;
    metadata def Deprecated;
    metadata def SecurityCritical;
    metadata def PerformanceCritical;
    metadata def Async;

    // ========== COMMON ENUMS ==========
    enum def LifecycleStatus {
        Draft;
        Active;
        Deprecated;
        Archived;
    }

    // ========== CONSTRAINT PATTERNS ==========
    constraint def NotNull {
        doc /*Value must not be null */
    }

    constraint def NotEmpty {
        doc /*String/collection must not be empty */
    }

    constraint def Positive {
        doc /*Number must be greater than zero */
    }

    constraint def NonNegative {
        doc /*Number must be greater than or equal to zero */
    }

    constraint def LatencyBound {
        doc /*Response time must be within limit */
        in measured : Real;
        in limit : Real;
        measured <= limit
    }

    constraint def ValidRange {
        doc /*Value must be within min/max bounds */
        in value : Real;
        in minVal : Real;
        in maxVal : Real;
        value >= minVal and value <= maxVal
    }

    // ========== APPLICATION COMPONENTS ==========
    abstract part def Application :> Part {
        doc /*Base for all application types */
        attribute name : String;
        attribute version : String [0..1];
    }

    part def WebApplication :> Application {
        doc /*Full-stack web application */
        part frontend : Frontend [0..1];
        part backend : Backend [0..1];
        part database [0..*];
    }

    part def Frontend :> Part {
        doc /*Client-side application (SPA, SSR, static) */
        attribute framework : String;
        attribute port : Integer [0..1];
        port api : ~HTTPPort;
    }

    part def Backend :> Part {
        doc /*Server-side application */
        attribute framework : String;
        attribute port : Integer [0..1];
        port api : HTTPPort;
        port db : ~DatabasePort;
    }

    part def APIServer :> Backend {
        doc /*REST/GraphQL API server */
        attribute basePath : String [0..1];
    }

    part def Worker :> Part {
        doc /*Background worker process */
        attribute queue : String [0..1];
        port tasks : ~MessagePort;
    }

    // ========== DATABASE & STORAGE ==========
    abstract part def Database :> Part {
        doc /*Base for all database types */
        attribute name : String [0..1];
        attribute purpose : String [0..1];
        attribute host : String [0..1];
        attribute port : Integer [0..1];
        attribute connectionString : String [0..1];
        port connection : DatabasePort;
    }

    part def PostgreSQL :> Database {
        doc /*PostgreSQL database */
    }

    part def MySQL :> Database {
        doc /*MySQL database */
    }

    part def MongoDB :> Database {
        doc /*MongoDB database */
    }

    part def Redis :> Part {
        doc /*Redis cache/store */
        attribute host : String [0..1];
        attribute port : Integer [0..1];
        port connection : CachePort;
    }

    part def S3Storage :> Part {
        doc /*S3-compatible object storage */
        attribute bucket : String;
        attribute region : String [0..1];
        port storage : StoragePort;
    }

    // ========== EXTERNAL INTEGRATIONS ==========
    abstract part def ExternalService :> Part {
        doc /*Third-party service integration */
        attribute provider : String;
        attribute apiKey : String [0..1];
    }

    part def AuthProvider :> ExternalService {
        doc /*Authentication provider (Auth0, Clerk, etc.) */
        port auth : AuthPort;
    }


    // ========== SERVICE PORTS ==========
    port def HTTPPort :> ServicePort {
        doc /*HTTP/REST API port */
        attribute basePath : String [0..1];
        attribute port : Integer [0..1];
        in item request : HTTPRequest [0..*];
        out item response : HTTPResponse [0..*];
    }

    port def WebSocketPort :> Port {
        doc /*WebSocket connection port */
        in item inMessage : Message [0..*];
        out item outMessage : Message [0..*];
    }

    port def DatabasePort :> Port {
        doc /*Database connection port */
        in item query : Query [0..*];
        out item result : QueryResult [0..*];
    }

    port def CachePort :> Port {
        doc /*Cache connection port */
        in item cacheKey [0..*];
        out item cacheValue [0..1];
    }

    port def MessagePort :> Port {
        doc /*Message queue port */
        in item inMessage : Message [0..*];
        out item acknowledgement [0..1];
    }

    port def AuthPort :> Port {
        doc /*Authentication port */
        in item credentials : Credentials;
        out item token : AuthToken [0..1];
    }

    port def StoragePort :> Port {
        doc /*File storage port */
        in item file : FileData;
        out item fileUrl [0..1];
    }

    // ========== API ITEM TYPES ==========
    item def HTTPRequest :> BaseDTO {
        doc /*HTTP request */
        attribute method : String;
        attribute path : String;
        attribute headers : JSON [0..1];
        attribute body : JSON [0..1];
    }

    item def HTTPResponse :> BaseDTO {
        doc /*HTTP response */
        attribute statusCode : Integer;
        attribute headers : JSON [0..1];
        attribute body : JSON [0..1];
    }

    item def Message :> Item {
        doc /*Generic message */
        attribute payload : JSON;
        attribute timestamp : DateTime;
    }

    item def Query :> Item {
        doc /*Database query */
        attribute sql : String [0..1];
        attribute params : JSON [0..1];
    }

    item def QueryResult :> Item {
        doc /*Database query result */
        attribute rows : JSON;
        attribute rowCount : Integer;
    }

    item def Credentials :> BaseDTO {
        doc /*Authentication credentials */
        attribute email : String [0..1];
        attribute password : String [0..1];
        attribute token : String [0..1];
    }

    item def AuthToken :> BaseDTO {
        doc /*Authentication token */
        attribute accessToken : String;
        attribute refreshToken : String [0..1];
        attribute expiresAt : DateTime [0..1];
    }

    item def FileData :> BaseDTO {
        doc /*File data for storage */
        attribute name : String;
        attribute contentType : String [0..1];
        attribute size : Integer [0..1];
    }

    // ========== CONNECTION DEFINITIONS ==========
    connection def APIConnection :> ServiceBinding {
        doc /*Frontend to Backend API connection */
        end client:~HTTPPort;
        end server:HTTPPort;
    }

    connection def DatabaseConnection {
        doc /*Application to Database connection */
        end app:~DatabasePort;
        end db:DatabasePort;
    }

    connection def CacheConnection {
        doc /*Application to Cache connection */
        end app:~CachePort;
        end cache:CachePort;
    }
}
