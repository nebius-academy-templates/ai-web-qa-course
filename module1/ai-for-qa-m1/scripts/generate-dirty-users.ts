// Deterministic generator for data/dirty/users.csv.
// Fixed seed + own PRNG (no external packages) => byte-identical output on every run.
// Everything is fictional: example.com / techshop-demo.com emails, Ofcom drama-range
// phone numbers (07700 900xxx), Luhn-valid but non-issued 400000 test card numbers,
// and API-key-shaped strings ending in _SYNTHETIC.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'data', 'dirty', 'users.csv');

const SEED = 20261009;
const ROWS = 300;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(SEED);
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const pick = <T,>(xs: T[]): T => xs[int(0, xs.length - 1)];
const hex = (n: number) => Array.from({ length: n }, () => int(0, 15).toString(16)).join('');
const digits = (n: number) => Array.from({ length: n }, () => int(0, 9)).join('');
const pad = (n: number, w: number) => String(n).padStart(w, '0');

const FIRST = ['Hannah', 'Daniel', 'Aisha', 'Marcus', 'Sofia', 'Ollie', 'Priya', 'Tom', 'Grace', 'Ravi', 'Chloe', 'Imran', 'Beth', 'Callum', 'Nadia', 'Josh', 'Freya', 'Kofi', 'Maya', 'Liam',
  'Zoë', 'Søren', 'Łukasz', 'Renée', 'Aoife', 'Björn', 'Inés', 'Dvořák'];
const LAST = ['Brooks', 'Okafor', 'Rahman', 'Webb', 'Marchetti', 'Hartley', 'Nair', 'Whitfield', 'Ellis', 'Patel', 'Morgan', 'Hussain', 'Clarke', 'Reid', 'Siddiqui', 'Turner', 'Quinn', 'Mensah', 'Chen', 'Wilson',
  'Müller', 'Nuñez', 'Ó Briain', 'Łodziński', 'Kovář', 'Åberg', 'Zoë-Hart'];
const DOMAINS = ['example.com', 'techshop-demo.com'];
const PLANS = ['free', 'basic', 'premium'];
const CITIES = ['Bristol', 'Cardiff', 'Leeds', 'Glasgow', 'Norwich', 'Exeter', 'York', 'Swansea', 'Belfast'];
const STREETS = ['Alder Court', 'Mill Lane', 'Station Road', 'Orchard Close', 'Kings Way', 'Church Street'];
const ASCII = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z]/g, '').toLowerCase();

function luhnCard(prefix: string): string {
  const body = prefix + digits(15 - prefix.length);
  let sum = 0;
  for (let i = 0; i < body.length; i++) {
    let d = Number(body[body.length - 1 - i]);
    if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return body + String((10 - (sum % 10)) % 10);
}
function niNumber(): string {
  const L = 'ABCEGHJKLMNPRSTWXYZ';
  return `${pick([...L])}${pick([...L])}${digits(6)}${pick(['A', 'B', 'C', 'D'])}`;
}
// Version-7 style UUID: the lesson's starter regex only accepts versions 1-5, so it misses these.
function uuidV7(): string {
  return `${hex(8)}-${hex(4)}-7${hex(3)}-${pick(['8', '9', 'a', 'b'])}${hex(3)}-${hex(12)}`;
}
function uuidV4(): string {
  return `${hex(8)}-${hex(4)}-4${hex(3)}-${pick(['8', '9', 'a', 'b'])}${hex(3)}-${hex(12)}`;
}
function ukPhone(style: 'e164' | 'spaced' | 'local' | 'noplus'): string {
  const n = pad(int(0, 999), 3);
  switch (style) {
    case 'e164': return `+447700900${n}`;
    case 'spaced': return `+44 7700 900${n}`;
    case 'local': return `07700 900${n}`;
    case 'noplus': return `447700900${n}`; // edge case: E.164 digits without the leading +
  }
}
const csv = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

const header = ['user_id', 'full_name', 'email', 'phone', 'date_of_birth', 'ip_address', 'address', 'plan', 'ref_code', 'payment_card', 'national_id', 'support_notes'];
const lines: string[] = [header.join(',')];

for (let i = 1; i <= ROWS; i++) {
  const first = pick(FIRST);
  const last = pick(LAST);
  const handle = `${ASCII(first)}.${ASCII(last)}${int(1, 99)}`;
  const email = `${handle}@${pick(DOMAINS)}`;
  const phoneStyle = i % 11 === 0 ? 'noplus' : pick(['e164', 'spaced', 'local'] as const);
  const dob = `${int(1958, 2004)}-${pad(int(1, 12), 2)}-${pad(int(1, 28), 2)}`;
  const ip = `${pick([81, 86, 92, 203])}.${int(0, 255)}.${int(0, 255)}.${int(1, 254)}`;
  const address = `${int(1, 120)} ${pick(STREETS)} ${pick(CITIES)}`;
  const plan = pick(PLANS);
  // ref_code looks innocuous but is a UUID. Every third one is a v7-style UUID.
  const ref = i % 3 === 0 ? uuidV7() : uuidV4();
  const card = i % 7 === 0 ? luhnCard('400000') : '';
  const ni = i % 9 === 0 ? niNumber() : '';

  let notes = '';
  const mod = i % 10;
  if (mod === 1) notes = `Customer asked to be contacted on ${handle}.alt@${pick(DOMAINS)}, not the account email.`;
  else if (mod === 2) notes = 'Requested invoice copy; resolved on first contact.';
  else if (mod === 3) notes = `Escalated by phone ${ukPhone('local')} - callback done.`;
  else if (mod === 4) notes = `Integration test key left in ticket: tsk_live_${hex(32)}_SYNTHETIC`;
  else if (mod === 5) notes = 'Mentioned a disability and asked about the accessibility discount.';
  else if (mod === 6) notes = `Order ORD-${digits(6)} delayed; customer ${ASCII(first)} very patient.`;
  else if (mod === 7) notes = 'Asked to delete account under data protection request.';
  else if (mod === 8) notes = `Login attempts from ${pick([81, 86, 92, 203])}.${int(0, 255)}.${int(0, 255)}.${int(1, 254)} flagged by fraud rules.`;

  const row: Record<string, string> = {
    user_id: `U${pad(i, 5)}`,
    full_name: `${first} ${last}`,
    email,
    phone: ukPhone(phoneStyle),
    date_of_birth: dob,
    ip_address: ip,
    address,
    plan,
    ref_code: ref,
    payment_card: card,
    national_id: ni,
    support_notes: notes,
  };

  // Edge case: rows with a missing field (email or phone absent), at fixed positions.
  if (i % 37 === 0) row.email = '';
  if (i % 41 === 0) row.phone = '';

  lines.push(header.map((h) => csv(row[h])).join(','));
}

writeFileSync(out, lines.join('\n') + '\n');
console.log(`wrote ${ROWS} rows to ${out}`);
