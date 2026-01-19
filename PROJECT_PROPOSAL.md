# EV Charging Station Aggregator Platform
## Complete Project Proposal - Armenia

---

## Executive Summary

We propose to build a comprehensive EV charging station aggregator platform for Armenia, unifying multiple charging networks (EcoCars, EVAN, iCharge, Amperion, ChargeNet) into a single mobile and web application.

**Current Status**: Backend infrastructure is 95% complete (saves ~$8,000-10,000 in development costs).

---

## Two Development Options

| Option | Timeline | Budget (USD) | Budget (AMD) |
|--------|----------|--------------|--------------|
| **MVP** | 3-4 months | **$12,000** | **4,680,000 ֏** |
| **Full Product** | 6-8 months | **$28,000** | **10,920,000 ֏** |

---

# OPTION 1: MVP (Minimum Viable Product)

## MVP Features

| Feature | Included | Description |
|---------|:--------:|-------------|
| **Mobile App (iOS + Android)** | ✅ | React Native |
| Map with all stations | ✅ | 5 networks on one map |
| Filters | ✅ | By network, connector, power |
| Station details | ✅ | Address, connectors, prices, photos |
| Connector status | ⚠️ | Only for networks with API (EVAN) |
| Navigation to station | ✅ | Opens Google Maps / Waze |
| Registration / Login | ✅ | Phone + password |
| User profile | ✅ | Name, language, settings |
| Favorites | ✅ | Save stations |
| Charging history | ❌ | No |
| Wallet / Payments | ❌ | No |
| Start/Stop charging | ❌ | Deep-link to CPO app |
| Real-time session | ❌ | No |
| Push notifications | ❌ | No |
| **Web Application** | ✅ | Responsive PWA |
| Map view | ✅ | Full-screen map |
| Station search | ✅ | Basic search & filters |
| User account | ✅ | Login, profile |
| **Admin Panel** | ✅ | Basic (static framework) |
| Station list | ✅ | View, edit |
| Users | ✅ | View list |
| Statistics | ⚠️ | Basic (user count, stations) |
| **Backend** | ✅ | Already 95% complete |
| **UI/UX Design** | ✅ | Mobile + Web screens |

---

## MVP: Timeline & Budget

| Service | Duration | Cost (USD) | Cost (AMD) |
|---------|----------|------------|------------|
| UI/UX Design (Mobile + Web) | 2-3 weeks | $1,500 | 585,000 ֏ |
| Mobile App Development | 6-8 weeks | $4,500 | 1,755,000 ֏ |
| Web App Development | 3-4 weeks | $2,000 | 780,000 ֏ |
| Backend completion + EVAN integration | 2-3 weeks | $1,500 | 585,000 ֏ |
| Admin Panel (basic) | 1-2 weeks | $800 | 312,000 ֏ |
| Testing & QA | 2 weeks | $1,000 | 390,000 ֏ |
| App Store publishing | 1 week | $700 | 273,000 ֏ |
| **TOTAL** | **3-4 months** | **$12,000** | **4,680,000 ֏** |

---

## MVP: What You Get

```
✅ Mobile App (iOS + Android)
   ├── Interactive map with all charging stations
   ├── Station details with photos & prices
   ├── Search & filters
   ├── User registration & login
   ├── Favorites list
   └── Navigation to stations

✅ Web Application
   ├── Responsive design (mobile + desktop)
   ├── Map view with stations
   ├── Station search
   └── User account

✅ Admin Panel (Basic)
   ├── Station management
   └── User list

✅ Backend API (already built)
   ├── All endpoints ready
   ├── EVAN integration (OCPI)
   └── Database with test data
```

---

## MVP: What You DON'T Get

```
❌ In-app payments (wallet, top-up)
❌ Start/Stop charging from app
❌ Real-time charging session monitoring
❌ Push notifications
❌ QR code scanner
❌ Ratings & reviews
❌ Multiple CPO integrations (only EVAN)
❌ SMS OTP verification
❌ Financial reports in admin
```

---

# OPTION 2: FULL PRODUCT

## Full Product Features

