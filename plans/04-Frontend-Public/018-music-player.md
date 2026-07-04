# Plan 018: Musical Asset Store — Audio Library + Sticky Player

## Status
- **Priority**: P2 | **Effort**: M (3-5h) | **Risk**: MED
- **Depends on**: 005 (assets API), 011 (layout) | **Phase**: 04-Frontend-Public

## Objective (Kya)
Build `/music` page with:
1. Track listing from D1 metadata (title, artist, duration)
2. Audio streaming from R2 via API
3. Sticky bottom audio player with play/pause, progress bar, volume
4. Click-to-play from track list

## Timeline (Kab)
Lower priority. Build after core pages are done.

## Implementation Strategy (Kaise)

### Components
| Component | Purpose |
|-----------|---------|
| `app/music/page.tsx` | Track listing page |
| `components/music/track-list.tsx` | Scrollable list with play button per track |
| `components/music/player.tsx` | Sticky bottom player (above floating dock) |
| `hooks/use-audio-player.ts` | Custom hook: play/pause, seek, volume, current time |

### Audio player hook
```typescript
export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    currentTrack: null as AudioAsset | null,
  });

  const play = (track: AudioAsset) => {
    audioRef.current!.src = `/api/assets/${track.id}/stream`;
    audioRef.current!.play();
    setState(s => ({ ...s, isPlaying: true, currentTrack: track }));
  };

  const toggle = () => { ... };
  const seek = (time: number) => { ... };
  const setVolume = (vol: number) => { ... };

  return { ...state, play, toggle, seek, setVolume, audioRef };
}
```

### Sticky player design
- Fixed above floating dock: `bottom-[calc(80px+env(safe-area-inset-bottom))]`
- Shows: track title, artist, play/pause button, progress bar, time, volume
- Glass morphism background: `bg-background/80 backdrop-blur-md border-t`
- Only visible when a track is playing

## Done Criteria
- [ ] `/music` page lists tracks from API
- [ ] Click to play streams audio from R2
- [ ] Sticky player shows with play/pause, progress, volume
- [ ] Player persists across page navigation
- [ ] Handles empty state (no audio uploaded yet)
- [ ] `plans/README.md` 018 → DONE

## STOP Conditions
- R2 streaming doesn't support `Range` headers — needed for seek. Report if
  `Accept-Ranges` is not supported by the API endpoint.
