import CryptoJS from "crypto-js"

export const encryptText = text => {
	var b64 = CryptoJS.AES.encrypt(text, "kuchbhi").toString()
	var e64 = CryptoJS.enc.Base64.parse(b64)
	var eHex = e64.toString(CryptoJS.enc.Hex)
	return eHex
}

export const decryptText = encryptText => {
	var reb64 = CryptoJS.enc.Hex.parse(encryptText)
	var bytes = reb64.toString(CryptoJS.enc.Base64)
	var decrypt = CryptoJS.AES.decrypt(bytes, "kuchbhi")
	var plain = decrypt.toString(CryptoJS.enc.Utf8)
	return plain
}
