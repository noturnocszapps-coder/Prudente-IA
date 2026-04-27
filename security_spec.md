# Security Specification - Prudente IA

## Data Invariants
1. A user can only read and write their own profile (except admins).
2. Users cannot change their own `role` or `isVip` status.
3. Chat sessions and messages can only be accessed by the session owner or admin.
4. Alerts, Daily Tips, and Products can only be created, updated, or deleted by admins.
5. All IDs must be valid (string, reasonably sized, alphanumeric).
6. Timestamps must use `request.time`.

## The Dirty Dozen Payloads (Rejection Tests)
1. **Identity Spoofing**: Attempt to create a user profile with a different `uid` than the authenticated user.
2. **Privilege Escalation**: Attempt to set `role: 'admin'` or `isVip: true` on user registration.
3. **Ghost Update**: Attempt to update a user's `isVip` status directly.
4. **Orphaned Message**: Attempt to create a message in a chat session that doesn't belong to the user.
5. **Collection Scraping**: Attempt to list all users without being an admin.
6. **Bypass Master Gate**: Attempt to write to `chats/{chatId}/messages` without verifying ownership of `chats/{chatId}`.
7. **Resource Poisoning**: Injection of 1MB strings into alert titles or product names.
8. **Unauthorized Admin Write**: Attempt to create an alert as a non-admin.
9. **Timestamp Manipulation**: Providing a client-side `createdAt` date instead of `request.time`.
10. **ID Poisoning**: Using a 2KB junk string as a document ID for an alert.
11. **Malicious Role Update**: Admin attempting to update a user role to an invalid string.
12. **PII Leak**: Non-admin attempting to fetch a user document that doesn't belong to them.

## Test Runner (Draft Plan)
A `firestore.rules.test.ts` will verify these assertions.
