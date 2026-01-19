# EV Charging Station Aggregator Platform
## Project Proposal for Armenia

---

## Executive Summary

We propose to build a comprehensive EV charging station aggregator platform for Armenia, unifying multiple charging networks (EcoCars, EVAN, iCharge, Amperion, ChargeNet) into a single mobile and web application. The platform will feature real-time station availability, seamless payment processing, and native mobile apps for iOS and Android.

**Current Status**: Backend infrastructure is 95% complete. Frontend applications require full development.

---

## Project Scope

### What We Will Deliver

| Component | Description |
|-----------|-------------|
| **React Native Mobile App** | iOS & Android native apps with maps, charging sessions, wallet |
| **React Web Application** | Progressive Web App for browser access |
| **Admin Dashboard** | Complete management interface for operators |
| **Backend API** | ✅ Already 95% complete - production-ready |
| **Partner Integrations** | Real API connections with charging networks |
| **Payment Integration** | iDram, Telcell, and card processing |

---

## Timeline Overview

### Total Estimated Duration: 16-20 Weeks

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: UI/UX Design                    │████████│     4 weeks           │
├─────────────────────────────────────────────────────────────────────────────┤
│  PHASE 2: React Native Mobile App         │████████████████│  6-7 weeks    │
├─────────────────────────────────────────────────────────────────────────────┤
│  PHASE 3: Partner Integrations            │████████████│    4-5 weeks      │
├─────────────────────────────────────────────────────────────────────────────┤
│  PHASE 4: Testing & Launch                │████████│     2-3 weeks         │
└─────────────────────────────────────────────────────────────────────────────┘

Note: Phases 2 and 3 can run in parallel, reducing total time.
```

---

## Detailed Phase Breakdown

### PHASE 1: UI/UX Design (4 weeks)

**Objective**: Create modern, intuitive interface designs for all platforms

#### Week 1-2: Research & Wireframing
- [ ] Competitive analysis (ChargePoint, Electromaps, PlugShare)
- [ ] User journey mapping
- [ ] Information architecture
- [ ] Low-fidelity wireframes for all screens
- [ ] Client review & feedback

#### Week 3-4: Visual Design
- [ ] Brand identity refinement (colors, typography, icons)
- [ ] High-fidelity mockups (Figma)
- [ ] Interactive prototypes
- [ ] Design system documentation
- [ ] Component library specifications
- [ ] Client approval

**Deliverables**:
- Complete UI kit in Figma
- 25+ screen designs (mobile + web)
- Interactive prototype
- Design system documentation
- Asset export specifications

**Screens to Design**:
```
Mobile App:
├── Onboarding (3 slides)
├── Authentication
│   ├── Login
│   ├── Register
│   ├── OTP Verification
│   └── Forgot Password
├── Main Navigation
│   ├── Map (home screen)
│   ├── Station List View
│   ├── Active Session
│   ├── Favorites
│   └── Profile
├── Station Details
│   ├── Overview
│   ├── Connectors list
│   └── Reviews
├── Charging Flow
│   ├── Start Charging
│   ├── Session Progress
│   └── Session Complete
├── Wallet
│   ├── Balance
│   ├── Top-up
│   └── Transaction History
└── Settings
    ├── Language
    ├── Notifications
    └── Support
