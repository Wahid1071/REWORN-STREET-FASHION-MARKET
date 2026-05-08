# Security Specification: Luminary Store

## Data Invariants
- A `Product` must have a `name`, `price`, and `category`.
- A `User` can only modify their own profile.
- `Products` are read-only for public customers, manageable only by admins.
- `Categories` are read-only for everyone.
- `Orders` belong to the user who created them.
- All documents must have valid IDs.

## The Dirty Dozen (Test Payloads)

1. **Identity Spoofing**: Attempting to create a user profile for someone else.
2. **Price Manipulation**: Attempting to update a product price as a customer.
3. **Ghost Categories**: Attempting to create a new category as a customer.
4. **Order Forgery**: Attempting to read another user's orders.
5. **Admin Escalation**: Attempting to set `role: 'admin'` on your own user profile.
6. **Stock Poisoning**: Injecting a 1MB string into the `stock` field.
7. **Invalid ID**: Using `../../system` as a product ID.
8. **Shadow Field**: Creating a product with an unapproved field `isHidden: true`.
9. **Timestamp Spoofing**: Setting a future `createdAt` date on an order.
10. **Blind Query Scraping**: Attempting to list all users.
11. **PII Leak**: Reading private user emails without authorization.
12. **Recursive Cost Attack**: Sending 1.5KB junk document IDs.

## Test Runner (TDD)
I will implement `firestore.rules` to reject all the above cases.
