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
Mobile App              │ Setup    │ Map/Stations │ Charging/Wallet │ Polish │
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

## Detailed Weekly Breakdown

### Month 1 (Weeks 1-4): Design & Foundation

| Week | Phase 1: Design | Phase 2: Mobile (Prep) |
|------|-----------------|------------------------|
| **Week 1** | • User research & competitive analysis | • Tech stack evaluation |
| | • User persona development | • Project setup planning |
| | • User journey mapping | • Architecture design |
| | • Information architecture | |
| **Week 2** | • Low-fidelity wireframes | • Development environment setup |
| | • Navigation flow diagrams | • CI/CD pipeline setup |
| | • Client review session | • Design system code prep |
| **Week 3** | • Brand identity refinement | • React Native project init |
| | • Color palette & typography | • Navigation skeleton |
| | • Icon design | • API client setup |
| **Week 4** | • High-fidelity mockups | • Authentication screens |
| | • Interactive prototype | • Login/Register/OTP |
| | • Design system documentation | • Token management |
| | **Milestone: Design Approval** | |

### Month 2 (Weeks 5-8): Core Mobile Development

| Week | Phase 2: Mobile App | Phase 3: Integrations (Start) |
|------|--------------------|-----------------------------|
| **Week 5** | • Map screen implementation | • EVAN API documentation review |
| | • Station markers | • OCPI 2.2 module setup |
| | • Geolocation service | • Test environment access |
| | • User location tracking | |
| **Week 6** | • Station list view | • EVAN locations sync |
| | • Station detail screen | • Connector status polling |
| | • Connector display | • Real-time status updates |
| | • Search functionality | |
| **Week 7** | • Filters implementation | • EcoCars API integration |
| | • Favorites feature | • Custom adapter development |
| | • Station status updates | • Data normalization |
| | **Milestone: Map Feature Complete** | |
| **Week 8** | • Start charging flow | • iCharge/Amperion investigation |
| | • Session initiation | • Partner communication |
| | • QR code scanner | • API access requests |

### Month 3 (Weeks 9-12): Charging & Payments

| Week | Phase 2: Mobile App | Phase 3: Integrations |
|------|--------------------|-----------------------|
| **Week 9** | • Real-time session monitoring | • Session commands (OCPI) |
| | • WebSocket integration | • Start/Stop remote commands |
| | • Live power/energy display | • CDR processing |
| | • Session progress UI | |
| **Week 10** | • Session completion flow | • iDram payment gateway |
| | • Session history | • Payment API integration |
| | • Receipt display | • Transaction handling |
| | **Milestone: Charging Flow Complete** | |
| **Week 11** | • Wallet screen | • Telcell payment gateway |
| | • Balance display | • Card payment (bank gateway) |
| | • Top-up flow | • Receipt PDF generation |
| | • Transaction history | |
| **Week 12** | • Push notifications | • SMS gateway integration |
| | • Firebase setup | • OTP delivery |
| | • Notification handlers | • Session notifications |
| | **Milestone: Payments Complete** | |

### Month 4 (Weeks 13-16): Polish & Launch

| Week | Phase 2: Mobile App | Phase 4: Testing & Launch |
|------|--------------------|-----------------------------|
| **Week 13** | • Profile screen | • Unit test writing |
| | • Settings | • Integration tests |
| | • Language switching (hy/ru/en) | • Backend load testing |
| | • Accessibility | |
| **Week 14** | • Animations & transitions | • E2E testing (Detox) |
| | • Error states | • Bug fixing sprint |
| | • Loading states | • Performance optimization |
| | • Offline handling | |
| | **Milestone: Feature Complete** | |
| **Week 15** | • iOS optimizations | • TestFlight deployment |
| | • Android optimizations | • Internal beta testing |
| | • App Store screenshots | • User feedback collection |
| | • Store descriptions | |
| **Week 16** | • Final bug fixes | • App Store submission |
| | • Documentation | • Google Play submission |
| | • Knowledge transfer | • Production deployment |
| | | **Milestone: LAUNCH** |

### Buffer Weeks (17-20): Post-Launch Support

| Week | Activities |
|------|-----------|
| **Week 17-18** | • App review responses |
| | • Critical bug fixes |
| | • Store listing optimization |
| | • User onboarding support |
| **Week 19-20** | • Performance monitoring |
| | • User feedback implementation |
| | • Minor feature improvements |
| | • Documentation updates |

---

## Critical Path

The following items are on the critical path and must be completed on schedule:

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
| EcoCars API documentation | Week 7 | Medium | Existing adapter pattern |
| iDram merchant account | Week 10 | High | Alternative payment method |
| App Store developer account | Week 15 | Low | Early registration |
| SMS gateway account | Week 12 | Medium | Console logging fallback |

### Internal Dependencies

| Dependency | Depends On | Impact |
|-----------|-----------|--------|
| Mobile app screens | Design approval | Cannot start without designs |
| Charging flow | Backend session API | Already complete |
| Payments UI | Payment gateway integration | Parallel development possible |
| Push notifications | Firebase project setup | Quick setup, low risk |

---

## Team Allocation Timeline

```
WEEK        1   2   3   4   5   6   7   8   9   10  11  12  13  14  15  16
            │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │
Designer    ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
            │ Full-time   │ Part-time (support)                        │
            │             │                                            │
RN Senior   ░░░░░░░░░░░░██████████████████████████████████████████████████
            │ Prep       │ Full-time development                       │
            │            │                                             │
RN Mid      ░░░░░░░░░░░░░░░░████████████████████████████████████████████
            │            │  │ Full-time development                    │
            │            │  │                                          │
Backend     ░░░░░░░░░░░░░░░░████████████████████████████████████░░░░░░░░
            │            │  │ Partner integrations    │ Support       │
            │            │  │                         │               │
QA          ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████████████████████
            │                                    │ Testing & Launch   │
            │                                    │                    │

████ = Full-time    ░░░░ = Part-time/Support
```

---

## Milestones & Deliverables

| Milestone | Week | Deliverables | Acceptance Criteria |
|-----------|------|--------------|---------------------|
| **M1: Design Complete** | 4 | Figma files, prototype | Client sign-off |
| **M2: Auth Complete** | 5 | Login/Register working | User can create account |
| **M3: Map Complete** | 7 | Map with stations | Can view all stations |
| **M4: Charging Complete** | 10 | Full charging flow | Can start/stop session |
| **M5: Payments Complete** | 12 | Top-up working | Can add funds to wallet |
| **M6: Feature Complete** | 14 | All features done | All acceptance tests pass |
| **M7: Beta Complete** | 15 | Apps in testing | 50+ beta testers onboarded |
| **M8: Launch** | 16 | Apps published | Available in stores |

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
| Daily Standup | Daily | Dev team | Progress, blockers |
| Sprint Review | Bi-weekly | Team + Client | Demo completed work |
| Design Review | Weekly (Phase 1) | Designer + Client | Approve designs |
| Status Report | Weekly | PM + Client | Written progress update |
| Risk Review | Bi-weekly | PM + Tech Lead | Identify/mitigate risks |
