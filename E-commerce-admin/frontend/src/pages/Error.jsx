import { useEffect } from "react";
import { Link } from "react-router-dom";

const Error = () => {
  useEffect(() => {
    if (!localStorage.getItem("path")) {
      localStorage.setItem("path", "/dashboard");
    }
    localStorage.setItem("path", "/dashboard");
  }, []);

  return (
    <>
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="px-4 lg:py-12">
          <div className="lg:gap-4 lg:flex">
            <div className="flex flex-col items-center justify-center md:py-24 lg:py-32">
              <h1 className="font-bold text-blue-600 text-9xl">404</h1>
              <p className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
                <span className="text-red-500">Oops!</span> <span>Page</span>{" "}
              </p>
              <p className="mb-8 text-center md:text-lg">
                The page you’re looking for doesn’t exist.
              </p>
              <Link
                to="/dashboard"
                className="px-5 py-2 rounded-md text-blue-100 bg-blue-600 hover:bg-blue-700 font-bold"
              >
                Go home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error;
