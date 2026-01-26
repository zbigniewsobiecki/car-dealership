package EventHandlers {
    import DataTransferObjects::*;

    @SourceFile {
        :>> path = "apps/backend/src/middleware/auth.middleware.ts";
    }
    action def AuthenticateToken {
        flow from token to verifyJwt.t;
        flow from verifyJwt.payload to setContext.p;
        flow from setContext.ctx to userContext;
        first verifyJwt then setContext;
        in token : String;
        out userContext : JSON;
        out error : ApiError [0..1];

        action verifyJwt {
            in t : String;
            out payload : JSON;
        }
        action setContext {
            in p : JSON;
            out ctx : JSON;
        }
    }
    @SourceFile {
        :>> path = "apps/frontend/src/services/api.ts";
    }
    action def ApiRequestInterceptor {
        flow from request to attachHeader.req;
        flow from getToken.token to attachHeader.token;
        flow from attachHeader.newReq to interceptedRequest;
        first getToken then attachHeader;
        in request : JSON;
        out interceptedRequest : JSON;

        action getToken {
            out token : String [0..1];
        }
        action attachHeader {
            in req : JSON;
            in token : String;
            out newReq : JSON;
        }
    }



    @SourceFile {
        :>> path = "apps/frontend/src/services/api.ts";
    }
    action def ApiResponseInterceptor {
        flow from error to handle401.err;
        first handle401 then refreshToken;
        in response : JSON;
        in error : JSON [0..1];
        out result : JSON;

        action handle401 {
            in err : JSON;
            out retry : Boolean;
        }
        action refreshToken {
            out newToken : String;
        }
    }
}
