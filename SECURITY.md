# Security Guidelines for Tamagotchi App

## Environment Variables

All sensitive information should be stored in environment variables, not hardcoded in source files:

### Frontend (.env file)

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Backend (.env file)

- `JWT_SECRET_KEY`: Secret key for JWT token generation and validation
- `SECRET_KEY`: Flask app secret key
- Database connection strings

## Best Practices

1. **Never commit .env files to version control**

   - Both `.env` files are listed in `.gitignore`
   - Use `.env.example` files as templates

2. **Rotate credentials if exposed**

   - If tokens are accidentally committed, regenerate them immediately
   - Update your .env files with the new credentials

3. **Use environment-specific variables**

   - Development, testing, and production should use different credentials

4. **Access environment variables securely**
   - In the frontend, use Expo Constants or process.env
   - In the backend, use os.environ.get()
   - Always check if variables exist before using them

## For Developers

1. Copy `.env.example` to `.env` in both frontend and backend folders
2. Fill in your own credentials (get them from your Supabase dashboard)
3. Run the appropriate setup script to verify your configuration

## Security Contacts

If you discover a security vulnerability in this project:

1. Do not disclose it publicly in issues
2. Contact the project maintainers directly
