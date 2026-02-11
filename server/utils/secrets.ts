import * as sodium from "libsodium-wrappers";

export async function encryptSecret(publicKey: string, value: string): Promise<string> {
	await sodium.ready;
	const keyBytes = sodium.from_base64(publicKey, sodium.base64_variants.ORIGINAL);
	const valueBytes = sodium.from_string(value);
	const encryptedBytes = sodium.crypto_box_seal(valueBytes, keyBytes);
	return sodium.to_base64(encryptedBytes, sodium.base64_variants.ORIGINAL);
}
