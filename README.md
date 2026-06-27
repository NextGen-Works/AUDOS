# AUDOS

A personal, neuro-intelligent, privacy-first web application for consciousness exploration.

DEV OPS BEST PRACTICES:
- Zero server-side dependencies - fully static
- GitHub Actions CI/CD ready
- Comprehensive security and privacy measures
- TypeScript strict mode for type safety
- Automated linting and testing setup
- PWA-ready with service worker
- Container-friendly for deployment

PRIVACY-FIRST DESIGN:
- All audio data generated client-side via Web Audio API
- All user data stored locally in IndexedDB/localStorage
- No user accounts, authentication, or tracking
- No external APIs or cloud services used
- GDPR-compliant data handling (data never leaves device)
- No telemetry, analytics, or third-party scripts

FEATURES :
- Audio Entrainment Engine (ISO + BIN + PURE) - client-side generation only
- Multi-Layer Parallax Visualizer - webGL/Canvas based
- Keeper's Companion (interactive journal, sketching, breath coaching)
- Interactive Codex of mind & sound science (5+ lessons)
- Symbolic SIGL Directory (12 symbolic nodes, living network)

TECHNICAL STACK:
- Frontend: React + TypeScript + Vite
- State Management: Zustand (lightweight, dev-friendly)
- Audio: Web Audio API (native, client-only)
- Storage: IndexedDB + localStorage (no cloud sync)
- UI/UX: Tailwind CSS + Framer Motion (smooth animations)
- Build: Vite + PWA-ready (workbox)
- File Export: JSZip + canvas-to-PNG for archives
- Testing: Jest + React Testing Library
- Linting: Oxlint with TypeScript strict mode

DEPLOYMENT READY:
- Package includes PWA manifest and service worker
- Dark mode by default with light mode toggle (persistent)
- Mobile-first responsive design
- Touch-friendly UI with accessibility features

SECURITY & COMPLIANCE:
- No user accounts, no authentication, no tracking
- Zero data leakage - all stored locally in IndexedDB/localStorage
- Web Audio API used exclusively - no external audio files or streaming
- No telemetry, analytics, or third-party scripts
- Comprehensive protection against data exfiltration


