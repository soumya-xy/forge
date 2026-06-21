# Phase 5: Integration & Testing - Test Plan

## Build Verification ✅
- [x] TypeScript compilation: `npm run typecheck` - **PASSED**
- [x] Production build: `npm run build` - **PASSED**
- [x] No compilation errors
- [x] All types properly defined

## Feature Testing Checklist

### Feature #1: Idea Versioning (Git for Startups)
**Test Case 1: Branch Creation**
- [ ] Navigate to StagePosture (Step 3)
- [ ] Click "Explore All (Branch Mode)" button
- [ ] Verify 3 branches are created: Ship Fast, Build Moat, Community First
- [ ] Verify each branch has independent roadmap and experiments
- [ ] Verify BranchSwitcher appears in header

**Test Case 2: Branch Comparison**
- [ ] Open StageVersioningDiff
- [ ] Verify side-by-side comparison of roadmaps
- [ ] Verify color-coded branch headers
- [ ] Verify milestone comparison cards show differences

**Test Case 3: Branch Merging**
- [ ] Select phases from different branches using checkboxes
- [ ] Click "Merge Selected"
- [ ] Verify AI generates hybrid roadmap
- [ ] Verify rationale is displayed
- [ ] Advance to Step 5 with merged roadmap

### Feature #2: Live Experiment Loop (OODA Closure)
**Test Case 1: Experiment Logging**
- [ ] Complete pipeline to Step 6 (Resources)
- [ ] Verify StageExperimentTracker is displayed
- [ ] Fill out experiment form with metrics
- [ ] Select hypothesis validated (Yes/No)
- [ ] Click "Log Experiment Results"
- [ ] Verify experiment appears in recent logs

**Test Case 2: Risk Re-analysis**
- [ ] Log 3 experiments with varying results
- [ ] Verify risk badges animate from HIGH→MEDIUM→LOW
- [ ] Verify RiskShiftBadge shows before/after levels
- [ ] Verify rationale explains risk changes

**Test Case 3: Pivot Detection**
- [ ] Log 3+ experiments
- [ ] Verify pivot suggestion alert appears
- [ ] Verify pivot direction is specific (e.g., "Double down on B2B")
- [ ] Verify confidence change is displayed
- [ ] Test dismiss functionality

### Feature #3: Multi-Idea Synthesis
**Test Case 1: Multiple Idea Input**
- [ ] Navigate to StageIntake (Step 1)
- [ ] Click "Add another idea" twice (total 3 ideas)
- [ ] Fill out all 3 textareas with different ideas
- [ ] Verify character count validation (min 10 chars)

**Test Case 2: Synthesis Analysis**
- [ ] Click "Analyze All Ideas"
- [ ] Verify AI processes all 3 ideas in parallel
- [ ] View synthesis report showing core bet
- [ ] Verify conflicts are highlighted
- [ ] Verify complementarity is shown

**Test Case 3: Merge Decision**
- [ ] Click "Merge as One"
- [ ] Verify unified idea proceeds to Step 2
- [ ] OR click "Pursue Separately"
- [ ] Verify idea selection dialog appears

### Feature #4: Cofounder Alignment
**Test Case 1: Multiple Founder Profiles**
- [ ] Navigate to StageProfile (Step 0)
- [ ] Click "Add cofounder" twice (total 3 profiles)
- [ ] Fill out conflicting profiles:
  - Founder A: Ship Fast, 20+ hrs, Exit goal
  - Founder B: Build Moat, 1-5 hrs, Income goal
  - Founder C: Community First, 10-20 hrs, Learning goal

**Test Case 2: Alignment Analysis**
- [ ] Click "Continue" to analyze alignment
- [ ] Verify StageAlignmentReport appears
- [ ] Verify alignment score (LOW/MEDIUM/HIGH)
- [ ] Verify conflicts are listed with severity
- [ ] Verify conversation starters are provided

**Test Case 3: Posture Guidance**
- [ ] Navigate to StagePosture (Step 3)
- [ ] Verify compromise posture is highlighted
- [ ] Click "Why this posture?" tooltip
- [ ] Verify alignment considerations are explained

## Integration Testing

### localStorage Migration
**Test Case 1: V2 to V3 Migration**
- [ ] Create a v2 state (using old schema)
- [ ] Save to localStorage
- [ ] Refresh page
- [ ] Verify migration function runs
- [ ] Verify console shows "Migrating v2 state to v3 format"
- [ ] Verify all existing data is preserved
- [ ] Verify new fields are initialized (empty arrays/objects)

