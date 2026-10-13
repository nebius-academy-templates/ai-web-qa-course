# Iteration 3 (example output)

**Prompt:** the iteration 3 prompt from the lesson.

```
| ID | Scenario | Test data | Expected result | Priority |
| TC-01 | Valid phone search | "iPhone 15" | iPhone 15 variants are listed | High |
| TC-02 | Partial keyword | "Galax" | Galaxy phones are listed | Medium |
| TC-03 | Case insensitivity | "SAMSUNG" | Same results as "samsung" | Medium |
| TC-04 | No match | "zzzzphone" | "No products found" message | High |
| TC-05 | Empty input | (blank) | Prompt to enter a search term | Medium |
| TC-06 | Single character | "a" | Results or minimum-length message | Low |
| TC-07 | Special characters | "@#$%" | No error, no results message | Medium |
| TC-08 | SQL injection | `' OR 1=1 --` | Treated as text, no data leak | High |
| TC-09 | Script injection | `<script>alert(1)</script>` | Escaped, nothing executes | High |
| TC-10 | Oversized input | 5,000 characters | Rejected or truncated, no crash | Medium |
```

All five columns present, security cases present, happy path and injection marked High. Good enough to use.
