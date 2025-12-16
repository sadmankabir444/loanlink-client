import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  const status = error?.status || 500;
  const message =
    error?.statusText ||
    error?.message ||
    "Something went wrong. Please try again.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-xl w-full text-center bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/40 dark:border-gray-700">

        {/* Status Code */}
        <h1 className="text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
          {status}
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Oops! Something broke
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl font-medium bg-orange-500 text-white hover:bg-orange-600 transition"
          >
            Go Home
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Reload Page
          </button>
        </div>

        {/* Footer hint */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
