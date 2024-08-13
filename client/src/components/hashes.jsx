import CryptoJS from 'crypto-js';/////////encriptar y desencriptar datos

export const encryptionKey = 'mysecretkey';

export const encryptValue = (value, key) => {
  if (value == null) {
    throw new Error('El valor a cifrar no puede ser null o undefined');
  }
  return CryptoJS.AES.encrypt(value.toString(), key).toString();
};

export const decryptValue = (encryptedValue, key) => {
  const bytes = CryptoJS.AES.decrypt(encryptedValue, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};