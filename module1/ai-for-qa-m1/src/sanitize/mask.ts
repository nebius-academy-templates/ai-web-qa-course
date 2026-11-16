// Format-preserving masking: every replacement keeps the shape of the original, so a masked
// email is still an email, a masked phone keeps its E.164 shape and a masked UUID is still a UUID
// (lesson 1.2.3). Output is deterministic for a given salt: the same input always masks to the
// same output, so references between fields stay consistent and runs are reproducible.
import { createHash } from 'node:crypto';
import type { Kind } from './types.ts';
import { luhnValid } from './detectors.ts';

const FAKE_FIRST = ['Rowan', 'Avery', 'Quincy', 'Sasha', 'Devon', 'Elliot', 'Harper', 'Indira', 'Jules', 'Kieran', 'Lennox', 'Marlow', 'Noor', 'Orla', 'Pascal', 'Remy', 'Sloane', 'Tavish', 'Ulla', 'Wren'];
const FAKE_LAST = ['Ashdown', 'Bexley', 'Carrow', 'Dunmore', 'Eastwick', 'Fairley', 'Garrow', 'Hollis', 'Ingram', 'Jessop', 'Kestrel', 'Larkin', 'Marlowe', 'Northcott', 'Oakes', 'Pemberton', 'Radley', 'Stanhope', 'Thornley', 'Wexford'];
const FAKE_STREETS = ['Maple', 'Cedar', 'Willow', 'Birch', 'Hawthorn', 'Elmwood', 'Juniper', 'Rowan', 'Linden', 'Sycamore'];
const STREET_SUFFIXES = ['Street', 'Road', 'Lane', 'Avenue', 'Court', 'Close', 'Way', 'Drive'];
const FAKE_CITIES = ['Ashbourne', 'Redfield', 'Northam', 'Calderbrook', 'Westleigh', 'Hartwell', 'Easterby', 'Millbrook', 'Thornbury', 'Greywick'];
const COUNTRY_CODES = ['353', '44', '49', '33', '34', '39', '31', '61', '1']; // longest first within a prefix family

