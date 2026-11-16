// Field-name rules for structured input (JSON keys, CSV headers). A field rule decides the kind
// of a whole value from its name alone, which catches PII that no regex can see (a plain name
// or street address). Names are normalised: lower case, letters and digits only.
import type { Kind } from './types.ts';

const RULES: Record<string, Kind> = {
  firstname: 'name', givenname: 'name', lastname: 'name', surname: 'name', familyname: 'name',
  fullname: 'name', name: 'name', customername: 'name',
  email: 'email', emailaddress: 'email',
  phone: 'phone', phonenumber: 'phone', mobile: 'phone', telephone: 'phone',
  address: 'address', addressline1: 'address', line1: 'address', street: 'address', streetaddress: 'address',
  addressline2: 'address-line-2', line2: 'address-line-2',
  city: 'city', town: 'city',
  postalcode: 'postcode', postcode: 'postcode', zip: 'postcode', zipcode: 'postcode',
  dateofbirth: 'dob', dob: 'dob', birthdate: 'dob',
  nationalid: 'national-id', ssn: 'national-id', nino: 'national-id',
  accountnumber: 'account-number',
  customerid: 'id', userid: 'id', sessionid: 'id',
  ordernumber: 'order-number', orderid: 'order-number',
  ipaddress: 'ip', ip: 'ip',
  cardnumber: 'card', paymentcard: 'card',
  purchaseamount: 'amount',
};

export const normaliseKey = (key: string): string => key.toLowerCase().replace(/[^a-z0-9]/g, '');

export function fieldKind(key: string | undefined): Kind | undefined {
  return key === undefined ? undefined : RULES[normaliseKey(key)];
}
