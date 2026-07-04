# Plan 025: Admin-to-Web End-to-End Sync Verification

## Status
- **Priority**: P1 | **Effort**: M (3-5h) | **Risk**: MED
- **Depends on**: 010 (broadcast flow), 024 (realtime provider) | **Phase**: 06-Integration

## Objective (Kya)
Verify and fix the complete real-time synchronization pipeline:

```
Admin UI → API Worker (D1 mutation) → PartyKit HTTP POST → WebSocket broadcast → Web client SWR invalidation → UI update
```

This plan is about **integration testing** — ensuring all the pieces from plans
006, 009, 010, and 024 work together seamlessly.

## Timeline (Kab)
After all real-time components exist. This is the final wiring + QA.

## Implementation Strategy (Kaise)

### Test scenarios

| # | Action (Admin) | Expected (Web) | Entity |
|---|----------------|-----------------|--------|
| 1 | Create a new role | Role appears in hero text flip cycle | roles |
| 2 | Update a project title | Title updates on home + projects page | projects |
| 3 | Publish a blog post | Post appears in "recent posts" on home | blog_posts |
| 4 | Approve a guestbook entry | Entry appears instantly in guestbook | guestbook |
| 5 | Upload an audio asset | Track appears in music library | assets |
| 6 | Delete a social link | Link disappears from dock/home | social_links |
| 7 | Update bio in settings | Bio text changes on home page | site_config |

### Manual testing procedure

1. Start all 4 dev servers:
   ```bash
   bun turbo dev  # web :3000, admin :3001, api :8787, party :1999
   ```

2. Open web app in Browser Tab A
3. Open admin panel in Browser Tab B
4. Open browser DevTools Network tab in Tab A (filter WS)
5. Run each test scenario above
6. Verify the web app updates within 1-2 seconds without page reload

### Debugging checklist (if a scenario fails)

1. **API mutation succeeds?** — Check admin toast notification
2. **PartyKit receives POST?** — Check PartyKit dev server logs
3. **WebSocket message received?** — Check browser DevTools WS frames
4. **SWR cache invalidated?** — Check network tab for re-fetch request
5. **UI re-renders?** — Check React DevTools for component update

### Fixes to apply
- If WebSocket disconnects frequently: add reconnection logic to `partysocket`
  (it has built-in reconnection, verify `reconnect: true`)
- If SWR doesn't re-fetch: ensure the `mutate()` key matches the `useSWR()` key
- If PartyKit POST fails: check CORS on PartyKit server, check API Worker's
  `PARTYKIT_HOST` env var

**Verify**: All 7 test scenarios pass end-to-end.

## Done Criteria
- [ ] All 7 test scenarios pass (admin change → web updates instantly)
- [ ] WebSocket stays connected across page navigations
- [ ] Reconnection works after brief disconnection
- [ ] No console errors in either app
- [ ] Latency under 2 seconds for each update
- [ ] `plans/README.md` 025 → DONE

## STOP Conditions
- PartyKit HTTP POST is blocked by CORS or auth — PartyKit's free tier may
  restrict incoming HTTP. Report the error; may need to add PartyKit auth token.
- WebSocket connection refused in production — PartyKit's hostname may differ
  from local dev. Ensure `NEXT_PUBLIC_PARTYKIT_HOST` env var is set correctly.