class Rng {
  private a: number;
  constructor(seed: number) {
    this.a = seed >>> 0;
  }
  next(): number {
    this.a = (this.a + 0x6d2b79f5) >>> 0;
    let t = this.a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  pick<T>(xs: readonly T[]): T {
    return xs[this.int(0, xs.length - 1)];
  }
  digit(): string {
    return String(this.int(0, 9));
  }
}

export const fold = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export class Masker {
  private memo = new Map<string, string>();
  /** Every fake value handed out; lets verification ignore a coincidental clash with an original. */
  readonly produced = new Set<string>();
  private usedEmails = new Set<string>();
  /** folded original name token -> fake token, filled while name fields are masked. */
  readonly nameTokens = new Map<string, string>();

  private salt: string;
  constructor(salt = 'techshop-m1') {
    this.salt = salt;
  }

  private rng(kind: string, value: string, attempt = 0): Rng {
    const h = createHash('sha256').update(`${this.salt}|${kind}|${attempt}|${value}`).digest();
    return new Rng(h.readUInt32BE(0));
  }

  /** Mask one value. Never returns the input unchanged (retries with a new attempt number). */
  mask(kind: Kind, value: string): string {
    const key = `${kind}|${value}`;
    const hit = this.memo.get(key);
    if (hit !== undefined) return hit;
    let out = value;
    for (let attempt = 0; attempt < 6 && out === value; attempt++) {
      out = this.make(kind, value, this.rng(kind, value, attempt));
    }
    this.memo.set(key, out);
    this.produced.add(out);
    return out;
  }

  private make(kind: Kind, value: string, r: Rng): string {
    switch (kind) {
      case 'email': {
        let n = r.int(0, 999999);
        let out = `testuser_${String(n).padStart(6, '0')}@example.com`;
        while (this.usedEmails.has(out)) {
          n = (n + 1) % 1_000_000;
          out = `testuser_${String(n).padStart(6, '0')}@example.com`;
        }
        this.usedEmails.add(out);
        return out;
      }
      case 'phone':
        return this.maskPhone(value, r);
      case 'uuid':
        return this.maskUuid(value, r);
      case 'ip':
        return `${r.pick(['192.0.2', '198.51.100', '203.0.113'])}.${r.int(1, 254)}`; // RFC 5737 documentation ranges
      case 'national-id':
        return /^\d{3}-\d{2}-\d{4}$/.test(value) ? `987-65-432${r.digit()}` : `QQ${Array.from({ length: 6 }, () => r.digit()).join('')}C`;
      case 'card':
        return this.maskCard(value, r);
      case 'api-key':
        return this.maskApiKey(value, r);
      case 'customer-id':
      case 'order-number':
      case 'session-id':
      case 'id':
        return this.maskId(value, r);
      case 'account-number':
        return this.maskDigits(value, r);
      case 'name':
        return this.maskName(value);
      case 'address':
        return this.maskAddress(value, r);
      case 'address-line-2':
        return this.maskDigits(value, r, true);
      case 'city':
        return r.pick(FAKE_CITIES);
      case 'postcode':
        return this.maskAlnum(value, r);
      case 'dob':
        return this.maskDate(value, r);
      case 'amount':
        return String(Math.round(Number(value) * (0.6 + r.next() * 0.8) * 100) / 100);
      case 'url-credentials':
        return `testuser:Passw0rd-${String(r.int(0, 999999)).padStart(6, '0')}`;
      case 'internal-host':
        return `svc-${String(r.int(0, 65535).toString(16)).padStart(4, '0')}.masked.example`;
      case 'health-keyword':
        return value; // review-only, never auto-masked
    }
  }

  // ---- individual formats -------------------------------------------------

  private maskPhone(value: string, r: Rng): string {
    const digits = value.replace(/\D/g, '');
    let keep = 0; // how many leading digits (country code) to keep
    if (value.startsWith('+')) {
      keep = COUNTRY_CODES.find((c) => digits.startsWith(c))?.length ?? 2;
      if (digits.startsWith('44')) keep = 3; // keep the UK mobile "7" so the number still looks like a UK mobile
    } else if (value.startsWith('07')) {
      keep = 2; // UK local mobile: keep "07"
    } else if (value.startsWith('0')) {
      keep = 1; // other trunk-prefixed local number
    } else if (digits.startsWith('447') && digits.length === 12) {
      keep = 3; // UK mobile written without "+"
    }
    let seen = 0;
    return value.replace(/\d/g, (d) => (seen++ < keep ? d : r.digit()));
  }

  private maskUuid(value: string, r: Rng): string {
    // keep the version nibble (first char of the 3rd group) and the variant nibble (first char of the 4th)
    const hex = () => '0123456789abcdef'[r.int(0, 15)];
    const upper = value === value.toUpperCase();
    const parts = value.split('-');
    const out = parts.map((p, i) => {
      let s = '';
      for (let k = 0; k < p.length; k++) {
        if ((i === 2 || i === 3) && k === 0) s += p[0];
        else s += hex();
      }
      return s;
    });
    const joined = out.join('-');
    return upper ? joined.toUpperCase() : joined;
  }

  private maskCard(value: string, r: Rng): string {
    const total = value.replace(/\D/g, '').length;
    const body = '400000' + Array.from({ length: total - 7 }, () => r.digit()).join('');
    let check = 0;
    for (let c = 0; c < 10; c++) if (luhnValid(body + c)) check = c;
    const digits = body + String(check);
    let i = 0;
    return value.replace(/\d/g, () => digits[i++]);
  }

  private maskApiKey(value: string, r: Rng): string {
    const prefix = value.match(/^(?:(?:tsk|sk|pk)_(?:live|test)_|AKIA)/)?.[0] ?? '';
    const suffix = value.match(/_[A-Z]+$/)?.[0] ?? '';
    const body = value.slice(prefix.length, value.length - suffix.length);
    const alnum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const out = [...body].map((ch) => (/[0-9]/.test(ch) ? r.digit() : /[A-Z]/.test(ch) ? alnum[26 + r.int(0, 25)] : alnum[r.int(0, 25)])).join('');
    return prefix + out + suffix;
  }

  /** Keep leading letters and separators, replace the rest character-class by character-class (hex stays hex). */
  private maskId(value: string, r: Rng): string {
    const lead = value.match(/^[A-Za-z]+/)?.[0] ?? '';
    const rest = value.slice(lead.length);
    const out = [...rest]
      .map((ch) => {
        if (/[0-9]/.test(ch)) return r.digit();
        if (/[a-f]/.test(ch)) return 'abcdef'[r.int(0, 5)];
        if (/[A-F]/.test(ch)) return 'ABCDEF'[r.int(0, 5)];
        if (/[g-z]/.test(ch)) return String.fromCharCode(97 + r.int(0, 25));
        if (/[G-Z]/.test(ch)) return String.fromCharCode(65 + r.int(0, 25));
        return ch;
      })
      .join('');
    return lead + out;
  }

  private maskDigits(value: string, r: Rng, keepFirstChars = false): string {
    let first = true;
    return value.replace(/\d/g, () => {
      const d = first && !keepFirstChars ? String(r.int(1, 9)) : r.digit();
      first = false;
      return d;
    });
  }

  private maskAlnum(value: string, r: Rng): string {
    return value.replace(/[0-9]/g, () => r.digit()).replace(/[A-Z]/g, () => String.fromCharCode(65 + r.int(0, 25))).replace(/[a-z]/g, () => String.fromCharCode(97 + r.int(0, 25)));
  }

  private maskDate(value: string, r: Rng): string {
    const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) return `${r.int(1950, 2005)}-${String(r.int(1, 12)).padStart(2, '0')}-${String(r.int(1, 28)).padStart(2, '0')}`;
    const dmy = value.match(/^(\d{2})([/.-])(\d{2})\2(\d{4})$/);
    if (dmy) return `${String(r.int(1, 28)).padStart(2, '0')}${dmy[2]}${String(r.int(1, 12)).padStart(2, '0')}${dmy[2]}${r.int(1950, 2005)}`;
    return this.maskDigits(value, r);
  }

