# EV Charging Armenia - Project Timeline
## Gantt Chart View (16-20 Weeks)

```
WEEK      1   2   3   4   5   6   7   8   9   10  11  12  13  14  15  16  17  18  19  20
          │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │
PHASE 1   ████████████████
Design    │ Wireframes  │ Visual Design │
          │ User Research│ Prototypes    │
          │             │ Design System │
                        │               │
PHASE 2               ████████████████████████████████████████████████████
Mobile+Web              │ Setup    │ Map/Stations │ Charging/Wallet │ Polish │
                        │ Auth     │ Favorites    │ Push Notif.     │ i18n   │
                        │ Nav      │ Search       │ Real-time       │ Test   │
                        │          │              │                 │        │
PHASE 3                             ████████████████████████████████████
Integrations                        │ OCPI/EVAN │ Custom APIs │ Payments │
                                    │ Testing   │ EcoCars     │ SMS      │
                                    │           │             │          │
PHASE 4                                                               ████████████
Launch                                                                │ QA  │Beta│Prod│
                                                                      │     │    │    │
          │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │
MONTH     ├─────────────────────┼─────────────────────┼─────────────────────┼──────────┤
          │      MONTH 1        │      MONTH 2        │      MONTH 3        │  MONTH 4 │
```

---

## Team Allocation Timeline (3 People)

```
WEEK        1   2   3   4   5   6   7   8   9   10  11  12  13  14  15  16  17  18  19  20
            │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │
UI/UX       ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
Designer    │ Full-time (100%)  │ Part-time support (25%)                   │
            │ Wireframes        │ Design reviews, asset updates             │
            │ Visual Design     │ Bug fixes, polish                         │
            │ Prototypes        │                                           │
            │                   │                                           │
Full-Stack  ░░░░░░░░░░░░████████████████████████████████████████████████████████████████
Developer   │ Prep (25%) │ Full-time development (100%)                               │
            │            │ Mobile App, Web App, Integrations, Payments               │
            │            │                                                           │
            │            │                                                           │
QA + PM     ████░░░░░░░░░░░░░░░░████████████████████████████████████████████████████████
            │25%│    50%        │              75-100%                               │
            │PM │ PM + initial  │ Testing, QA, PM, Launch coordination              │
            │   │ test setup    │                                                   │

████ = Full-time    ░░░░ = Part-time
```

---

## Detailed Weekly Breakdown

### Month 1 (Weeks 1-4): Design & Foundation

| Week | UI/UX Designer (100%) | Full-Stack Dev (25%) | QA+PM (25%) |
|------|----------------------|---------------------|-------------|
| **Week 1** | • User research | • Review requirements | • Project setup |
| | • Competitive analysis | • Tech stack prep | • Client kickoff |
| | • User journey mapping | • Architecture design | • Schedule planning |
| **Week 2** | • Information architecture | • Dev environment setup | • Requirement docs |
| | • Low-fidelity wireframes | • CI/CD pipeline | • Stakeholder alignment |
| | • Client review session | • API client prep | • Risk assessment |
| **Week 3** | • Brand identity | • React Native init | • Design review |
| | • Color palette & typography | • Navigation skeleton | • Feedback coordination |
| | • Icon design | • Auth preparation | • Progress reporting |
| **Week 4** | • High-fidelity mockups | • Authentication screens | • Design approval |
| | • Interactive prototype | • Login/Register/OTP | • Sprint planning |
| | • Design system docs | • Token management | • Timeline review |
| | **Milestone: Design Approval** | | |

### Month 2 (Weeks 5-8): Core Development

| Week | UI/UX Designer (25%) | Full-Stack Dev (100%) | QA+PM (50%) |
|------|----------------------|----------------------|-------------|
| **Week 5** | • Design support | • Map screen implementation | • Test case writing |
| | • Asset exports | • Station markers | • EVAN API review |
| | | • Geolocation service | • Partner coordination |
| **Week 6** | • Design reviews | • Station list view | • Integration planning |
| | • UI adjustments | • Station detail screen | • QA environment setup |
| | | • Connector display | • Status reporting |
| **Week 7** | • Polish feedback | • Filters & search | • Smoke testing |
| | | • Favorites feature | • Bug tracking setup |
| | | • WebSocket integration | • Partner communication |
| | | **Milestone: Map Feature Complete** | |
| **Week 8** | • Design iterations | • Start charging flow | • Feature testing |
| | | • Session initiation | • Test documentation |
| | | • EVAN OCPI integration start | • Progress review |

### Month 3 (Weeks 9-12): Charging, Payments & Integrations

| Week | UI/UX Designer (25%) | Full-Stack Dev (100%) | QA+PM (75%) |
|------|----------------------|----------------------|-------------|
| **Week 9** | • Session UI polish | • Real-time session monitoring | • Integration testing |
| | | • Live power/energy display | • OCPI test scenarios |
| | | • Session progress UI | • PM: Partner meetings |
| **Week 10** | • Wallet UI support | • Session completion flow | • End-to-end testing |
| | | • Session history | • Payment test cases |
| | | • EVAN integration complete | • Bug triage |
| | | **Milestone: Charging Flow Complete** | |
| **Week 11** | • Payment screens review | • Wallet screen | • Payment testing |
| | | • iDram integration | • Security review |
| | | • Top-up flow | • PM: Launch planning |
| **Week 12** | • Final UI polish | • Telcell integration | • Full regression |
| | | • SMS gateway | • Performance testing |
| | | • Push notifications | • Documentation |
| | | **Milestone: Payments Complete** | |

