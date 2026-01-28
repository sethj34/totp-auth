import * as OTPAuth from 'otpauth';

export interface AuthEntry {
  id: string;
  name: string;
  issuer: string;
  secret: string;
  createdAt: number;
}

export function generateTOTP(secret: string): string {
  try {
    // Clean the secret (remove spaces and convert to uppercase)
    const cleanSecret = secret.replace(/\s/g, '').toUpperCase();
    
    const totp = new OTPAuth.TOTP({
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(cleanSecret),
    });
    
    return totp.generate();
  } catch (error) {
    console.error('Error generating TOTP:', error);
    return '------';
  }
}

export function getTimeRemaining(): number {
  const epoch = Math.floor(Date.now() / 1000);
  return 30 - (epoch % 30);
}

export function isValidSecret(secret: string): boolean {
  try {
    const cleanSecret = secret.replace(/\s/g, '').toUpperCase();
    // Base32 alphabet check
    const base32Regex = /^[A-Z2-7]+=*$/;
    if (!base32Regex.test(cleanSecret)) {
      return false;
    }
    // Try to create a TOTP to validate
    OTPAuth.Secret.fromBase32(cleanSecret);
    return true;
  } catch {
    return false;
  }
}

const STORAGE_KEY = 'auth_entries';

export function getStoredEntries(): AuthEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries: AuthEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addEntry(entry: Omit<AuthEntry, 'id' | 'createdAt'>): AuthEntry {
  const entries = getStoredEntries();
  const newEntry: AuthEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  entries.push(newEntry);
  saveEntries(entries);
  return newEntry;
}

export function deleteEntry(id: string): void {
  const entries = getStoredEntries().filter(e => e.id !== id);
  saveEntries(entries);
}
