#!/usr/bin/env python3
import base64,hashlib,os,sys,re
from cryptography.hazmat.primitives.ciphers import Cipher,algorithms,modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend

key_path = os.path.expanduser('~/.config/echo-nexus/cipher.key')
if not os.path.exists(key_path):
    print('Cipher key not found at', key_path, file=sys.stderr)
    sys.exit(1)
key_raw = open(key_path,'rb').read().strip()
key = hashlib.sha256(key_raw).digest()
with open('TODO.md','rb') as fh:
    t = fh.read()
m = re.search(b'-----BEGIN ENCRYPTED TODO.*?-----(.*?)-----END ENCRYPTED TODO', t, re.S)
if not m:
    b64 = t.strip()
else:
    b64 = m.group(1).strip()
try:
    data = base64.b64decode(b64)
except Exception as e:
    print('Base64 decode failed:', e, file=sys.stderr)
    sys.exit(1)
iv = data[:16]
ct = data[16:]
cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
decryptor = cipher.decryptor()
padded = decryptor.update(ct) + decryptor.finalize()
unpadder = padding.PKCS7(128).unpadder()
plain = unpadder.update(padded) + unpadder.finalize()
# write to stdout
sys.stdout.buffer.write(plain)
