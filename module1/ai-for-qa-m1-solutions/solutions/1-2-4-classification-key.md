# 1.2.4 Classify, treat and verify a customer record: reference key

Reference masked record: `1-2-4-masked-record.json` (same folder). The scanner's output on `customer-record.json` matches it on keys, types and shapes (`tools/compare-masked.ts` checks this), though not on the literal fake values, which are arbitrary by design.

Downstream task the record is prepared for: Claude helps write assertions for an order-confirmation test that checks the **email format**, the **order number** and the **purchase amount**. That task decides what must keep its shape.

## Classification and treatment (16 fields)

| Field | Category | Treatment | Reason tied to the task |
| --- | --- | --- | --- |
| customerId | indirect | mask | Not asserted on; masking keeps the `CUST-` plus digits shape. Delete is equally defensible. |
| firstName | direct | mask | Not asserted on. Delete is stricter and acceptable. |
| lastName | direct | mask | Same. |
| email | direct | **mask** | The test asserts on email format, so it must stay a valid email: `testuser_301@example.com`. Nulling would destroy the format the test needs. |
| phone | direct | mask | Not asserted on; keeps the E.164 shape. |
| address | direct | mask | Not asserted on (see ruling below). |
| city | indirect | mask | Alone harmless, but with address and postcode it narrows to a household. |
| state | clean | keep | A US state does not identify a person. |
| postalCode | indirect | mask | Combines with city and address. |
| dateOfBirth | direct | mask | See ruling below. |
| nationalId | direct | mask | The test never touches it; `987-65-4321` is in the range never issued. Delete is stricter. |
| accountNumber | indirect | mask | See ruling below. Same-length digits. |
| ipAddress | indirect | mask | Re-identifies with application logs; a documentation-range IP keeps the shape. |
| orderNumber | indirect | **mask** | The test asserts on it, so it must stay `ORD-` plus six digits. |
| purchaseAmount | sensitive | **mask** | The test asserts on it, so it must stay a **number** (not a string, not a placeholder). |
| orderDate | clean | keep | A date alone does not identify anyone. |

## (c) Rulings on the disputed fields **[SME CHECK]**

I follow the lesson text, not the older table, because the lessons are what learners read before they are graded.

**dateOfBirth: direct identifier.**
- The lessons say so twice: 1.2.1 lists "dates of birth" under direct identifiers, and the 1.2.3 category table lists "date of birth" among direct identifiers.
- The grader prompt currently lists it as a sensitive attribute, so the grader and the lesson contradict each other.
- Practical impact is small, because the treatment is the same (mask) either way. The grader prompt already treats the "ambiguous" fields as Partial at most, never Weak. Recommend editing the grader key to match the lesson. Accept "sensitive attribute" if the learner gives a reason.

**address: direct identifier (primary), "sensitive attribute: precise location" accepted as a defensible variant.**
- A street address identifies a household on its own, so it belongs with direct identifiers. The lesson also lists "precise location" under sensitive attributes, which is why the variant is reasonable.
- Either way the treatment is identical. The grader already accepts the variant as Partial at most.

**accountNumber (not in the brief, found while checking): indirect identifier per the lesson, direct per the grader key.**
- The 1.2.3 category table lists "account number" under **indirect** identifiers. The grader prompt lists it under direct.
- Again no impact on treatment (mask). Recommend aligning the grader key to the lesson and accepting either with a reason.

The grader threshold element (1) says "firstName, lastName, email, phone, nationalId, accountNumber, address are direct identifiers and are masked or deleted". That wording works unchanged: what the grader checks is that those seven are **masked or deleted**, not which category word the learner uses.

## (d) Is "Mask" genuinely right for 14 of 16 fields?

**Partly. The count is fine, but Mask is not the best treatment for all 14.**
- Mask is **required** for the three fields the test asserts on (email, orderNumber, purchaseAmount): they must keep their shape.
- For the other 11 (customerId, firstName, lastName, phone, address, city, postalCode, dateOfBirth, nationalId, accountNumber, ipAddress) the test never touches them, so **Delete** is stricter and fits the lesson's rule "delete what the LLM does not need". The task also says "a field the test never touches can be deleted".
- The practice asks learners to keep "the format of every field", which is why the reference record masks all 14 and keeps the original 16 keys.
- **Anonymize** does not really apply to a single record. Anonymization is a dataset-level technique (lesson: research, analytics, sharing datasets), so it should not be marked as the expected answer for any field here.
- Grading: accept Mask or Delete for the 11 untouched fields with a reason. "Mask everything with no reasons" is a Partial, as the grader prompt already says.

## (b) Model answers to the four verification checks (on the reference record)

1. **Are all direct identifiers replaced?** Pass. firstName, lastName, email, phone, address, dateOfBirth and nationalId all carry fictional values, and none of the originals survives.
2. **Are all indirect identifiers replaced or removed?** Pass. customerId, city, postalCode, accountNumber, ipAddress and orderNumber are all replaced.
3. **Is the structure and format needed for the task preserved?** Pass. `email` is a valid email, `orderNumber` is `ORD-` plus six digits, `purchaseAmount` is still a JSON number (`187.5`, not `"[REDACTED]"`), and all 16 keys are present in the original order.
4. **Could the individual be re-identified from what remains?** Pass with a caveat. What remains is `state: WA` and `orderDate: 2025-02-18`, which do not identify anyone, and every other value is fictional. The caveat is that this holds for one record. In a dataset, any original value left in a second place (a log line, a note) would re-link the person, which is why masking has to be consistent.

## Typical misses in Claude's own masking [RUN CHECK]

From the grader prompt, to be confirmed against a captured run: `ipAddress` or `orderNumber` left unchanged; `purchaseAmount` turned into a string or a placeholder; city and postal code kept while the address is masked (partial re-identification); date of birth replaced inconsistently; a field dropped without saying so. A learner who reports that Claude's version passed all four checks must still name the deciding fields for each check.