  private maskAddress(value: string, r: Rng): string {
    const last = value.split(/\s+/).find((w) => STREET_SUFFIXES.includes(w));
    return `${r.int(1, 899)} ${r.pick(FAKE_STREETS)} ${last ?? 'Street'}`;
  }

  // ---- names ---------------------------------------------------------------

  /** Replace every word of a name; remember folded-token -> fake so free text can be scrubbed too. */
  private maskName(value: string): string {
    return value.replace(/\p{L}[\p{L}'’]*/gu, (word) => this.fakeToken(word));
  }

  private fakeToken(word: string): string {
    const f = fold(word);
    const known = this.nameTokens.get(f);
    if (known) return known;
    const r = this.rng('name-token', f);
    const fake = r.next() < 0.5 ? r.pick(FAKE_FIRST) : r.pick(FAKE_LAST);
    if (f.length >= 3) this.nameTokens.set(f, fake);
    return fake;
  }

  /** Register the name tokens of a value (pass 1) so they can be masked wherever else they appear. */
  registerName(value: string): void {
    for (const w of value.match(/\p{L}[\p{L}'’]*/gu) ?? []) this.fakeToken(w);
  }

  /** Replace known name tokens inside free text. Returns the text and how many tokens were replaced. */
  scrubNames(text: string): { text: string; count: number } {
    if (this.nameTokens.size === 0) return { text, count: 0 };
    let count = 0;
    const out = text.replace(/\p{L}[\p{L}'’]*/gu, (word) => {
      const fake = this.nameTokens.get(fold(word));
      if (!fake) return word;
      count++;
      if (word === word.toUpperCase() && word.length > 1) return fake.toUpperCase();
      if (word === word.toLowerCase()) return fake.toLowerCase();
      return fake;
    });
    return { text: out, count };
  }
}
