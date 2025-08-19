import { decrypt } from "@teleperformance/tpco_cryptojs";

const getFrontendConfig = () => {
    try {
        const encryptedConfig = import.meta.env.VITE_FRONTEND;
        if (!encryptedConfig) {
            throw new Error('VITE_FRONTEND no está configurado');
        }
        
        const decryptedConfig = decrypt(encryptedConfig);
        return JSON.parse(decryptedConfig);
    } catch (error) {
        console.error('Error al desencriptar configuración frontend EVA:', error);
        throw new Error('No se pudo cargar la configuración de autenticación de EVA');
    }
};

export const getMsalConfig = () => {
    const config = getFrontendConfig();
    
    return {
        auth: {
            clientId: config.auth.clientId,
            authority: config.auth.authority,
            redirectUri: `${import.meta.env.VITE_FRONTEND_URL || window.location.origin}/dashboard`,
            postLogoutRedirectUri: `${import.meta.env.VITE_FRONTEND_URL || window.location.origin}/`,
            navigateToLoginRequestUrl: false,
        },
        cache: {
            cacheLocation: config.cache?.cacheLocation || "localStorage",
            storeAuthStateInCookie: config.cache?.storeAuthStateInCookie ?? true
        },
        system: {
            loggerOptions: {
                loggerCallback: (level, message, containsPii) => {
                    if (containsPii) return;
                },
                logLevel: "Info"
            }
        }
    };
};

export const getTokenScopes = () => {
    const config = getFrontendConfig();
    return config.tokenScope || ["User.Read", "profile", "email", "openid"];
};

export const getUserInfo = (account) => {
    if (!account) return null;
    
    return {
        username: account.idTokenClaims?.preferred_username || account.username,
        issuer: account.idTokenClaims?.iss,
        tenant: account.idTokenClaims?.tid,
        name: account.name,
        email: account.idTokenClaims?.preferred_username || account.username
    };
};

export const loginRequest = {
    scopes: getTokenScopes()
};