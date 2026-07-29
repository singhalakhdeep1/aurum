/**
 * Biometric Authentication Service
 * Supports WebAuthn for fingerprint, Face ID, and other biometric methods
 */

interface CredentialRequestOptions {
  publicKey: {
    challenge: Uint8Array;
    rp: {
      name: string;
      id: string;
    };
    user: {
      id: Uint8Array;
      name: string;
      displayName: string;
    };
    pubKeyCredParams: Array<{
      type: 'public-key';
      alg: number;
    }>;
    authenticatorSelection?: {
      authenticatorAttachment?: 'platform' | 'cross-platform';
      userVerification?: 'required' | 'preferred' | 'discouraged';
    };
    timeout?: number;
  };
}

interface CredentialAssertionOptions {
  publicKey: {
    challenge: Uint8Array;
    rpId: string;
    userVerification?: 'required' | 'preferred' | 'discouraged';
    timeout?: number;
    allowCredentials?: Array<{
      type: 'public-key';
      id: Uint8Array;
      transports?: Array<'ble' | 'internal' | 'nfc' | 'usb'>;
    }>;
  };
}

/**
 * Register a new biometric credential
 */
export async function registerBiometric(userId: string, username: string): Promise<boolean> {
  if (!window.PublicKeyCredential) {
    console.error('WebAuthn is not supported in this browser');
    return false;
  }

  try {
    // Check if biometric authentication is available
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    if (!available) {
      console.error('Biometric authentication is not available on this device');
      return false;
    }

    // Convert user ID to Uint8Array
    const userIdBuffer = new TextEncoder().encode(userId);
    
    // Generate challenge
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const credentialRequestOptions: CredentialRequestOptions = {
      publicKey: {
        challenge,
        rp: {
          name: 'Aurum Finance',
          id: window.location.hostname,
        },
        user: {
          id: userIdBuffer,
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 }, // ES256
          { type: 'public-key', alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
      },
    };

    const credential = await navigator.credentials.create(credentialRequestOptions) as PublicKeyCredential;
    
    if (!credential) {
      throw new Error('Failed to create credential');
    }

    // Send credential to backend for storage
    const response = await fetch('/api/auth/biometric/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        credentialId: credential.id,
        userId,
        username,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Biometric registration error:', error);
    return false;
  }
}

/**
 * Authenticate using biometric credential
 */
export async function authenticateWithBiometric(userId: string): Promise<boolean> {
  if (!window.PublicKeyCredential) {
    console.error('WebAuthn is not supported in this browser');
    return false;
  }

  try {
    // Get stored credential ID from backend
    const response = await fetch(`/api/auth/biometric/credentials?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch credentials');
    }

    const { credentialId } = await response.json();
    
    // Generate challenge
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Convert credential ID to Uint8Array
    const credentialIdBuffer = new Uint8Array(
      atob(credentialId)
        .split('')
        .map(c => c.charCodeAt(0))
    );

    const credentialAssertionOptions: CredentialAssertionOptions = {
      publicKey: {
        challenge,
        rpId: window.location.hostname,
        userVerification: 'required',
        timeout: 60000,
        allowCredentials: [
          {
            type: 'public-key',
            id: credentialIdBuffer,
            transports: ['internal'],
          },
        ],
      },
    };

    const credential = await navigator.credentials.get(credentialAssertionOptions) as PublicKeyCredential;
    
    if (!credential) {
      throw new Error('Failed to authenticate');
    }

    // Verify with backend
    const verifyResponse = await fetch('/api/auth/biometric/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        credentialId: credential.id,
        userId,
        authenticatorData: credential.response,
      }),
    });

    return verifyResponse.ok;
  } catch (error) {
    console.error('Biometric authentication error:', error);
    return false;
  }
}

/**
 * Check if biometric authentication is available
 */
export async function isBiometricAvailable(): Promise<boolean> {
  if (!window.PublicKeyCredential) {
    return false;
  }

  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}
