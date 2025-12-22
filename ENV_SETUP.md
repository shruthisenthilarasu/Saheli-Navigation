# Environment Variables Setup

This project uses environment variables for sensitive configuration like API keys.

## Required Environment Variables

### Mapbox Access Token

Create a `.env.local` file in the root of the project with:

```bash
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

**Get your Mapbox token:**
1. Sign up at https://account.mapbox.com/
2. Go to https://account.mapbox.com/access-tokens/
3. Copy your default public token or create a new one
4. Add it to your `.env.local` file

**Note:** In Expo, environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in client-side code.

### Supabase Configuration

Add these to your `.env.local` file:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Get your Supabase credentials:**
1. Sign up at https://supabase.com/
2. Create a new project
3. Go to Project Settings > API
4. Copy the Project URL and anon/public key
5. Add them to your `.env.local` file

**Set up the database:**
1. Go to the SQL Editor in your Supabase dashboard
2. Run the SQL script from `supabase/schema.sql` to create the required tables

## Example .env.local file

```bash
# Mapbox Access Token
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here

# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Alternative: Using app.json

For production builds, you can also set these in `app.json` under `extra`:

```json
{
  "expo": {
    "extra": {
      "mapboxToken": "your_token",
      "supabaseUrl": "your_url",
      "supabaseAnonKey": "your_key"
    }
  }
}
```

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Use `.env.example` (without real tokens) for documentation
- Restart the Expo dev server after changing environment variables

## Usage

The MapView component will automatically:
1. Check for `accessToken` prop (highest priority)
2. Check for `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` environment variable
3. Check for `MAPBOX_ACCESS_TOKEN` environment variable (fallback)
4. Show a console warning if no token is found

