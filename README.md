# Auto-Framer

Automatically crop videos to different aspect ratios using MediaPipe Pose.

## Local Setup
1. Fill `.env` with your credentials (Google OAuth & Supabase/Postgres).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```

## Docker Setup
1. Build the image and Run the container 
   ```bash
   docker rm -f auto-framer || true && docker build -t auto-framer . && docker run -p 5001:5001 --name auto-framer --env-file .env auto-framer
   ```


## Requirements
- Node.js & Python 3
- FFmpeg installed on system
- OIDC Provider (e.g., Google Cloud Console)
- PostgreSQL database
