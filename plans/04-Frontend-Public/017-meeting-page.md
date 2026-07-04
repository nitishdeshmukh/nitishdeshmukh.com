# Plan 017: Meeting Page — Cal.com Embed

## Status
- **Priority**: P2 | **Effort**: S (1-2h) | **Risk**: LOW
- **Depends on**: 011 | **Phase**: 04-Frontend-Public

## Objective (Kya)
Build `/meeting` page with embedded Cal.com scheduling widget for `nitish-deshmukh-24`.

## Timeline (Kab)
Quick standalone page — do anytime after layout exists.

## Implementation Strategy (Kaise)

### Cal.com embed via iframe (simplest, no dependencies)
```typescript
// app/meeting/page.tsx
export default function MeetingPage() {
  return (
    <div className="layout">
      <h1 className="text-3xl font-bold mb-4">Book a Meeting</h1>
      <p className="text-muted-foreground mb-8">
        Schedule a time to chat about projects, collaborations, or anything else.
      </p>
      <div className="rounded-xl border overflow-hidden">
        <iframe
          src="https://cal.com/nitish-deshmukh-24?embed=true&theme=auto"
          width="100%"
          height="700"
          frameBorder="0"
          className="w-full"
        />
      </div>
    </div>
  );
}
```

Alternative: Use `@calcom/embed-react` for a more integrated experience with
theme matching. Only use if iframe doesn't meet design needs.

## Done Criteria
- [ ] `/meeting` page renders with Cal.com widget
- [ ] Calendar shows available slots for `nitish-deshmukh-24`
- [ ] Responsive on mobile
- [ ] `plans/README.md` 017 → DONE
