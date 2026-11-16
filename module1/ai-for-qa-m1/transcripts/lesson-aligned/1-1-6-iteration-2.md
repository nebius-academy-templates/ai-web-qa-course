# Iteration 2 (example output)

**Prompt:** `Generate functional test cases for TechShop's Product Search feature. Include positive, negative, and boundary test scenarios.`

```
Positive
| Scenario | Expected result |
| Search for a valid phone model | Matching phones are listed |
| Search with a partial keyword | Phones containing the keyword are listed |
| Search in a different letter case | Same results as the original case |

Negative
| Scenario | Expected result |
| Search for a model that does not exist | "No products found" message |
| Submit an empty search | A prompt to enter a search term |

Boundary
| Scenario | Expected result |
| Search with a single character | Results or a minimum-length message |
| Search with the maximum allowed length | Search runs without error |
```

**Reviewer's gaps:** no priorities, no test data, no security scenarios.