### State Persistence
**Test Case 1: Versioning State**
- [ ] Create branches and merge
- [ ] Refresh page
- [ ] Verify versioning state is preserved

**Test Case 2: Experiment Logs**
- [ ] Log 3 experiments
- [ ] Refresh page
- [ ] Verify experiment logs persist
- [ ] Verify updated risks persist

**Test Case 3: Multi-Idea State**
- [ ] Input multiple ideas
- [ ] View synthesis
- [ ] Refresh page
- [ ] Verify synthesis state persists

### Parallel AI Processing
**Test Case 1: Branch Creation Performance**
- [ ] Click "Explore All" to create 3 branches
- [ ] Verify all 3 branches are generated in parallel (not sequential)
- [ ] Verify total time < 5 seconds (vs 15 seconds if sequential)

**Test Case 2: Multi-Idea Synthesis**
- [ ] Input 3 ideas
- [ ] Click "Analyze All Ideas"
- [ ] Verify all 3 ideas are processed in parallel
- [ ] Verify synthesis analysis completes in reasonable time

## Performance Testing

### Build Performance
- [x] Production build < 30 seconds - **PASSED (20.6s)**
- [x] First Load JS < 150 kB - **PASSED (131 kB)**
- [x] Static page generation successful - **PASSED**

### Runtime Performance
- [ ] Measure parallel AI call latency
- [ ] Verify localStorage read/write < 100ms
- [ ] Verify UI animations < 16ms (60fps)

## Edge Cases & Error Handling

### Empty States
- [ ] Test with no profiles (skip Step 0)
- [ ] Test with single idea (no synthesis)
- [ ] Test with no experiment logs
- [ ] Test with no risk shifts

### Validation Errors
- [ ] Submit empty idea textareas
- [ ] Submit experiment form without required fields
- [ ] Test with invalid UUID formats

### API Failures
- [ ] Test with AI timeout
- [ ] Test with malformed AI responses
- [ ] Test with network errors

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all forms
- [ ] Verify all buttons are keyboard accessible
- [ ] Verify focus indicators are visible

### Screen Reader
- [ ] Verify all alerts have aria-live regions
- [ ] Verify form validation errors are announced
- [ ] Verify pivot suggestion alert is announced

### Color Contrast
- [ ] Verify all text meets WCAG AA standards
- [ ] Verify risk badges have sufficient contrast
- [ ] Verify alignment score badges are readable

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

### Mobile Browsers
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Responsive layout verification

## Documentation Verification

### Code Comments
- [x] All new pipeline functions have JSDoc comments
- [x] All new types have descriptions
- [x] Complex logic has inline comments

### Type Definitions
- [x] All new interfaces exported
- [x] All enums properly defined
- [x] No `any` types used (except where intentional)

### User Facing
- [ ] README updated with new features
- [ ] User guide for each feature
- [ ] Video demos (optional)

## Success Metrics

### Adoption Metrics
- [ ] 30% of users explore branching mode
- [ ] 40% of users log at least 1 experiment
- [ ] 20% of users input multiple ideas
- [ ] 25% of users add cofounders

### Engagement Metrics
- [ ] Average 2.3 branches per session
- [ ] Average 4.2 experiment logs per user
- [ ] Average 1.8 ideas per multi-idea session
- [ ] Average 2.1 cofounders per multi-founder session

### Outcome Metrics
- [ ] 60% of users who log 3+ experiments report higher confidence
- [ ] 45% of mergers produce hybrid roadmaps
- [ ] 35% of multi-idea users discover core bet
- [ ] 50% of cofounder pairs report earlier alignment discussion

## Test Execution Notes

### Prerequisites
1. Fresh localStorage (clear existing data)
2. Google Gemini API key configured
3. Node.js 18+ installed
4. Chrome/Edge browser for testing

### Test Data
- Use real startup ideas for realistic testing
- Use conflicting cofounder profiles
- Use varied experiment results (some validated, some rejected)

### Known Issues
- None identified yet

### Test Results Summary
- **Total Test Cases:** 67
- **Passed:** 3 (Build verification)
- **Skipped:** 64 (To be executed)
- **Failed:** 0

---

## Next Steps

1. Execute all test cases systematically
2. Document any bugs or issues found
3. Fix issues and re-test
4. Update documentation based on findings
5. Prepare for production deployment
