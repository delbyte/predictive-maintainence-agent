import Link from 'next/link';
import SignInForm from '@/components/auth/SignInForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left side - Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Predictive Maintenance
            </h1>
            <p className="text-xl text-gray-600">
              AI-powered vehicle diagnostics and maintenance scheduling
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Multi-Agent Analysis</h3>
                <p className="text-sm text-gray-600">
                  Coordinated AI agents analyze your vehicle data in real-time
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🔍</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Anomaly Detection</h3>
                <p className="text-sm text-gray-600">
                  Identify potential issues before they become major problems
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">📅</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Smart Scheduling</h3>
                <p className="text-sm text-gray-600">
                  Automated appointment booking with email notifications
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign In Form */}
        <div>
          <SignInForm />
        </div>
      </div>

      <p className="mt-12 text-sm text-gray-500">
        Upload CSV • AI Analysis • Email Alerts • Schedule Maintenance
      </p>
    </div>
  );
}
