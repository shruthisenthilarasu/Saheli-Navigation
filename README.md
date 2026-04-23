# SAHELI Station Finder — Safety Infrastructure Mapping App

A React Native application designed to help users locate safe, clean, and accessible public restroom facilities. The app provides real-time status information, safety ratings, and emergency features to support community safety and infrastructure awareness.

## Overview

SAHELI Station Finder addresses the challenge of finding reliable public restroom facilities, particularly in urban environments where safety and cleanliness vary significantly. The app aggregates user-reported data and verification status to help users make informed decisions about which facilities to use. The core goal is to provide a map-first interface that prioritizes safety information and emergency access.

## Key Features

- **Map-first station visualization** — Interactive map displaying station locations with color-coded status indicators
- **Safety status markers** — Visual indicators for verified (green), under repair (yellow), and unsafe (red) stations
- **Filter-based station discovery** — Quick filtering by verification status to focus on safe options
- **Emergency SOS access** — One-tap emergency alert system with location sharing and contact notification
- **Crowdsourced reporting** — Users can report issues (unsafe, unclean, no water, broken locks) to keep data current
- **Offline-first design intent** — Architecture supports caching and offline report submission with sync when connectivity returns

## Architecture & Design Decisions

### UI-First Development Approach

The UI and interaction logic were built before map provider integration to:
- **Decouple frontend development from backend dependencies** — Allows parallel work streams and faster iteration
- **Validate user flows early** — Test navigation, filtering, and reporting workflows without waiting for map services
- **Enable design iteration** — Refine spacing, typography, and component behavior independently of map rendering complexity

### Mock Spatial Data

Mock station data with lat/lng coordinates is used to:
- **Test marker positioning logic** — Verify coordinate-to-screen transformations work correctly
- **Develop filtering and status logic** — Build and test station status calculations without database dependencies
- **Prototype user interactions** — Test marker taps, detail screens, and navigation flows with realistic data

### Minimal, Low-Cognitive-Load UI

The interface prioritizes clarity and calm:
- **Neutral color palette** — Avoids alarmist colors except where safety-critical (SOS, unsafe markers)
- **Large touch targets** — Ensures accessibility and reduces interaction errors
- **System fonts only** — Reliable rendering across platforms without custom font loading
- **Clear visual hierarchy** — Status information is immediately visible without overwhelming detail

### Platform Considerations

- **Web-first development** — Initial implementation targets web for faster iteration and easier debugging
- **Mobile-ready architecture** — React Native structure supports iOS/Android deployment when ready
- **Platform-specific components** — MapView.web.tsx demonstrates how platform-specific implementations can coexist

## Safety & Ethical Considerations

### Limitations of Crowdsourced Data

User-reported data is inherently imperfect:
- **No real-time verification** — Reports may be outdated or inaccurate
- **Potential for abuse** — Malicious or mistaken reports can mislead users
- **Temporal validity** — Station conditions change; 24-hour report expiration helps but doesn't guarantee accuracy

### Disclaimers

The app should clearly communicate:
- **Data is user-reported** — Not officially verified by authorities
- **Use at your own discretion** — Users must assess their own safety
- **Emergency services** — SOS feature supplements but doesn't replace direct emergency calls

### Optional, Non-Intrusive Onboarding

Onboarding is designed to be:
- **Non-blocking** — Users can skip and explore the app immediately
- **Permission-focused** — Only requests location when needed for map features
- **Transparent** — Explains why permissions are needed without pressure

## Tech Stack

- **React Native (Expo)** — Cross-platform mobile framework with web support
- **TypeScript** — Type safety and improved developer experience
- **Supabase (planned)** — Backend-as-a-service for database, authentication, and real-time sync
- **Map provider (abstracted)** — Currently Mapbox GL JS for web; architecture supports switching providers
- **AsyncStorage (planned)** — Local storage for offline data caching and report queuing
- **React Navigation** — Stack navigation for screen transitions
- **Expo Location** — GPS location services with permission handling
- **Expo AV** — Audio playback for SOS alarm features

