import CryptoJS from 'crypto-js';

export const DecryptObject = (base64Data, secretKey) => {
    console.log('base64Data recibido:', base64Data);
    console.log('secretKey recibida:', secretKey);
    
    try {
        if (!base64Data) return null;

        // Limpiar comillas y espacios
        const cleanBase64 = base64Data.replace(/["']/g, "").trim();
        
        // Convertir Base64 a string binario
        const binaryString = window.atob(cleanBase64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Separar IV (16 bytes) y el Cifrado
        const ivBytes = bytes.slice(0, 16);
        const encryptedBytes = bytes.slice(16);

        const iv = CryptoJS.lib.WordArray.create(ivBytes);
        const ciphertext = CryptoJS.lib.WordArray.create(encryptedBytes);

        // OJO: Asegúrate de que el formato de tu clave coincida con el backend
        const key = CryptoJS.enc.Utf8.parse(secretKey); 

        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: ciphertext },
            key,
            { 
                iv: iv, 
                mode: CryptoJS.mode.CBC, 
                padding: CryptoJS.pad.Pkcs7 
            }
        );

        // --- PASO DE DEPURACIÓN ---
        // Convertimos a Hexadecimal primero. Si da un string largo de letras y números,
        // la desencriptación "corrió", pero la clave es incorrecta.
        const hexText = decrypted.toString(CryptoJS.enc.Hex);
        //console.log("Resultado en HEX (si es basura, la clave está mal):", hexText);
        // ---------------------------

        // Intenta convertir a texto plano
        const utf8Text = decrypted.toString(CryptoJS.enc.Utf8);

        if (!utf8Text) {
            console.log("Incorrect key o datos corruptos (utf8 vacío).");
            return null;
        }

        return JSON.parse(utf8Text);
    } catch (e) {
        console.log("Error DecryptObject: " + e.message);
        return null;
    }
}

export const EncryptText = (text, key) => {
    const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
};