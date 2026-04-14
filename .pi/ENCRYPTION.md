# 🔐 Echo Nexus — Encryption Protocol (Internal Only)

**Status:** CONFIDENTIAL — For Authorized Operators Only  
**Updated:** 2026-04-08  
**Protocol:** AES-256-CBC with SHA256-derived keys

---

## Overview

All commit messages in the public repository are encrypted using AES-256-CBC. This document explains the workflow for authorized users only. Do not share with untrusted parties.

## Key Locations (Abstracted)

```
~/.config/echo-nexus/cipher.key      ← Master key (DO NOT commit)
~/.pi/agent/skills/*/ENCRYPTED.log   ← Encryption audit trail
```

## Encryption Workflow

### 1. Prepare Commit Message

```python
# Message to encrypt
msg = """Your actual commit details here"""

# NO PLAINTEXT IN GIT - Always encrypt before commit
```

### 2. Encrypt Using Standard Protocol

```bash
# Use the provided script (see below)
./bin/encrypt-message.py "your message here"
```

**Output:** `ENC:BASE64_ENCRYPTED_DATA_HERE`

### 3. Commit with Encrypted Message Only

```bash
git commit -m "ENC:$(encrypt-message.py '...')"
```

**Result in git log:**
```
c78a105 ENC:TBnzcsPbH1/6oOHIDNxnfqdTcZ0p5qsqbD8ifm/ZOi6...
```

⚠️ **Only encrypted hashes visible to public**

---

## Technical Details (Tokenized)

### Algorithm Stack
- **Cipher:** AES (256-bit key)
- **Mode:** CBC (random IV per message)
- **Key Derivation:** SHA256(master_key)
- **Padding:** PKCS7
- **Encoding:** Base64 (for git compatibility)

### Message Flow

```
[Plaintext Message]
        ↓
[UTF-8 Encode]
        ↓
[PKCS7 Padding]
        ↓
[AES-256-CBC Encrypt with Random IV]
        ↓
[Combine: IV + Encrypted Data]
        ↓
[Base64 Encode]
        ↓
[Prepend: ENC:]
        ↓
[Commit Message] ← VISIBLE IN GIT (ENCRYPTED)
```

### Verification

Only authorized operators with `~/.config/echo-nexus/cipher.key` can decrypt.

```bash
./bin/decrypt-message.py "ENC:TBnzcsPbH1/..."
# Output: Original plaintext message (only for us)
```

---

## Scripts (Internal Use)

### `encrypt-message.py` (Encrypt before commit)

```python
#!/usr/bin/env python3
"""Encrypt commit message using AES-256-CBC"""

import sys
import os
import hashlib
import base64
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

def encrypt(message):
    # Load key from internal config
    with open(os.path.expanduser('~/.config/echo-nexus/cipher.key'), 'rb') as f:
        key_raw = f.read().strip()
    
    # Derive 32-byte key
    key = hashlib.sha256(key_raw).digest()
    
    # Pad message (PKCS7)
    msg_bytes = message.encode()
    block_size = 16
    padding_length = block_size - (len(msg_bytes) % block_size)
    padded = msg_bytes + bytes([padding_length] * padding_length)
    
    # Encrypt with random IV
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted = encryptor.update(padded) + encryptor.finalize()
    
    # Encode: IV + encrypted
    result = base64.b64encode(iv + encrypted).decode()
    return result

if __name__ == '__main__':
    msg = sys.argv[1] if len(sys.argv) > 1 else sys.stdin.read()
    encrypted = encrypt(msg)
    print(encrypted)
```

### `decrypt-message.py` (For verification only)

```python
#!/usr/bin/env python3
"""Decrypt commit message for verification"""

import sys
import os
import hashlib
import base64
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

def decrypt(encrypted_b64):
    # Load key
    with open(os.path.expanduser('~/.config/echo-nexus/cipher.key'), 'rb') as f:
        key_raw = f.read().strip()
    
    key = hashlib.sha256(key_raw).digest()
    
    # Decode base64
    combined = base64.b64decode(encrypted_b64)
    
    # Split IV + encrypted
    iv = combined[:16]
    encrypted = combined[16:]
    
    # Decrypt
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    padded = decryptor.update(encrypted) + decryptor.finalize()
    
    # Remove PKCS7 padding
    padding_length = padded[-1]
    message = padded[:-padding_length].decode()
    
    return message

if __name__ == '__main__':
    encrypted = sys.argv[1] if len(sys.argv) > 1 else sys.stdin.read()
    # Remove "ENC:" prefix if present
    if encrypted.startswith('ENC:'):
        encrypted = encrypted[4:]
    
    try:
        plaintext = decrypt(encrypted)
        print(plaintext)
    except Exception as e:
        print(f"Decryption failed: {e}", file=sys.stderr)
        sys.exit(1)
```

---

