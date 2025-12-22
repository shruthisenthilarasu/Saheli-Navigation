# Mapbox Setup Guide - Render Tirupur City

To see the actual map of Tirupur instead of the grid placeholder, you need a Mapbox access token.

## Quick Setup (5 minutes)

### Step 1: Create Mapbox Account

1. Go to [https://account.mapbox.com/](https://account.mapbox.com/)
2. Click **"Sign up"** (or **"Log in"** if you already have an account)
3. Sign up with email, Google, or GitHub
4. Verify your email if required

### Step 2: Get Your Access Token

1. Once logged in, you'll be taken to your account dashboard
2. Scroll down to **"Access tokens"** section
3. You'll see your **Default public token** (starts with `pk.eyJ...`)
4. Click **"Copy"** to copy the token

**OR** create a new token:
1. Click **"Create a token"**
2. Give it a name (e.g., "Saheli Station Finder")
3. Leave the default scopes (they're fine for this app)
4. Click **"Create token"**
5. Copy the token

### Step 3: Add Token to Your Project

1. Open your `.env.local` file in the project root
2. Update the `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` line:

```env
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsbXh4eHh4eHgiLCJhIjoiY2xteHh4eHh4eCJ9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. Replace the value with your actual Mapbox token
4. Save the file

### Step 4: Restart Development Server

1. Stop your current server (press `Ctrl+C` in the terminal)
2. Start it again:
   ```bash
   npm start
   ```
3. Press `w` to open in web browser
4. **Refresh the browser** (press `Cmd+R` or `F5`)

## What You'll See

After adding the token and refreshing:
- ✅ **Real Mapbox map** showing Tirupur city streets, buildings, and landmarks
- ✅ **Satellite/Street view** of Tirupur, Tamil Nadu
- ✅ **Station markers** overlaid on the actual map
- ✅ **Zoom and pan** to explore Tirupur and outskirts
- ✅ **Navigation controls** (zoom in/out buttons)

## Map Configuration

The map is already configured for Tirupur:
- **Center**: Tirupur city center (11.1085° N, 77.3411° E)
- **Zoom Level**: 12 (shows city and surrounding areas)
- **Style**: Streets (can be changed to satellite, dark, etc.)

## Troubleshooting

### "Mapbox token missing" error
- Make sure the token starts with `pk.eyJ...`
- Check that it's in `.env.local` (not `.env`)
- Restart the dev server after adding the token

### Map still shows grid
- Refresh your browser after restarting the server
- Check browser console for errors (F12 or Cmd+Option+I)
- Verify the token is correct in `.env.local`

### Map loads but no markers
- Make sure you've added the Tirupur stations to Supabase
- Check that stations have valid latitude/longitude coordinates
- Refresh the page

## Free Tier Limits

Mapbox free tier includes:
- **50,000 map loads per month** (plenty for development)
- All map styles available
- Full API access

For production, you may need to upgrade if you exceed the free tier.

## Alternative: Use Different Map Style

You can change the map style in `components/MapView.web.tsx`:

```typescript
styleURL = 'mapbox://styles/mapbox/streets-v11'  // Streets (default)
styleURL = 'mapbox://styles/mapbox/satellite-v9'  // Satellite
styleURL = 'mapbox://styles/mapbox/dark-v11'      // Dark mode
styleURL = 'mapbox://styles/mapbox/light-v11'     // Light mode
```

