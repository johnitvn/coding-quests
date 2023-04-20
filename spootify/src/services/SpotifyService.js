import Config from "../config";


export async function redirectToOAuth() {
    console.log("-- redirectToAuthCodeFlow()");

    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", Config.api.clientId);
    params.append("redirect_uri", Config.api.callbackUrl);
    params.append("response_type", "code");
    params.append("scope", "user-read-private user-read-email");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `${Config.api.authUrl}?${params.toString()}`;
}


function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}


export async function getAccessToken(code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", Config.api.clientId);
    params.append("redirect_uri", Config.api.callbackUrl);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("code_verifier", verifier);

    const result = await fetch(Config.api.accountUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    if (result.status !== 200) {
        window.location = Config.api.callbackUrl;
    }

    const { access_token } = await result.json();
    return access_token;

}

export async function fetchRequest(token, endpoint) {
    const result = await fetch(`${Config.api.baseUrl}${endpoint}`, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}