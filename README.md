# Our Links - Link Sharing PWA

A modern Progressive Web App for sharing and organizing links with friends. Built with a retro iOS 2008-inspired design.

## Features

- 🔗 Share links with metadata (title, description)
- 👥 Share links with specific friends
- 📝 Add personal notes to shared links
- 🔍 Automatic link metadata extraction
- 📱 PWA support for mobile devices
- 🔐 Secure authentication with Supabase
- 🎨 Retro iOS 2008-inspired UI

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **PWA**: next-pwa
- **UI Components**: Headless UI, Heroicons
- **Notifications**: react-hot-toast
- **Email**: Resend

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your environment variables:
   ```
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

   # Email Configuration (Resend)
   RESEND_API_KEY=your-resend-api-key

   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development

   # Security
   AUTH_SECRET=your-auth-secret
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Security

This project follows strict security practices:

1. **Environment Variables**: All sensitive data is stored in environment variables
2. **Authentication**: Uses Supabase Auth for secure authentication
3. **Database**: Row Level Security (RLS) enabled in Supabase
4. **API Security**: All API routes are protected
5. **Dependencies**: Regular security updates

### Security Best Practices

- Never commit sensitive information
- Keep dependencies up to date
- Use strong authentication methods
- Follow the principle of least privilege
- Report security vulnerabilities responsibly

For more information, see our [Security Policy](SECURITY.md).

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `RESEND_API_KEY`: Your Resend API key for email functionality
- `NEXT_PUBLIC_APP_URL`: Your application URL
- `NODE_ENV`: Environment (development/production)
- `AUTH_SECRET`: Secret key for authentication

## License

MIT 