```

---

### PHASE 2: React Native Mobile App (6-7 weeks)

**Objective**: Build native iOS and Android apps with clean architecture

#### Week 1-2: Project Setup & Core Infrastructure
- [ ] React Native project initialization (Expo or bare workflow)
- [ ] Navigation setup (React Navigation 6)
- [ ] State management (Zustand/Redux Toolkit)
- [ ] API client with TypeScript
- [ ] Authentication flow implementation
- [ ] Secure token storage

#### Week 3-4: Map & Station Features
- [ ] Interactive map (react-native-maps)
- [ ] Geolocation services
- [ ] Station markers with clustering
- [ ] Station list view
- [ ] Station detail screen
- [ ] Connector status display
- [ ] Favorites functionality
- [ ] Search & filters

#### Week 5-6: Charging & Wallet Features
- [ ] Start charging flow
- [ ] Real-time session monitoring (WebSocket)
- [ ] Session history
- [ ] Wallet balance display
- [ ] Top-up flow (payment gateway integration)
- [ ] Transaction history
- [ ] Push notifications (Firebase)

#### Week 7: Polish & Platform-specific
- [ ] iOS specific optimizations
- [ ] Android specific optimizations
- [ ] Animations & transitions
- [ ] Offline mode handling
- [ ] Error states & loading states
- [ ] Accessibility compliance
- [ ] Multi-language support (hy, ru, en)

**Tech Stack**:
```
Framework:     React Native 0.73+ / Expo SDK 50+
Language:      TypeScript 5.x
Navigation:    React Navigation 6
State:         Zustand 4.x
Maps:          react-native-maps (Google Maps)
WebSocket:     Socket.io-client
HTTP Client:   Axios + React Query
Storage:       react-native-mmkv
Auth:          react-native-keychain
Push:          Firebase Cloud Messaging
Animations:    Reanimated 3
UI Library:    React Native Paper / NativeWind
```

**Architecture**:
```
src/
├── app/                    # App entry, providers
├── screens/               # Screen components
├── components/            # Reusable UI components
│   ├── common/           # Buttons, inputs, cards
│   ├── map/              # Map-related components
│   ├── station/          # Station components
│   └── session/          # Session components
├── navigation/           # Navigation configuration
├── services/             # API, WebSocket, storage
├── store/                # Zustand stores
├── hooks/                # Custom hooks
├── utils/                # Helpers, constants
├── i18n/                 # Translations
└── types/                # TypeScript types
```

---

### PHASE 3: Partner Integrations (4-5 weeks)

**Objective**: Connect to real charging network APIs

#### Week 1-2: OCPI 2.2 Implementation
- [ ] EVAN network integration (OCPI 2.2 protocol)
- [ ] Location sync (stations, connectors)
- [ ] Real-time status updates
- [ ] Session management (CDRs)
- [ ] Tariff information sync

#### Week 3: Custom API Integrations
- [ ] EcoCars REST API integration
- [ ] iCharge integration (if API available)
- [ ] Amperion integration (if API available)
- [ ] ChargeNet integration (if API available)

#### Week 4-5: Payment Gateway Integration
- [ ] iDram payment integration
- [ ] Telcell payment integration
- [ ] Card payment (via local bank gateway)
- [ ] Receipt generation (PDF)
- [ ] SMS notifications (Twilio/local provider)

**Partner Integration Requirements**:

| Partner | Protocol | Status | Required From Partner |
|---------|----------|--------|----------------------|
| EVAN | OCPI 2.2 | Ready to integrate | API credentials, endpoint URL |
| EcoCars | Custom REST | Ready to integrate | API documentation, credentials |
| iCharge | TBD | Need contact | API access |
| Amperion | TBD | Need contact | API access |
| ChargeNet | TBD | Need contact | API access |

---

### PHASE 4: Testing & Launch (2-3 weeks)

#### Week 1: Quality Assurance
- [ ] Unit testing (Jest, React Native Testing Library)
- [ ] Integration testing
- [ ] E2E testing (Detox)
- [ ] Performance testing
- [ ] Security audit
- [ ] Load testing (backend)

#### Week 2: Beta Testing
- [ ] Internal beta testing
- [ ] TestFlight (iOS) deployment
- [ ] Google Play Internal Testing
- [ ] Bug fixes and optimizations
- [ ] User feedback collection

#### Week 3: Production Launch
- [ ] App Store submission
- [ ] Google Play submission
- [ ] Production deployment
- [ ] Monitoring setup (Sentry, analytics)
- [ ] Launch support

---

## Team Requirements

### Recommended Team Composition

| Role | Count | Responsibility |
|------|-------|----------------|
| **UI/UX Designer** | 1 | Full-time during Phase 1, part-time after |
| **React Native Developer (Senior)** | 1 | Mobile app development lead |
| **React Native Developer (Mid)** | 1 | Mobile app development |
| **Backend Developer** | 1 | API completion, partner integrations |
| **QA Engineer** | 1 | Testing, quality assurance |
| **Project Manager** | 1 | Coordination, client communication |

**Total Team**: 6 people (can be optimized to 4-5 with senior roles)

---

## Budget Estimation

### Development Costs by Phase

| Phase | Duration | Estimated Hours | Budget Range (USD) |
|-------|----------|-----------------|-------------------|
| Phase 1: UI/UX Design | 4 weeks | 160 hrs | $8,000 - $12,000 |
| Phase 2: Mobile App | 7 weeks | 560 hrs | $35,000 - $50,000 |
| Phase 3: Integrations | 5 weeks | 400 hrs | $25,000 - $35,000 |
| Phase 4: Testing & Launch | 3 weeks | 240 hrs | $12,000 - $18,000 |
| **TOTAL** | **16-20 weeks** | **1,360 hrs** | **$80,000 - $115,000** |

### Additional Costs (First Year)

| Item | Cost (USD/year) |
|------|-----------------|
| Apple Developer Account | $99 |
| Google Play Developer Account | $25 (one-time) |
| Cloud Infrastructure (AWS/GCP) | $500 - $1,500/month |
| Firebase (Push, Analytics) | $0 - $500/month |
| SMS Gateway | $200 - $500/month |
| Sentry (Error Monitoring) | $26 - $80/month |
| Google Maps API | $200 - $500/month |

**Estimated Monthly Operating Cost**: $1,000 - $3,000

---

## Risk Assessment

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Partner API delays | High | Start with mock data, parallel development |
| App Store rejection | Medium | Follow guidelines, allow review buffer |
| Payment gateway delays | High | Alternative gateway backup, phased rollout |
| OCPI compatibility issues | Medium | Thorough testing with partner sandbox |

### Business Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Partner agreement delays | High | Early engagement, legal support |
| Competitive market entry | Medium | Fast-to-market approach, unique features |
| User adoption | Medium | Marketing plan, incentive programs |

---

## What's Already Built (Asset Value)

The current codebase represents significant development investment:

### Backend API (95% Complete) - Estimated Value: $25,000-35,000
- ✅ Full authentication system (JWT, OTP)
- ✅ Station & connector management
- ✅ Charging session management
- ✅ Wallet & transaction system
- ✅ OCPP 1.6J charge point integration
- ✅ WebSocket real-time updates
- ✅ PostgreSQL + PostGIS database
- ✅ Redis caching layer
- ✅ Docker deployment ready

### Admin Panel (60% Complete) - Estimated Value: $8,000-12,000
- ✅ Dashboard with live statistics
- ✅ Station management CRUD
- ✅ Session monitoring
- ✅ Transaction history
- ⚠️ User management (needs completion)

### Infrastructure - Estimated Value: $5,000-8,000
- ✅ Database schema with migrations
- ✅ Test data seeders
- ✅ Docker Compose setup
- ✅ CPO adapter architecture

**Total Existing Asset Value**: ~$38,000 - $55,000

---

## Deliverables Summary

### Phase 1 Deliverables
- [ ] Complete UI/UX design system
- [ ] Figma files with all screens
- [ ] Interactive prototype
- [ ] Design documentation

### Phase 2 Deliverables
- [ ] React Native source code (iOS & Android)
- [ ] App binaries for testing
- [ ] Technical documentation
- [ ] Deployment guides

### Phase 3 Deliverables
- [ ] Partner integration modules
- [ ] Payment gateway integration
- [ ] SMS notification system
- [ ] Integration test reports

### Phase 4 Deliverables
- [ ] Published iOS app (App Store)
- [ ] Published Android app (Google Play)
- [ ] Production deployment
- [ ] Monitoring dashboards
- [ ] User documentation
- [ ] Admin documentation

---

## Success Metrics

### Launch Metrics (First 3 Months)
- App downloads: 1,000+
- Active users: 500+
- Charging sessions: 200+
- App Store rating: 4.0+

### Growth Metrics (First Year)
- Active users: 5,000+
- Monthly charging sessions: 1,000+
- Partner networks integrated: 4+
- Revenue from transactions: Break-even

---

## Next Steps

1. **Review & Approve Proposal** - Client feedback and approval
2. **Sign Agreement** - Contract and payment terms
3. **Kick-off Meeting** - Team introduction, timeline confirmation
4. **Design Sprint** - Begin Phase 1 immediately
5. **Partner Outreach** - Start API access negotiations in parallel

---

## Contact & Support

For questions about this proposal, please contact:

**Project Lead**: [Your Name]
**Email**: [your.email@company.com]
**Phone**: [+374 XX XXX XXX]

---

*This proposal is valid for 30 days from the date of issue.*

**Prepared by**: EV Charging Armenia Development Team
**Date**: January 2026
**Version**: 1.0
