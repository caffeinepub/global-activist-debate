# Specification

## Summary
**Goal:** Fix profile icon visibility and replace all avatar displays with simple letter-in-circle design.

**Planned changes:**
- Fix profile icon button not showing in header for authenticated users
- Replace all avatar displays with letter-in-circle showing first letter of username on colored background
- Remove AvatarBuilder component from ProfileSetupModal and ProfileEditModal
- Remove avatar-related fields from UserProfile data model in backend

**User-visible outcome:** Users see a profile icon in the header and all user avatars display as a simple letter in a colored circle throughout the application, with no avatar customization options.
