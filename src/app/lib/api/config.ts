export const API_CONFIG = {
    BASE_URL: 'http://35.177.78.241:9000/api',
    ENDPOINTS: {
        PROJECTS: '/v1/structure/projects',
        ORGANIZATIONS: '/v1/structure/organizations',
        MODEL: '/v1/model',
        ACTION_PLAN: '/v1/action-plan'
    }
} as const;

export const AUTH_CONFIG = {
    TOKEN_COOKIE_NAME: 'andChange_auth_token',
    REFRESH_TOKEN_COOKIE_NAME: 'andChange_refresh_token',
    TOKEN_EXPIRY_DAYS: 7
} as const;