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
3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## License

MIT