## Current Status

### Implemented

- **Core UI components** — Buttons, badges, cards, filter chips, search bar
- **Navigation structure** — Stack navigator with HomeMapScreen, StationDetailScreen, EmergencySOSScreen, InfoScreen
- **Map placeholder with markers** — Grid-based placeholder with mock station markers positioned by lat/lng
- **Filter functionality** — Station filtering by status (all, verified, under repair, unsafe)
- **Map legend** — Visual guide for marker colors
- **Info screen** — App information and help content
- **Design system** — Color palette, typography, spacing, and accessibility guidelines
- **Permission handling** — Location and audio permission requests with graceful fallbacks

### Recently Completed (Web Deployment)

- **MapView enabled** — Mapbox GL JS integration active for web platform
- **Real station data** — Connected to Supabase for live station data
- **Map markers** — Station markers rendered on map with color-coded status
- **Real-time updates** — Supabase subscriptions for live station updates
- **Report submission** — Connected to backend with offline queuing support
- **Environment configuration** — Proper setup for Mapbox and Supabase credentials

### Intentionally Scaffolded/Mocked

- **SOS backend** — UI and navigation complete; SMS and alarm triggers are placeholders
- **Offline sync** — Basic implementation in place; full conflict resolution pending
- **Marker clustering** — Basic implementation; full GeoJSON clustering can be enhanced

### Next Steps

1. **Production deployment** — Deploy to Vercel/Netlify with environment variables
2. **Performance optimization** — Implement full marker clustering for >100 stations
3. **Complete SOS flow** — Integrate SMS service (Twilio/AWS SNS) and audio alarm playback
4. **Error tracking** — Add Sentry or similar for production error monitoring
5. **PWA features** — Enable service worker for offline support

## Future Improvements

- **Real map integration** — Replace placeholder with live Mapbox/Google Maps rendering
- **Live backend sync** — Connect to Supabase for real-time station data and report submission
- **Trusted verifier roles** — Allow verified users or administrators to mark stations as verified
- **Enhanced offline sync** — Implement conflict resolution and background sync when connectivity returns
- **User authentication** — Track user reports and build reputation system
- **Photo uploads** — Allow users to attach photos to issue reports
- **Directions integration** — Open native maps app with directions to selected station
- **Push notifications** — Alert users when nearby stations are reported as unsafe

## Running the Project

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Setup

1. **Clone the repository**
   ```bash
   cd saheli-station-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the root directory (see `ENV_SETUP.md` for details):
   ```bash
   EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   **Required for full functionality:**
   - Mapbox token: Get from https://account.mapbox.com/access-tokens/
   - Supabase credentials: Get from your Supabase project settings
   - Database setup: Run `supabase/schema.sql` in your Supabase SQL editor

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your platform**
   - Press `w` to open in web browser
   - Press `i` for iOS simulator (requires Xcode)
   - Press `a` for Android emulator (requires Android Studio)
   - Scan QR code with Expo Go app on your phone

### Development Notes

- The app runs without Supabase/Mapbox configuration; you'll see console warnings and fallback UI
- MapView automatically enables on web when Mapbox token is configured
- Grid placeholder shows as fallback when map is unavailable
- All navigation and UI flows are functional

### Building for Web Production

1. **Build static export:**
   ```bash
   npx expo export --platform web
   ```

2. **Preview locally:**
   ```bash
   npx serve dist
   ```

3. **Deploy to hosting:**
   - **Vercel**: Connect GitHub repo, set environment variables in dashboard (or use `vercel.json`)
   - **Netlify**: Connect GitHub repo, set build command: `npx expo export --platform web`, publish directory: `dist`
   - **Firebase Hosting**: Use `firebase deploy` after configuring firebase.json

See deployment checklist in the project documentation for full details.

## License

[Specify license if applicable]

## Contributing

[Add contribution guidelines if this becomes an open-source project]

