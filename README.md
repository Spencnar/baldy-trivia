# Daily Trivia App

A Next.js application that displays a daily trivia question where users can submit their answers. Built with Next.js, TypeScript, MongoDB, and Tailwind CSS.

## Features

- Daily trivia question display
- User answer submission
- Real-time display of recent submissions
- Admin dashboard for managing questions
- Authentication for admin users

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB database (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/daily-trivia.git
   cd daily-trivia
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values with your MongoDB connection string and other settings

   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Seed the database with an admin user:
   ```bash
   npm run seed
   ```

### Project Structure

```
daily-trivia/
├── app/                  # Next.js app router
├── components/           # React components
├── lib/                  # Utility functions
├── models/               # MongoDB schemas
├── public/               # Static assets
├── scripts/              # Seeding scripts
└── types/                # TypeScript type definitions
```

## Usage

### User Interface

- Visit the homepage to see today's question and submit your answer
- View recent submissions from other users

### Admin Interface

- Access the admin login at `/auth/signin`
- Default credentials:
  - Email: admin@example.com
  - Password: adminpassword123
  - (Change these in your .env file)
- Manage questions through the admin dashboard
- Add, edit, or delete questions
- Schedule questions for future dates

## Deployment

### Vercel Deployment

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Set up the environment variables in the Vercel dashboard
4. Deploy!

### Custom Server Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

MongoDB Login Info

spencerhawhee
1Gbo8UpoA72wgw8j