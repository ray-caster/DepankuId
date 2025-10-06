# Environment Variables Setup

## Port Configuration

To configure the application port using environment variables, create a `.env.local` file in the project root:

```bash
# .env.local
PORT=1000
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:1000
```

## How it Works

The application now uses environment variables for port configuration:

- **Default Port:** 1000 (if no PORT environment variable is set)
- **Custom Port:** Set the `PORT` environment variable to any port you prefer

## Usage Examples

### Method 1: Environment File (Recommended)
1. Create `.env.local` file:
   ```bash
   PORT=1000
   ```

2. Run the application:
   ```bash
   npm run dev
   ```

### Method 2: Command Line
```bash
# Set port temporarily
PORT=3000 npm run dev

# Or use the default (1000)
npm run dev
```

### Method 3: Cross-platform with cross-env
If you want to ensure cross-platform compatibility, you can install `cross-env`:

```bash
npm install --save-dev cross-env
```

Then update package.json scripts:
```json
{
  "scripts": {
    "dev": "cross-env PORT=1000 next dev",
    "start": "cross-env PORT=1000 next start"
  }
}
```

## Available Scripts

- `npm run dev` - Development server (uses PORT env var or defaults to 1000)
- `npm run start` - Production server (uses PORT env var or defaults to 1000)
- `node scripts/dev.js` - Custom dev script that starts both frontend and backend

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 1000 | Port for the Next.js application |
| `NEXT_PUBLIC_API_URL` | http://localhost:5000 | Backend API URL |
| `NEXT_PUBLIC_FRONTEND_URL` | http://localhost:1000 | Frontend URL |
