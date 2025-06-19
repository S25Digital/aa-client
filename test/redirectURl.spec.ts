import { expect } from 'chai';
import { encrypt, decrypt, encryptValueToXor, decryptXoredValue } from '../src/redirectURL';

describe('Encryption Utility', () => {
  const salt = '031120201803460';
  const payload = 'txnid=T1234&sessionid=S1234&srcref=Srcref1234&userid=test@test-aa&redirect=https://example.com';

  it('should encrypt and decrypt the payload correctly', () => {
    const encrypted = encrypt(payload, salt);
    const decrypted = decrypt(encrypted, salt);
    expect(decrypted).to.equal(payload);
  });

  it('should produce different encrypted values for different salts', () => {
    const altSalt = '15062025120000';
    const encrypted1 = encrypt(payload, salt);
    const encrypted2 = encrypt(payload, altSalt);
    expect(encrypted1).to.not.equal(encrypted2);
  });

  it('should fail to decrypt with incorrect salt', () => {
    const encrypted = encrypt(payload, salt);
    const wrongSalt = '000000000000000';
    expect(() => decrypt(encrypted, wrongSalt)).to.throw();
  });

  it('should return valid URL-safe base64 string', () => {
    const encrypted = encrypt(payload, salt);
    expect(encrypted).to.match(/^[A-Za-z0-9\-_.~%]+$/);
  });
});

describe('XOR Encryption Utility', () => {
  const value = 'FIUID';
  const key = '031120201803460';

  it('should encrypt and decrypt correctly with the same key', () => {
    const encrypted = encryptValueToXor(value, key);
    const decrypted = decryptXoredValue(encrypted, key);
    expect(decrypted).to.equal(value);
  });

  it('should produce different output for different keys', () => {
    const encrypted1 = encryptValueToXor(value, key);
    const encrypted2 = encryptValueToXor(value, 'diffkey123');
    expect(encrypted1).to.not.equal(encrypted2);
  });

  it('should not decrypt correctly with wrong key', () => {
    const encrypted = encryptValueToXor(value, key);
    const decrypted = decryptXoredValue(encrypted, 'wrongkey');
    expect(decrypted).to.not.equal(value);
  });

  it('should return base64-encoded string', () => {
    const encrypted = encryptValueToXor(value, key);
    expect(encrypted).to.match(/^[A-Za-z0-9+/=]+$/);
  });
});
