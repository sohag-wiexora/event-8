Event-8 — Social Development Events Platform
A full-stack web application for discovering and managing social development events. Visitors can explore upcoming events, view event details, and create an account to join events. Authenticated users can also create and manage their own events and review the events they have joined.

Live application: https://event-8-vert.vercel.app
Backend API: https://event-8-server.onrender.com
Note: The live frontend URL may be temporarily unreachable depending on deployment, DNS, or network availability. The source code is available in the repositories linked below.

Project repositories
- Frontend: https://github.com/sohag-wiexora/event-8
- Backend: https://github.com/sohag-wiexora/event-8-server
Main features
- Browse upcoming events on the public home page.
- Search and filter events, with pagination for event listings.
- Open an event details page to review event information.
- Register and sign in using email and password.
- Google sign-in integration through Better Auth.
- Create events from a protected page after signing in.
- View and manage events created by the signed-in user.
- Edit or delete only events owned by the current user.
- Join events and prevent duplicate joins.
- View joined events in a personal dashboard.
- Protect private API routes using JWT verification.
- Responsive interface with loading states and theme switching.
Technology stack
Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Better Auth React client
Backend
- Node.js
- Express.js
- MongoDB
- Better Auth
- JSON Web Tokens (JWT)
- CORS
Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB
Application structure
event-8/
├── src/
│   ├── app/                 # App Router pages and layouts
│   ├── components/          # Reusable UI components
│   └── lib/                 # Client utilities and auth setup
├── public/                  # Static assets
├── package.json
└── README.md

event-8-server/
├── config/                  # MongoDB and Better Auth configuration
├── middleware/              # JWT verification middleware
├── routes/                  # Event API routes
├── index.js                 # Express application entry point
└── package.json
The tree above describes the main areas of the project; individual files may differ as the project evolves.
Run locally
Requirements
- Node.js and npm
- A MongoDB database
- Google OAuth credentials (only if testing Google sign-in)
1. Clone the repositories
git clone https://github.com/sohag-wiexora/event-8.git
git clone https://github.com/sohag-wiexora/event-8-server.git
2. Configure and run the backend
Open the backend directory:
cd event-8-server
npm install
Create a .env file in the backend root. Add your own values; do not commit this file:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=event8DB
BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
Use the actual environment variable names expected by the backend configuration. Keep all credentials private. If the database name is configured inside config/db.js, follow that configuration rather than adding a duplicate variable.

Start the backend using the script defined in package.json, for example:
npm run dev
If no dev script exists, use the project's configured start command.
3. Configure and run the frontend
Open another terminal and enter the frontend directory:
cd event-8
npm install
Create .env.local in the frontend root:
NEXT_PUBLIC_API_URL=http://localhost:5000
Run the development server:
npm run dev
Open http://localhost:3000 in your browser.
Authentication and access control
- Better Auth handles account registration and sign-in.
- Google sign-in requires valid OAuth credentials and correctly configured authorized origins and callback URLs.
- Private event operations require an authenticated session.
- The backend verifies JWTs for protected API requests.
- Event update and delete operations are restricted to the event owner.
- The API prevents a user from joining the same event more than once.
API overview
The backend exposes the Better Auth endpoints under /api/auth and event-related endpoints under /api/events.

The exact event route paths and HTTP methods are defined in routes/eventRoutes.js. Refer to that file for the current endpoint contract.
Security and configuration notes
- Never commit .env, .env.local, database credentials, OAuth secrets, or Better Auth secrets.
- Configure production frontend origins in the backend's CLIENT_URL environment variable.
- Configure the public Better Auth base URL consistently with the URL through which authentication requests reach the backend.
- Use HTTPS for production deployments.
- Do not expose private server environment variables through NEXT_PUBLIC_ variables.
Development notes
This project was implemented through hands-on development: setting up the frontend and backend, connecting MongoDB, integrating authentication, building event workflows, testing protected operations, and deploying the two applications separately. The code and commit history in the linked repositories provide the implementation record.
Author
Md Sohag Islam
GitHub: https://github.com/sohag-wiexora