| Feature | Included | Description |
|---------|:--------:|-------------|
| **Mobile App (iOS + Android)** | ✅ | React Native |
| Map with all stations | ✅ | All 5+ networks |
| Advanced filters | ✅ | Network, connector, power, availability |
| Station details | ✅ | Address, connectors, prices, photos, rating |
| Real-time connector status | ✅ | For all integrated networks |
| Built-in navigation | ✅ | In-app + Google Maps / Waze |
| Registration / Login | ✅ | Phone + OTP verification |
| User profile | ✅ | Full profile with verification |
| Favorites | ✅ | Save stations |
| Charging history | ✅ | All sessions with details |
| Wallet | ✅ | Balance, top-up, withdraw |
| Payments | ✅ | iDram, Telcell, Visa/MC |
| Start/Stop charging | ✅ | Directly from app |
| Real-time session | ✅ | kWh, power, cost live |
| Push notifications | ✅ | Charging complete, low balance |
| QR scanner | ✅ | Scan station to start |
| Ratings & reviews | ✅ | Rate stations |
| Multi-language | ✅ | AM, RU, EN |
| Dark mode | ✅ | Dark theme |
| **Web Application** | ✅ | Full PWA |
| Full map experience | ✅ | All features |
| User dashboard | ✅ | Sessions, wallet, history |
| **Admin Panel** | ✅ | Full (static framework) |
| Dashboard | ✅ | Charts, statistics |
| Stations CRUD | ✅ | Full management |
| Users | ✅ | Management, support |
| CPO Networks | ✅ | Integration monitoring |
| Finances | ✅ | Transactions, reports |
| Notifications | ✅ | Push/email broadcasts |
| Settings | ✅ | Tariffs, commissions |
| **Backend** | ✅ | Production-ready |
| WebSocket | ✅ | Real-time updates |
| CPO Integrations | ✅ | 3-4 networks |
| Payment gateway | ✅ | iDram, cards |
| SMS service | ✅ | OTP verification |
| **UI/UX Design** | ✅ | Full design system |

---

## Full Product: Timeline & Budget

| Service | Duration | Cost (USD) | Cost (AMD) |
|---------|----------|------------|------------|
| UI/UX Design (Full) | 4 weeks | $2,500 | 975,000 ֏ |
| Mobile App Development | 10-12 weeks | $8,000 | 3,120,000 ֏ |
| Web App Development | 4-5 weeks | $3,000 | 1,170,000 ֏ |
| Backend + WebSocket + Real-time | 3-4 weeks | $2,500 | 975,000 ֏ |
| CPO Integrations (EVAN, EcoCars, +2) | 4-5 weeks | $3,000 | 1,170,000 ֏ |
| Payment System (iDram, Telcell, Cards) | 3 weeks | $2,000 | 780,000 ֏ |
| Push Notifications + SMS | 1-2 weeks | $1,000 | 390,000 ֏ |
| Admin Panel (Full) | 3-4 weeks | $2,500 | 975,000 ֏ |
| Testing & QA | 3-4 weeks | $2,000 | 780,000 ֏ |
| DevOps + Deployment | 1-2 weeks | $1,000 | 390,000 ֏ |
| App Store publishing | 1 week | $500 | 195,000 ֏ |
| **TOTAL** | **6-8 months** | **$28,000** | **10,920,000 ֏** |

---

# COMPARISON TABLE

| Parameter | MVP | Full Product |
|-----------|:---:|:------------:|
| **Timeline** | 3-4 months | 6-8 months |
| **Budget (USD)** | $12,000 | $28,000 |
| **Budget (AMD)** | 4,680,000 ֏ | 10,920,000 ֏ |
| Mobile App | ✅ Basic | ✅ Full |
| Web App | ✅ Basic | ✅ Full |
| Admin Panel | ✅ Basic | ✅ Full |
| Payments | ❌ | ✅ |
| Charging Control | ❌ | ✅ |
| Real-time | ❌ | ✅ |
| CPO Integrations | 1 network | 3-4 networks |
| Push Notifications | ❌ | ✅ |
| Ready for monetization | ❌ | ✅ |

---

# RECOMMENDED: PHASED APPROACH

## Phase 1 → Phase 2 → Phase 3

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 1: MVP                                                       │
│  $12,000 • 3-4 months                                              │
│  → Launch app, get users, validate market                          │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 2: Add Payments                                              │
│  +$8,000 • 2 months                                                │
│  → Wallet, iDram, Telcell, Start monetization                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 3: Full Features                                             │
│  +$8,000 • 2 months                                                │
│  → Real-time, more CPOs, push notifications                        │
└─────────────────────────────────────────────────────────────────────┘

