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
| **Admin Dashboard** | Using existing static framework (no custom design needed) |
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
│  PHASE 2: React Native Mobile + Web App   │████████████████│  6-7 weeks    │
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

**Objective**: Create modern, intuitive interface designs for Mobile App + Web Application

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
- 30+ screen designs (mobile app + web responsive)
- Interactive prototype
- Design system documentation
- Asset export specifications

**Screens to Design**:
```
Mobile App (20+ screens):
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

Web Application (10+ screens):
├── Landing Page
├── Map View (full-screen)
├── Station Details Modal
├── Login / Register
├── User Dashboard
├── Wallet & Transactions
├── Session History
└── Profile Settings
```

---

### PHASE 2: React Native Mobile + Web App (6-7 weeks)

**Objective**: Build native iOS/Android apps and responsive web application with clean architecture

#### Week 1-2: Project Setup & Core Infrastructure
- [ ] React Native project initialization (Expo or bare workflow)
- [ ] Web app setup (React + Vite)
- [ ] Shared component library
- [ ] Navigation setup (React Navigation 6)
- [ ] State management (Zustand/Redux Toolkit)
- [ ] API client with TypeScript
- [ ] Authentication flow implementation
- [ ] Secure token storage

#### Week 3-4: Map & Station Features
- [ ] Interactive map (react-native-maps / Leaflet for web)
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
- [ ] Web responsive design
- [ ] Animations & transitions
- [ ] Offline mode handling
- [ ] Error states & loading states
- [ ] Accessibility compliance
- [ ] Multi-language support (hy, ru, en)

