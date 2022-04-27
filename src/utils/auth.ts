import CryptoJS from 'crypto-js'

/**
 * AES 加密，AES-128, AES-192, AES-256
 *  AES-128: key和iv都是16个字节，16*8=128bit
 *  AES-192: key和iv都是24个字节，24*8=128bit
 *  AES-256: key和iv都是32个字节，32*8=128bit
 * iv 似乎一般都是纯数字
 */

/**
 * AES CBC模式加密
 * @param message 明文
 * @param key   十六位十六进制数作为密钥
 * @param iv    十六位十六进制数作为密钥偏移量
 * @returns 加密后的密文
 */
export function AES_CBC_encrypt(message: string, key: string, iv: string): string {
  // utf8字符串—>WordArray对象，WordArray是一个保存32位整数的数组，相当于转成了二进制
  const keyHex = CryptoJS.enc.Utf8.parse(key); //
  const ivHex = CryptoJS.enc.Utf8.parse(iv);
  const messageHex = CryptoJS.enc.Utf8.parse(message);
  const encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();// base64结果
  //return encrypted.ciphertext.toString();   // 二进制结果
}

/**
 * AES CBC模式解密
 * @param message 密文
 * @param key   十六位十六进制数作为密钥
 * @param iv    十六位十六进制数作为密钥偏移量
 * @returns 解密后明文
 */
export function AES_CBC_decrypt(messageBase64: string, key: string, iv: string): string {
  // 如果加密后没有转成base64,那么先要转成base64再传入
  //let encryptedHexStr = CryptoJS.enc.Hex.parse(word);   // 从二进制文本转成二进制
  //messageBase64 = CryptoJS.enc.Base64.stringify(encryptedHexStr);    // 转成base64
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const ivHex = CryptoJS.enc.Utf8.parse(iv);
  const decrypt = CryptoJS.AES.decrypt(messageBase64, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

/**
 * AES ECB模式加密
 * @param message 密文
 * @param key   十六位十六进制数作为密钥
 * @returns 密文
 */
export function AES_ECB_encrypt(message: string, key: string): string {
  // utf8字符串—>WordArray对象，WordArray是一个保存32位整数的数组，相当于转成了二进制
  const keyHex = CryptoJS.enc.Utf8.parse(key); //
  const messageHex = CryptoJS.enc.Utf8.parse(message);
  const encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();// base64结果
  //return encrypted.ciphertext.toString();   // 二进制结果
}

/**
 * AES ECB模式解密
 * @param message 密文
 * @param key   十六位十六进制数作为密钥
 * @returns 解密后明文
 */
export function AES_ECB_decrypt(messageBase64: string, key: string): string {
  // 如果加密后没有转成base64,那么先要转成base64再传入
  //let encryptedHexStr = CryptoJS.enc.Hex.parse(word);   // 从二进制文本转成二进制
  //messageBase64 = CryptoJS.enc.Base64.stringify(encryptedHexStr);    // 转成base64
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const decrypt = CryptoJS.AES.decrypt(messageBase64, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}