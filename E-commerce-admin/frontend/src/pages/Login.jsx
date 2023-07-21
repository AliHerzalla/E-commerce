import { useEffect } from "react";
import googleLogo from "../assets/google-logo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLoginWithGoogle = () => {
    window.open(
      `${
        String(import.meta.env.VITE_BACKEND_ADMIN_URL) +
        String(import.meta.env.VITE_BACKEND_ADMIN_PORT)
      }/auth/google`,
      "_self"
    );
  };

  useEffect(() => {
    try {
      fetch(
        `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
          import.meta.env.VITE_BACKEND_ADMIN_PORT
        }/auth/login/success`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((response) => response.json().then(() => navigate("/dashboard")));
    } catch (error) {
      console.log(error);
    }

    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "light");
      document.getElementsByTagName("html")[0].className = "light";
    }

    if (localStorage.getItem("theme") == "dark") {
      document.getElementsByTagName("html")[0].className = "dark";
    } else {
      document.getElementsByTagName("html")[0].className = "light";
    }
  }, [navigate]);

  return (
    <div
      className={
        "w-screen h-screen flex justify-center items-center bg-white dark:bg-[#1f1f1f]"
      }
    >
      <button
        onClick={handleLoginWithGoogle}
        className={
          "dark:text-white text-[#1f1f1f] w-fit flex items-center gap-3 dark:hover:border-white border-[#4a4545] hover:border-[#1f1f1f] border-[3px] rounded-md p-2 dark:bg-[#1f1f1f] transition-all duration-200 hover:bg-slate-100"
        }
      >
        Login with google
        <img
          src={googleLogo}
          alt="google logo"
          className={"object-cover w-6 rounded-full"}
        />
      </button>
    </div>
  );
};

export default Login;
