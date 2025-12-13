import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold text-error">404</h1>
      <p className="mb-4">{error?.statusText || "Page not found"}</p>
      <Link to="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  );
};

export default ErrorPage;
