# StatsSpotify

StatsSpotify is a Next.js app that connects to Spotify and shows your top tracks or artists across multiple time ranges. It also includes a playlist curation flow that uses Last.fm similar-track data to generate a Spotify playlist based on your listening profile.

## Features

- Spotify OAuth login (PKCE flow)
- View top tracks or top artists
- Time-range filters: last 4 weeks, last 6 months, last year
- Client-side caching for top item requests
- Playlist curation from your top seeds
- Spotify playlist creation and one-click open in Spotify
- Reuses existing generated playlists for the same seed/time-range combination

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Spotify Web API
- Last.fm API
- Axios

## How It Works

- You sign in through Spotify OAuth, and tokens are stored in secure HTTP-only cookies.
- The dashboard fetches your top tracks/artists for the selected time range and caches them for 24 hours.
- The curate page uses your top 3 seeds from the current dashboard selection.
- Similar tracks are fetched from Last.fm, matched to Spotify tracks, then added to a new Spotify playlist.

## Getting Started

1. Clone the repository.

```bash
git clone https://github.com/mgz11/statsspotify.git
cd statsspotify
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file in the project root.

```env
SPOTIFY_CLIENT_ID="your_spotify_client_id"
SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"
SPOTIFY_REDIRECT_URI="http://127.0.0.1:3000/api/auth/callback"
BASE_URL="http://127.0.0.1:3000"

LASTFM_API_KEY="your_lastfm_api_key"
LASTFM_SHARED_SECRET="your_lastfm_shared_secret"
```

4. Configure Spotify redirect URI in your Spotify Developer app:

- `http://127.0.0.1:3000/api/auth/callback`

5. Run the development server.

```bash
npm run dev
```

6. Open `http://127.0.0.1:3000`.

## Project Structure

```txt
src/app/                         # App router pages and API routes
src/app/api/auth/*               # Spotify auth + token callback/refresh/logout
src/app/api/spotify/*            # Profile, top items, and playlist generation
src/app/api/lastfm/*             # Last.fm similar track lookups
src/app/components/*             # UI components (dashboard, login, top items)
src/utils/*                      # Spotify and cache utility functions
```

## Notes

- This project is currently configured for local development.
- Keep `.env` secrets private and rotate them if they are ever committed.

## Troubleshooting

- `INVALID_CLIENT` or auth redirect issues: verify your Spotify app credentials and redirect URI match exactly.
- Empty seed message on curate page: open the dashboard first and load top items for the target view/time range.
- Playlist not created: ensure Spotify account has permission scopes for playlist creation and modification.
