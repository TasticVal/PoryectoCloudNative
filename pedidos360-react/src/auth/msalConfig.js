import {
    PublicClientApplication,
    BrowserCacheLocation,
} from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: "020d2511-49b6-4b9c-bc9a-6e74ef292434",
        authority:
            "https://login.microsoftonline.com/6f3f02b8-6fe2-4022-bfd3-ddaf1ac7960c",
        redirectUri: "http://localhost:4200",
        postLogoutRedirectUri: "http://localhost:4200",
    },

    cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: false,
    },
};

export const loginRequest = {
    scopes: [
        "api://6c0ce39d-b8ac-4714-a6cc-e9cd674adebe/access_as_user",
    ],
};

export const msalInstance = new PublicClientApplication(msalConfig);