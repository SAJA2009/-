# Security Specification for Student Progress Tracking

## 1. Data Invariants
- A user profile must match the authenticated user's UID.
- Quiz attempts must belong to the authenticated user.
- Problem attempts must belong to the authenticated user.
- Areas of difficulty must belong to the authenticated user.
- Users cannot change their `uid`, `email`, or `role` once set (except maybe admin, but we don't have admins yet).
- Timestamps must be server-generated.

## 2. Dirty Dozen Payloads (Attempted violations)
1. **Identity Spoofing**: User A trying to create a `UserProfile` with User B's UID.
2. **Identity Spoofing**: User A trying to read User B's `quiz_attempts`.
3. **Identity Spoofing**: User A trying to write a `quiz_attempt` into User B's subcollection.
4. **Identity Spoofing**: User A trying to modify User B's `UserProfile`.
5. **Privilege Escalation**: User A trying to change their role from 'student' to 'teacher' in `UserProfile`.
6. **Data Integrity**: User A trying to set a future `timestamp` for a `quiz_attempt`.
7. **Resource Poisoning**: User A trying to inject a 1MB string into the `subject` field of a `quiz_attempt`.
8. **Shadow Field**: User A trying to add an `isAdmin: true` field to their `UserProfile`.
9. **Orphaned Write**: User A trying to create a `quiz_attempt` without a `userId` field matching the path.
10. **Bypass Validation**: User A trying to set `score` to -5 or 999999 in `QuizAttempt`.
11. **Bypass Validation**: User A trying to set `totalQuestions` to 0 or -1.
12. **State Shortcutting**: User A trying to update an immutable `createdAt` field.

## 3. Test Runner (Draft rules)
The rules will be written to `firestore.rules` and tested via logic analysis.