TOTAL: $28,000 over 7-8 months (same as Full Product)
```

### Why Phased Approach?

| Benefit | Description |
|---------|-------------|
| **Lower risk** | Start with $12K, not $28K |
| **Faster to market** | Launch in 3-4 months |
| **User feedback** | Real users guide development |
| **Cash flow** | Start earning before full investment |
| **Flexibility** | Adjust features based on demand |

---

# PAYMENT SCHEDULE

## MVP ($12,000)

| Milestone | Amount | When |
|-----------|--------|------|
| Project start | $3,600 (30%) | Contract signing |
| Design approved | $2,400 (20%) | Week 3 |
| App ready for testing | $3,600 (30%) | Week 10 |
| Launch complete | $2,400 (20%) | Week 14 |

## Full Product ($28,000)

| Milestone | Amount | When |
|-----------|--------|------|
| Project start | $5,600 (20%) | Contract signing |
| Design approved | $2,800 (10%) | Week 4 |
| MVP features ready | $5,600 (20%) | Month 3 |
| Payments working | $5,600 (20%) | Month 5 |
| All integrations done | $5,600 (20%) | Month 7 |
| Launch complete | $2,800 (10%) | Month 8 |

---

# MONTHLY COSTS AFTER LAUNCH

| Item | MVP | Full Product |
|------|-----|--------------|
| Server (VPS) | $25-40 | $50-80 |
| Database (managed) | $15-25 | $30-50 |
| Redis | Included | $15-25 |
| Firebase (push) | Free | Free tier |
| Google Maps API | $0-30 | $30-60 |
| SMS (OTP) | N/A | $20-50 |
| Domain + SSL | $5 | $5 |
| **Total/month** | **$45-100** | **$150-270** |

**Annual operating cost**: $540-1,200 (MVP) / $1,800-3,240 (Full)

---

# TEAM

| Role | Person | Allocation |
|------|--------|------------|
| **UI/UX Designer** | 1 | Full-time Phase 1, part-time after |
| **Full-Stack Developer** | 1 | Full-time throughout |
| **QA + Project Manager** | 1 | Part-time → Full-time |

**Total team**: 3 people

---

# WHAT'S ALREADY BUILT (INCLUDED FREE)

The backend is 95% complete. This saves you ~$8,000-10,000:

| Component | Status | Value |
|-----------|--------|-------|
| User authentication (JWT, OTP) | ✅ Ready | $1,500 |
| Station & connector API | ✅ Ready | $2,000 |
| Charging session management | ✅ Ready | $2,000 |
| Wallet & transactions | ✅ Ready | $1,500 |
| OCPP charge point integration | ✅ Ready | $1,500 |
| WebSocket real-time | ✅ Ready | $1,000 |
| PostgreSQL + PostGIS database | ✅ Ready | $500 |
| Redis caching | ✅ Ready | $300 |
| Docker deployment | ✅ Ready | $300 |
| **Total saved** | | **~$10,600** |

---

# FINAL PRICING SUMMARY

| Option | Timeline | Price (USD) | Price (AMD) |
|--------|----------|-------------|-------------|
| **MVP** | 3-4 months | **$12,000** | **4,680,000 ֏** |
| **Full Product** | 6-8 months | **$28,000** | **10,920,000 ֏** |
| **Phased (MVP → Full)** | 7-8 months | **$28,000** | **10,920,000 ֏** |

---

# DELIVERABLES

## MVP Deliverables
- [ ] UI/UX designs (Figma) - 20+ screens
- [ ] React Native source code (iOS + Android)
- [ ] React Web application source code
- [ ] Published iOS app (App Store)
- [ ] Published Android app (Google Play)
- [ ] Deployed web application
- [ ] Basic admin panel
- [ ] Technical documentation
- [ ] 2 weeks post-launch support

## Full Product Deliverables
- [ ] UI/UX designs (Figma) - 35+ screens + design system
- [ ] React Native source code (iOS + Android)
- [ ] React Web application source code
- [ ] Full admin panel
- [ ] Payment gateway integration
- [ ] 3-4 CPO network integrations
- [ ] Push notification system
- [ ] SMS OTP system
- [ ] Published iOS app (App Store)
- [ ] Published Android app (Google Play)
- [ ] Deployed web application
- [ ] Technical documentation
- [ ] 4 weeks post-launch support

---

# RECOMMENDATION

> **Start with MVP ($12,000)** → Launch in 3-4 months → Get real users → Add payments when needed
>
> This approach minimizes risk and gets you to market faster. You can always upgrade to full product based on user demand.

---

# CONTACT

**Project Lead**: [Your Name]
**Email**: [your.email@company.com]
**Phone**: +374 XX XXX XXX

*This proposal is valid for 30 days.*

**Date**: January 2026
**Version**: 3.0
