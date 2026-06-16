# Accessibility guidance for GalaxiaStarCommunicators

This repository now includes a small, focused set of accessibility utilities and a demo test page to help make the app usable with NVDA, VoiceOver and JAWS. The files added and their purposes:

- styles/visually-hidden.css — utility .sr-only for screen-reader-only text and live-region container.
- styles/focus.css — visible focus styles (do not remove outlines; style them clearly).
- js/announce.js — small helper to post messages to an aria-live region and example onNewMessage usage.
- js/focus-trap.js — small focus-trap helper for modal/dialog focus management.
- a11y/index.html — a lightweight a11y test page demonstrating skip link, landmarks, message list, live-region, controls, and usage of the CSS/JS above.

How to use

1. Open a11y/index.html in a browser (preferably served over a local server) and test with NVDA (Firefox/Chrome), VoiceOver (Safari), or JAWS.
2. Use the "Incoming message" button on the test page to simulate new message arrivals and verify announcements are read by the screen reader.
3. Open the "Open modal" button to test the focus-trap behavior in the modal.

Suggested integration steps into the main app

- Import the CSS utilities into your main CSS bundle (copy or @import) so .sr-only and focus styles are available globally.
- Add the live-region element (id="live-region") near the top of the document (body) so announceForScreenReader works anywhere.
- Replace demo elements in a11y/index.html with your real components, keeping the same semantic patterns: landmarks, ul/li for message lists, role attributes when appropriate, labelled buttons, etc.

Testing checklist (quick)

- Keyboard-only: can you tab through controls in a logical order? Are focus indicators visible?
- Screen readers: NVDA+Firefox, JAWS+Chrome/IE, VoiceOver+Safari — do incoming messages get announced? Does the modal trap focus and return focus to the opener?
- Automated: add axe/pa11y/Lighthouse checks to CI to catch regressions.

If you'd like, I can now:
- Open a PR with these changes (but you asked for no branches, so I committed directly to the default branch as requested),
- Or expand the a11y demo into separate component files that match your project structure.

If you want any edits to the files I added (different paths, other wording, or more examples), tell me and I'll update them.
