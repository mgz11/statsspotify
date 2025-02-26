# Spotify Top Tracks / Artists Viewer

## Overview

This application allows users to connect their Spotify account and view their top 10 tracks or artist from different time periods. It provides an easy and interactive way for users to explore their music preferences and discover their most played content on Spotify.

## Preview

This application is only in development mode. If the project is cloned, you will need to create a Spotify for Developers account for API authentication and connect the proper redirect URIs in order for the application to work properly.

<![Spotify Top Artists/Tracks Preview](/client/react/public/preview.png)>

## Mockups

I designed a quick mockup for the application in [Figma](https://www.figma.com/file/wzyoW9lC6c01C9OMEzxtaQ/Spotify-User-Display?type=design&node-id=101%3A32&mode=design&t=MmrBDkSJ9P6wNtMB-1) to be able to understand the layout of the website better.
<![Desktop Mockup](/client/react/public/mockup.png)>

## Features

- Spotify Authentication: Spotify accounts are securely connected to the application through the use of Spotify's API and PCKE flow
- Top Tracks Viewer: Users can view their most streamed tracks for a selected time period
- Top Artists Viewer: Users can view their most streamed artists for a selected time period
- Links to Spotify: Each listed artist and track has the link to their page on Spotify
- User-Friendly Interface: The application provides a simple and user-friendly interface to ensure a smooth experince.
- Users can select which time period they wish to view. These choices include the past month, last 6 months, and all-time.

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mgz11/statsspotify.git
   ```

2. Navigate to the project directory:

   ```bash
   cd statsspotify
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up the environment variables:

   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     SPOTIFY_CLIENT_ID="YOUR_SPOTIFY_CLIENT_ID"
     SPOTIFY_CLIENT_SECRET="YOUR_SPOTIFY_CLIENT_SECRET"
     SPOTIFY_REDIRECT_URI="http://localhost:3000/api/auth/callback"
     BASE_URL="http://localhost:3000"
     ```

5. Start the development server:

   ```bash
   npm run dev
   ```

---

## Tools

- [Nextjs](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Axios](https://axios-http.com/docs/intro)
