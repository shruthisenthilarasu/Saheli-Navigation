# Supabase Setup Guide

This guide will walk you through setting up Supabase for the Saheli Station Finder app.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub, Google, or email
4. Verify your email if required

## Step 2: Create a New Project

1. Once logged in, click **"New Project"** (or the **"+"** button)
2. Fill in the project details:
   - **Name**: `saheli-station-finder` (or any name you prefer)
   - **Database Password**: Create a strong password (save this - you'll need it)
   - **Region**: Choose the region closest to you
   - **Pricing Plan**: Free tier is fine for development
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be set up

## Step 3: Get Your Project Credentials

1. In your Supabase dashboard, click on **"Project Settings"** (gear icon in the left sidebar)
2. Click on **"API"** in the settings menu
3. You'll see two important values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`
4. Copy both of these values - you'll need them in the next step

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase/schema.sql` from this project
4. Copy the entire contents of that file
5. Paste it into the SQL Editor
6. Click **"Run"** (or press `Cmd+Enter` / `Ctrl+Enter`)
7. You should see "Success. No rows returned" - this means the tables were created successfully

## Step 5: Configure Environment Variables

1. In your project root directory, create a file named `.env.local`:
   ```bash
   touch .env.local
   ```

2. Open `.env.local` in a text editor and add:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token-here
   ```

3. Replace the values with:
   - `EXPO_PUBLIC_SUPABASE_URL`: Your Project URL from Step 3
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your anon/public key from Step 3
   - `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`: Your Mapbox token (see Mapbox setup below)

## Step 6: Restart the Development Server

1. Stop your current dev server (press `Ctrl+C` in the terminal)
2. Start it again:
   ```bash
   npm start
   ```
3. Press `w` to open in web browser

## Step 7: Verify It's Working

1. Open your browser's developer console (F12 or Cmd+Option+I)
2. Check for any Supabase warnings - they should be gone
3. The app should now be able to fetch stations (though you won't see any until you add data)

## Adding Test Data (Optional)

To test with some sample stations, you can run this SQL in the Supabase SQL Editor:

```sql
-- Insert a few test stations in San Francisco area
INSERT INTO stations (name, address, latitude, longitude, cleanliness, safety, privacy, water_availability, verification_status, is_operational, is_accessible)
VALUES
  ('Union Square Station', '123 Market St, San Francisco, CA', 37.7879, -122.4094, 4, 5, 4, 'available', 'verified', true, true),
  ('Embarcadero Station', '456 Embarcadero, San Francisco, CA', 37.7955, -122.3933, 3, 4, 3, 'available', 'verified', true, true),
  ('Mission Bay Station', '789 Mission Bay Blvd, San Francisco, CA', 37.7699, -122.3889, 2, 2, 2, 'unavailable', 'unverified', true, false),
  ('Golden Gate Park Station', '321 Golden Gate Park, San Francisco, CA', 37.7694, -122.4862, 5, 5, 5, 'available', 'verified', true, true),
  ('Fisherman''s Wharf Station', '654 Fisherman''s Wharf, San Francisco, CA', 37.8080, -122.4177, 3, 3, 3, 'available', 'unverified', true, true);
```

## Troubleshooting

### "Invalid API key" error
- Double-check that you copied the **anon/public** key (not the service_role key)
- Make sure there are no extra spaces in your `.env.local` file

### "relation does not exist" error
- Make sure you ran the `schema.sql` file in the SQL Editor
- Check that all tables were created by going to **"Table Editor"** in Supabase dashboard

### Environment variables not loading
- Make sure the file is named `.env.local` (not `.env`)
- Restart the dev server after creating/modifying `.env.local`
- In Expo, environment variables must start with `EXPO_PUBLIC_`

### Still seeing "Supabase not configured" warning
- Check that your `.env.local` file is in the project root directory
- Verify the variable names are exactly: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Restart the dev server

## Next Steps

Once Supabase is set up:
1. The app will automatically fetch stations from your database
2. Real-time updates will work when stations are added/modified
3. Report submissions will be saved to the database
4. You can view and manage data in the Supabase dashboard under **"Table Editor"**

## Security Notes

- The **anon key** is safe to use in client-side code (it's public)
- Never commit your `.env.local` file to version control (it's already in `.gitignore`)
- For production, set these variables in your hosting platform's environment settings

