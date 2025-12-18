# Environment Variables Setup

This project uses environment variables for sensitive configuration like API keys.

## Required Environment Variables

### Mapbox Access Token

Create a `.env` file in the root of the project with:

```bash
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

**Get your Mapbox token:**
1. Sign up at https://account.mapbox.com/
2. Go to https://account.mapbox.com/access-tokens/
3. Copy your default public token or create a new one
4. Add it to your `.env` file

**Note:** In Expo, environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in client-side code.

## Example .env file

```bash
# Mapbox Access Token
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoic2hydXRoaXNlbnRoIiwiYSI6ImNtamFyM2RmbjA5Z28zZnJ6NjBoeXpjMngifQ.aI3FAp0ibBK_Hw07bqPeUA

# Supabase Configuration (optional)
# EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
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

