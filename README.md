# Predictive Maintenance Agent

This project is an AI-powered predictive maintenance system for the automotive industry. It utilizes multi-agent architecture to analyze vehicle telemetry data, detect anomalies, and schedule maintenance appointments.

## Features

- **Multi-Agent System**:
  - **Master Agent**: Orchestrates the workflow between specialized agents.
  - **Data Ingestion Agent**: Parses and normalizes CSV telemetry data.
  - **Anomaly Detection Agent**: Analyzes sensor data to identify critical issues.
  - **Scheduling Agent**: Manages service appointments with backend integration.
  - **Chatbot Agent**: Provides a natural language interface for users to interact with the system.
  - **Notification Agent**: Handles alerts and status updates.

- **Dashboard**:
  - Real-time visualization of agent activities.
  - Interactive charts for telemetry data.
  - Drag-and-drop CSV file upload.

- **Technology Stack**:
  - **Frontend**: Next.js 16, React 19, Tailwind CSS
  - **AI/ML**: LangChain, Google Gemini
  - **Backend**: Firebase (Firestore, Auth)
  - **Visualization**: Recharts, Framer Motion

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Firebase project credentials
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   GOOGLE_GENERATIVE_AI_API_KEY=...
   ```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js app router pages and API routes.
- `components/`: Reusable UI components.
- `lib/`: Utility functions, agent logic, and Firebase configuration.
- `lib/agents/`: Implementation of the multi-agent system.
- `types/`: TypeScript definitions.

## Usage

1. **Sign In**: Log in using your credentials.
2. **Upload Data**: Navigate to the Analysis Dashboard and upload a vehicle telemetry CSV file.
3. **Analyze**: The system will automatically ingest data and detect anomalies.
4. **Interact**: Use the chat interface to ask questions about the vehicle status or schedule maintenance.
5. **Schedule**: Confirm appointments directly through the agent or the scheduling interface.