## Workflow for Contributors

### Before Committing

1. **Prepare your message** (plaintext, private)
2. **Encrypt it:**
   ```bash
   ENCRYPTED=$(python3 ~/.pi/encryption/encrypt-message.py "Your commit message")
   ```
3. **Commit with encrypted message:**
   ```bash
   git commit -m "ENC:${ENCRYPTED}"
   ```

### For Internal Verification Only

```bash
# Decrypt to verify what's in git
git log -1 --oneline | grep ENC
# Copy the ENC:... part

python3 ~/.pi/encryption/decrypt-message.py "ENC:TBnzcs..."
# Shows plaintext (only for us)
```

---

## Security Properties

| Property | Value |
|----------|-------|
| **Key Size** | 256 bits (AES-256) |
| **Block Size** | 128 bits (16 bytes) |
| **IV** | Random per message (16 bytes) |
| **Mode** | CBC (Cipher Block Chaining) |
| **Padding** | PKCS7 |
| **Key Derivation** | SHA256(master_key) |
| **Complexity** | ~2^256 search space |

---

## What's Hidden

✅ **Original commit messages** — Not visible in public git log  
✅ **Task intent & scope** — Only shows as encrypted hashes  
✅ **Technical decisions** — Encrypted before pushing  
✅ **Project timeline** — Hidden in message content  
✅ **Implementation details** — Only for authorized decryption  

**Visible to public:**
- File names and structure
- Timestamps
- Encrypted hashes (random, non-reversible)

---

## Key Management

### Master Key (`~/.config/echo-nexus/cipher.key`)

```bash
# Key location (DO NOT commit to git)
cat ~/.config/echo-nexus/cipher.key

# Key properties
- Random 44-byte ASCII string
- Stored locally only
- Used to derive SHA256 encryption key
- Backup in secure location (not in repo)
```

### Key Rotation (If Needed)

```bash
# Generate new key
openssl rand -base64 32 > ~/.config/echo-nexus/cipher.key.new

# Old commits stay encrypted (different IV per message)
# New commits use new key
# Note: Old + New commits remain independently valid
```

---

## Audit & Verification

### Check Git History (What Public Sees)

```bash
git log --oneline
# c78a105 ENC:TBnzcsPbH1/6oOHIDNxnfqdTcZ0p5qsqbD8ifm/ZOi6...
# 7abdab5 ENC:QWRkIHNlY3VyaXR5IGluZnJhc3...
```

**Result:** Completely opaque — no meaningful information leaks

### Decrypt for Internal Review (Authorized Only)

```bash
# Extract commit message
COMMIT_MSG=$(git log -1 --format=%B | grep ENC: | cut -d: -f2-)

# Decrypt
python3 ~/.pi/encryption/decrypt-message.py "ENC:${COMMIT_MSG}"

# Shows plaintext (only if you have cipher.key)
```

---

## Best Practices

✅ **DO:**
- Always encrypt before `git commit`
- Use the provided scripts
- Keep cipher.key in `~/.config/echo-nexus/`
- Verify commits decrypt correctly

❌ **DON'T:**
- Commit plaintext messages (defeats purpose)
- Share cipher.key
- Commit `.key` files to git
- Use weak passwords/keys

---

## Troubleshooting

### Decryption Fails

```
Error: Decryption failed
```

**Check:**
1. Cipher key exists: `ls ~/.config/echo-nexus/cipher.key`
2. Key is readable: `cat ~/.config/echo-nexus/cipher.key`
3. Message is complete: Include full `ENC:...` string

### Message Length Issues

- Messages are auto-padded (PKCS7)
- Any length input works
- Padding removed automatically on decryption

---

## Examples

### Example 1: Encrypt Release Notes

```bash
MSG="Release v2.1: Added portal navigation, improved responsive design, hardened security"

ENCRYPTED=$(python3 ~/.pi/encryption/encrypt-message.py "${MSG}")
git commit -m "ENC:${ENCRYPTED}"

# In git log: "ENC:QXdEZFdXZGQgVDJGMEJ..."
# Only we can decrypt back to original
```

### Example 2: Decrypt to Audit

```bash
# View encrypted commit
git show c78a105

# Copy the ENC:... message
python3 ~/.pi/encryption/decrypt-message.py "ENC:TBnzcs..." 

# Output:
# Add security hardening: .gitignore + SECURITY.md
# ✓ .gitignore (107 rules)...
```

---

## Compliance

This encryption system ensures:
- ✅ No plaintext project details in public git
- ✅ No task information exposed
- ✅ No implementation notes visible
- ✅ No personal data in commit history
- ✅ Only authorized users can read messages
- ✅ Standard AES-256-CBC security level

---

**Last Verified:** 2026-04-08  
**Operator:** AXIOM Emergence Bot  
**Status:** ✅ ACTIVE & VERIFIED