**Tech Stack**:
```
Mobile:
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

Web:
  Framework:     React 18 + Vite
  Styling:       TailwindCSS
  Maps:          Leaflet / Google Maps
  State:         Zustand (shared with mobile)
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
- [ ] Web app deployment
- [ ] Production deployment
- [ ] Monitoring setup (Sentry, analytics)
- [ ] Launch support

---

## Team Structure

### Core Team (3 People)

| Role | Responsibility | Allocation |
|------|----------------|------------|
| **UI/UX Designer** | Mobile + Web design, design system, prototypes | Full-time Phase 1, part-time support Phase 2-4 |
| **Full-Stack Developer** | React Native, React Web, backend integrations, payments | Full-time Phase 2-4 |
| **QA Engineer + Project Manager** | Testing, quality assurance, client communication, coordination | Part-time Phase 1-2, full-time Phase 3-4 |

---

## Budget Estimation (Armenian Market Rates)

### Monthly Salary Rates (AMD/USD)

| Role | Monthly Rate (AMD) | Monthly Rate (USD) |
|------|-------------------|-------------------|
| UI/UX Designer (Mid-Senior) | 500,000 - 700,000 | $1,250 - $1,750 |
| Full-Stack Developer (Senior) | 800,000 - 1,200,000 | $2,000 - $3,000 |
| QA + PM (Combined) | 500,000 - 800,000 | $1,250 - $2,000 |

*Based on [Glassdoor Armenia](https://www.glassdoor.com/Salaries/yerevan-armenia-software-developer-salary-SRCH_IL.0,15_IM1216_KO16,34.htm), [Salaries.am](https://salaries.am/), and [Jobicy Armenia](https://jobicy.com/salaries/am/software-developer) data for 2025-2026*

---

### Development Costs by Phase

| Phase | Duration | Team Allocation | Cost (AMD) | Cost (USD) |
|-------|----------|-----------------|------------|------------|
| **Phase 1: UI/UX Design** | 4 weeks | Designer (100%), Dev (25%), QA/PM (25%) | 2,800,000 | $7,000 |
| **Phase 2: Mobile + Web** | 7 weeks | Designer (25%), Dev (100%), QA/PM (50%) | 5,600,000 | $14,000 |
| **Phase 3: Integrations** | 5 weeks | Dev (100%), QA/PM (75%) | 4,000,000 | $10,000 |
| **Phase 4: Testing & Launch** | 3 weeks | Dev (50%), QA/PM (100%) | 2,000,000 | $5,000 |

---

### Total Project Budget

| Item | Cost (AMD) | Cost (USD) |
|------|------------|------------|
| **Development (16-20 weeks)** | 14,400,000 - 18,000,000 | $36,000 - $45,000 |
| **Contingency Buffer (15%)** | 2,160,000 - 2,700,000 | $5,400 - $6,750 |
| **Tools & Licenses** | 400,000 | $1,000 |
| **TOTAL PROJECT COST** | **16,960,000 - 21,100,000** | **$42,400 - $52,750** |

---

### Payment Schedule

| Milestone | Payment | Amount (USD) |
|-----------|---------|--------------|
| Contract Signing | 30% upfront | $12,720 - $15,825 |
| Design Approval (Week 4) | 20% | $8,480 - $10,550 |
| App Feature Complete (Week 11) | 30% | $12,720 - $15,825 |
| Launch Complete (Week 16-20) | 20% | $8,480 - $10,550 |

---

### Monthly Operating Costs (Post-Launch)

| Item | Cost (AMD/month) | Cost (USD/month) |
|------|------------------|------------------|
| Cloud Infrastructure (AWS/GCP) | 80,000 - 200,000 | $200 - $500 |
| Firebase (Push, Analytics) | 0 - 80,000 | $0 - $200 |
| SMS Gateway | 40,000 - 120,000 | $100 - $300 |
| Sentry (Error Monitoring) | 10,000 - 30,000 | $25 - $75 |
| Google Maps API | 40,000 - 120,000 | $100 - $300 |
| **Total Monthly** | **170,000 - 550,000** | **$425 - $1,375** |

**One-time costs:**
- Apple Developer Account: $99/year
- Google Play Developer Account: $25 (one-time)

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

### Backend API (95% Complete)
**Estimated Value: 4,000,000 - 6,000,000 AMD ($10,000 - $15,000)**

- ✅ Full authentication system (JWT, OTP)
- ✅ Station & connector management
- ✅ Charging session management
- ✅ Wallet & transaction system
- ✅ OCPP 1.6J charge point integration
- ✅ WebSocket real-time updates
- ✅ PostgreSQL + PostGIS database
- ✅ Redis caching layer
- ✅ Docker deployment ready

### Admin Panel (60% Complete)
**Estimated Value: 1,600,000 - 2,400,000 AMD ($4,000 - $6,000)**

- ✅ Dashboard with live statistics
- ✅ Station management CRUD
- ✅ Session monitoring
- ✅ Transaction history

### Infrastructure
**Estimated Value: 800,000 - 1,200,000 AMD ($2,000 - $3,000)**

- ✅ Database schema with migrations
- ✅ Test data seeders
- ✅ Docker Compose setup
- ✅ CPO adapter architecture

**Total Existing Asset Value**: 6,400,000 - 9,600,000 AMD (~$16,000 - $24,000)

---

## Deliverables Summary

### Phase 1 Deliverables
- [ ] Complete UI/UX design system (Mobile + Web)
- [ ] Figma files with all screens (30+)
- [ ] Interactive prototype
- [ ] Design documentation

### Phase 2 Deliverables
- [ ] React Native source code (iOS & Android)
- [ ] React Web application source code
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
- [ ] Deployed web application
- [ ] Production deployment
- [ ] Monitoring dashboards
- [ ] User documentation

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
**Version**: 2.0

---

## Sources

Salary data based on:
- [Glassdoor Armenia Software Developer Salaries](https://www.glassdoor.com/Salaries/yerevan-armenia-software-developer-salary-SRCH_IL.0,15_IM1216_KO16,34.htm)
- [Glassdoor Armenia UI/UX Designer Salaries](https://www.glassdoor.com/Salaries/yerevan-armenia-ui-ux-designer-salary-SRCH_IL.0,15_IM1216_KO16,30.htm)
- [Glassdoor Armenia QA Engineer Salaries](https://www.glassdoor.com/Salaries/yerevan-armenia-qa-engineer-salary-SRCH_IL.0,15_IM1216_KO16,27.htm)
- [Salaries.am](https://salaries.am/)
- [Jobicy Armenia](https://jobicy.com/salaries/am/software-developer)
