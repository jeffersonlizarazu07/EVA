import CryptoJS from 'crypto-js';
import { secretKey } from '../../constants/secretKey';

export default function encodeBase64(name, clientId) {
    const data = JSON.stringify({ name, clientId });
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
}

export function generateRandomLink(name, clientId) {
    const encodedString = encodeBase64(name, clientId);
/*     const baseUrl = 'https://eva.telpercormance.co/'; */
    const baseUrl = 'http://localhost:5174/';
    return `${baseUrl}survey/${encodeURIComponent(encodedString)}`;
}
