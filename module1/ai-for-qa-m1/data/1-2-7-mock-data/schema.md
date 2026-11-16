# Customer records schema (practice 1.2.7)

| Field | Requirement |
| --- | --- |
| First Name | Text |
| Last Name | Text |
| Email | Valid email format and unique |
| Age | Integer between 18 and 80 |
| Country | Must be one of: United States, Canada, United Kingdom, Australia |
| Monthly Spend | Number between 50 and 1000 |

Notes

- Ranges are inclusive (18 and 80 are valid ages, 50 and 1000 are valid spends).
- "Unique" applies across the whole table, not per country.
- All values must be fictional. Use `example.com`-style domains for emails.
