# Specification

## Summary
**Goal:** Allow users to start conversations using usernames instead of Principal IDs.

**Planned changes:**
- Replace Principal ID input with username input in StartConversationModal
- Add backend query function to look up Principal ID by username with case-insensitive matching
- Create React Query hook for username-to-Principal lookup with proper state handling
- Update form submission to resolve username to Principal ID before creating conversation

**User-visible outcome:** Users can start new conversations by entering a profile name instead of needing to know the other user's Principal ID.