### Month 4 (Weeks 13-16): Polish & Launch

| Week | UI/UX Designer (25%) | Full-Stack Dev (50-100%) | QA+PM (100%) |
|------|----------------------|-------------------------|-------------|
| **Week 13** | • Final asset delivery | • Profile screen | • Full QA cycle |
| | | • Settings | • Device testing |
| | | • Multi-language (hy/ru/en) | • Bug prioritization |
| **Week 14** | • Store screenshots | • Animations & transitions | • E2E testing |
| | • App Store graphics | • Error states | • Performance validation |
| | | • Offline handling | • Security audit |
| | | **Milestone: Feature Complete** | |
| **Week 15** | • Marketing assets | • iOS/Android optimizations | • TestFlight deployment |
| | | • Bug fixes | • Beta testing |
| | | | • User feedback collection |
| **Week 16** | • Launch support | • Final bug fixes | • App Store submission |
| | | • Production deployment | • Google Play submission |
| | | | • Launch coordination |
| | | | **Milestone: LAUNCH** |

---

## Buffer Weeks (17-20): Post-Launch Support

| Week | Activities | Team Focus |
|------|-----------|------------|
| **Week 17-18** | • App review responses | QA+PM: Full-time |
| | • Critical bug fixes | Developer: As needed |
| | • Store listing optimization | Designer: As needed |
| **Week 19-20** | • Performance monitoring | QA+PM: Part-time |
| | • User feedback implementation | Developer: As needed |
| | • Minor improvements | |

---

## Milestones & Deliverables

| Milestone | Week | Deliverables | Payment Trigger |
|-----------|------|--------------|-----------------|
| **M1: Design Complete** | 4 | Figma files, prototype | 20% payment |
| **M2: Map Feature Complete** | 7 | Map with stations working | - |
| **M3: Charging Complete** | 10 | Full charging flow | - |
| **M4: Payments Complete** | 12 | Top-up working | - |
| **M5: Feature Complete** | 14 | All features done | 30% payment |
| **M6: Beta Complete** | 15 | Apps in testing | - |
| **M7: Launch** | 16 | Apps published | 20% payment |

---

## Critical Path

```
1. Design Approval (Week 4)
   ↓
2. Authentication Complete (Week 5)
   ↓
3. Map Feature Complete (Week 7)
   ↓
4. Charging Flow Complete (Week 10)
   ↓
5. Payment Integration Complete (Week 12)
   ↓
6. Feature Complete (Week 14)
   ↓
7. Beta Testing Complete (Week 15)
   ↓
8. App Store Submission (Week 16)
```

---

## Dependencies & Blockers

### External Dependencies

| Dependency | Required By | Risk Level | Mitigation |
|-----------|-------------|------------|------------|
| EVAN API credentials | Week 5 | Medium | Mock data fallback |
| EcoCars API documentation | Week 7 | Medium | Existing adapter |
| iDram merchant account | Week 10 | High | Telcell as backup |
| App Store developer account | Week 15 | Low | Early registration |
| SMS gateway account | Week 12 | Medium | Console logging fallback |

### Internal Dependencies

| Dependency | Depends On | Impact |
|-----------|-----------|--------|
| Mobile app screens | Design approval | Cannot start without designs |
| Charging flow | Backend session API | ✅ Already complete |
| Payments UI | Payment gateway integration | Parallel development possible |
| Push notifications | Firebase project setup | Quick setup, low risk |

---

## Budget by Phase (Armenian Market Rates)

| Phase | Weeks | Designer | Developer | QA+PM | Total (USD) |
|-------|-------|----------|-----------|-------|-------------|
| Phase 1 | 1-4 | $6,000 | $750 | $500 | **$7,250** |
| Phase 2 | 5-11 | $1,500 | $10,500 | $3,500 | **$15,500** |
| Phase 3 | 8-12 | - | $7,500 | $3,750 | **$11,250** |
| Phase 4 | 13-16 | $500 | $3,000 | $4,000 | **$7,500** |
| **TOTAL** | 16 weeks | **$8,000** | **$21,750** | **$11,750** | **$41,500** |

*Note: Some phases overlap, reducing total duration*

---

## Risk-Adjusted Timeline

### Optimistic Scenario (16 weeks)
- All dependencies resolved early
- No major design revisions
- Quick app store approval
- Partner APIs work smoothly

### Expected Scenario (18 weeks)
- Minor design iterations
- 1-2 integration challenges
- Standard app store review time
- Some bug fixing needed

### Pessimistic Scenario (20-22 weeks)
- Significant design changes
- Partner API delays
- App store rejections requiring fixes
- Major bugs discovered in testing

**Recommendation**: Plan for 18 weeks, budget for 20 weeks

---

## Communication Schedule

| Meeting | Frequency | Participants | Purpose |
|---------|-----------|--------------|---------|
| Daily Standup | Daily | All 3 team members | Progress, blockers |
| Client Demo | Bi-weekly | Team + Client | Demo completed work |
| Design Review | Weekly (Phase 1) | Designer + Client | Approve designs |
| Status Report | Weekly | QA/PM + Client | Written progress update |

---

## Key Dates Summary

| Date | Milestone |
|------|-----------|
| Week 1 | Project Kickoff |
| Week 4 | Design Complete & Approved |
| Week 7 | Map Feature Working |
| Week 10 | Charging Flow Complete |
| Week 12 | Payment Integration Complete |
| Week 14 | Feature Freeze |
| Week 15 | Beta Testing Start |
| Week 16 | Production Launch |
| Week 20 | Post-Launch Support Complete |
