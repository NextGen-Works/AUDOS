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

FEATURES (PRIORITIZED):
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

🚀 Build & Deployment Guide
Development Commands
# Start development server
npm run dev

# Open in browser (typically http://localhost:3000)
# Navigate to: https://github.com/yourusername/aud-os (after pushing)
Build for Production
# Build the application
npm run build

# Creates optimized static files in ./dist/
# Files ready for deployment
Testing & Quality Assurance
# Run unit tests
npm run test

# Run tests in watch mode (during development)
npm run test:watch

# Linting for code quality
npm run lint

# Type checking
npx tsc --noEmit
Alternative Commands
# Install additional dependencies if needed
npm install --legacy-peer-deps

# Clean and rebuild
rm -rf node_modules package-lock.json
npm install

# Preview production build
npm run preview
📦 Deployment Options
GitHub Pages
# Deploy to GitHub Pages
npm install -D gh-pages
npm run build

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
Netlify (Recommended)
# Create Netlify account
# Connect repository via GitHub integration
# Configure:
#   Build command: npm run build
#   Publish directory: dist
Vercel (Recommended)
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
Manual Deployment
# Copy files to web server
cp -r dist/* /var/www/aud-os/
# Or your preferred deployment method
🛠️ Development Workflow
Project Setup
# Initial setup
npm install

# Install development tools (optional but recommended)
npm install -D @testing-library/react @testing-library/jest-dom
Git Workflow
# Create feature branch
git checkout -b feature/your-feature

# Stage changes
git add .

# Commit with conventional format
git commit -m "feat: add new feature

- Description
- Related issue: #123"

# Push to GitHub
git push origin feature/your-feature

# Create pull request
# Follow your team's PR guidelines
Branch Strategy
main: Production ready
develop: Integration branch
feature/*: New features
bugfix/*: Bug fixes
*release/: Release candidates
🔍 Troubleshooting & Common Issues
Installation Problems
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force
Build Errors
# Check for TypeScript errors
npm run lint

# Rebuild with TypeScript strict mode
npx tsc --noEmit
Browser Compatibility
# Check supported browsers in package.json
# Modern browsers typically supported
Performance Issues
# Check bundle size
npm run build -- --analyze

# Clear browser cache and reload
Ctrl+Shift+C (or Cmd+Shift+C)
📋 Project Structure Overview
AUD-OS/
├── .github/
│   └── workflows/          # CI/CD pipelines
├── public/
│   ├── manifest.json       # PWA manifest
│   └── service-worker.js   # Offline support
├── src/
│   ├── components/         # React components
│   ├── hooks/              # Custom hooks
│   ├── services/           # Audio engine, storage, API
│   ├── store/              # Zustand stores
│   ├── styles/             # Tailwind CSS
│   ├── utils/              # Helper functions
│   └── App.tsx            # Main application
├── package.json           # Dependencies & scripts
├── README.md              # Documentation
├── .env.example           # Environment variables (empty)
├── .gitignore             # File exclusions
└── .oxlintrc.json         # Linting configuration
🚨 Security & Privacy Guidelines
Local Development
# Never commit sensitive data
echo ".env.local" >> .gitignore
echo "secrets/" >> .gitignore

# Use .env.example for template
# Never commit actual secrets
Privacy Protection
# Audit dependencies for privacy issues
npm audit

# Check for exposed secrets in code
git diff --check

# Regular security scans recommended
🔄 Project Life Cycle
Initial Development
# Create new feature branch
git checkout -b feature/audio-engine

# Work on implementation
# Test locally
# Commit changes
git add src/components/AudioControls.tsx
git commit -m "feat: enhance audio entrainment engine"

# Review and merge
Version Management
# Semantic versioning
# PATCH: Bug fixes, docs
# MINOR: New features
# MAJOR: Breaking changes

# Example commit messages:
git commit -m "fix: resolve audio latency issue"
git commit -m "feat: add sound visualization modes"
git commit -m "refactor: improve code organization"
📈 Monitoring & Maintenance
Local Development Monitoring
# Check server logs
# View console in browser developer tools

# Check network requests
# Use browser dev tools Network tab
Performance Optimization
# Bundle analysis
npm install -D webpack-bundle-analyzer
npm run build -- --analyze

# Monitor build times
# Check CI/CD pipeline status
🤝 Contributing Guidelines
Code Quality
# Follow existing code style
# Use TypeScript strict mode
# Write tests for new features
# Commit with descriptive messages
# Use conventional commit format
Pull Request Process
Create feature branch
Implement changes
Run tests
Update documentation
Create pull request
Code review
Merge to main
📄 License
MIT License

