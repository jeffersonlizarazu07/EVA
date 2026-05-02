import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid'; // Importamos 'uuid' para generar identificadores únicos
import { secretKey } from '../../constants/secretKey';

/**
 * Codifica la información en Base64 para generar enlaces únicos.
 * @param {string} name - Nombre de la encuesta.
 * @param {string} uniqueID - Identificador único para garantizar que cada link sea distinto.
 * @param {number} clientId - ID del cliente relacionado con la encuesta.
 * @returns {string} - Cadena codificada en Base64.
 */
export default function encodeBase64(name, uniqueID, clientId) {
    const data = JSON.stringify({ name, uniqueID, clientId }); 
    console.log("Datos antes de codificar:", data); // 🔍 Verificación de datos antes de codificar
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
}

/**
 * Genera un link único para cada encuesta duplicada.
 * @param {string} name - Nombre de la encuesta.
 * @param {number} clientId - ID del cliente.
 * @returns {string} - Link único de la encuesta.
 */
export function generateRandomLink(name, clientId) {
    const uniqueID = uuidv4(); // 🔹 Generamos un identificador único universal
    const encodedString = encodeBase64(name, uniqueID, clientId);
    /*     const baseUrl = 'https://eva.telpercormance.co/'; */
    const baseUrl = 'http://localhost:5174/'; // Base URL de la plataforma
    return `${baseUrl}survey/${encodeURIComponent(encodedString)}`;
}
