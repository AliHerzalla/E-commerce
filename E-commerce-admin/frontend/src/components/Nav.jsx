import { useEffect, useContext, useState } from "react";
import { Context } from "../contextApi/contextApi";
import { Link, useNavigate } from "react-router-dom";
import { Switch } from "@headlessui/react";
import { BiLogOut } from "react-icons/bi";

const Nav = () => {
  // Context Api
  const { setUserInformation } = useContext(Context);

  const [enabled, setEnabled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [selected, setSelected] = useState("/dashboard");

  const navigate = useNavigate();

  useEffect(() => {
    const userInformation = () => {
      try {
        fetch(
          `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
            import.meta.env.VITE_BACKEND_ADMIN_PORT
          }/auth/login/success`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": "true",
            },
          }
        )
          .then((response) => {
            response
              .json()
              .then((result) => {
                setUserInformation(result);
              })
              .catch((error) => console.log(error));
          })
          .catch((error) => {
            navigate("/login");
            console.log(error);
          });
      } catch (error) {
        console.log(error);
        navigate("/login");
      }
    };

    const selectedPath = localStorage.getItem("path");
    setSelected(selectedPath);
    navigate(selectedPath);
    if (
      selectedPath != "/dashboard" &&
      selectedPath != "/sittings" &&
      selectedPath != "/orders"
    ) {
      setSelected("/products");
    }

    userInformation();
  }, [setUserInformation, navigate]);

  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "light");
      document.getElementsByTagName("html")[0].className = "light";
      setEnabled(false);
      setTheme("light");
    }
    const themeMode = localStorage.getItem("theme");
    changeTheme(themeMode);
  }, []);

  const changeTheme = (themeMode) => {
    switch (themeMode) {
      case "light": {
        localStorage.setItem("theme", "light");
        document.getElementsByTagName("html")[0].className = "light";
        setEnabled(false);
        setTheme("light");
        break;
      }
      case "dark": {
        localStorage.setItem("theme", "dark");
        document.getElementsByTagName("html")[0].className = "dark";
        setEnabled(true);
        setTheme("dark");
        break;
      }
      default: {
        localStorage.setItem("theme", "light");
        document.getElementsByTagName("html")[0].className = "light";
        setEnabled(false);
        setTheme("light");
        break;
      }
    }
  };

  const handelLogoutClick = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
          import.meta.env.VITE_BACKEND_ADMIN_PORT
        }/auth/logout`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const linksStyle = "flex items-center gap-2 p-2 md:w-full w-fit";
  const selectedLink =
    "dark:text-black text-white bg-[#1f1f1f] rounded-md dark:bg-white";

  return (
    <aside
      className={
        "p-4 dark:text-white text-[#1f1f1f] dark:bg-[#1f1f1f] bg-white transition-all duration-200 h-screen max-w-[22vw] justify-between fixed col-start-1 w-[20vw] pr-0"
      }
    >
      <div className={"h-[calc(100%-6rem)] overflow-y-auto mb-[15px]"}>
        <Link
          to={"/dashboard"}
          className={"flex items-center gap-2 mb-4 sm:w-full w-fit p-2"}
          onClick={() => {
            setSelected("/dashboard");
            localStorage.setItem("path", "/dashboard");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
            />
          </svg>
          <p className={"md:flex hidden"}>E-commerce Admin</p>
        </Link>
        <nav className={"flex flex-col gap-4"}>
          <Link
            className={`${linksStyle} ${
              selected == "/dashboard" ? selectedLink : ""
            }`}
            to={"/dashboard"}
            onClick={() => {
              setSelected("/dashboard");
              localStorage.setItem("path", "/dashboard");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <p className={"md:flex hidden"}>Dashboard</p>
          </Link>
          <Link
            className={`${linksStyle} ${
              selected == "/products" ? selectedLink : ""
            }`}
            to={"/products"}
            onClick={() => {
              setSelected("/products");
              localStorage.setItem("path", "/products");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
            <p className={"md:flex hidden"}>Products</p>
          </Link>
          <Link
            className={`${linksStyle} ${
              selected == "/orders" ? selectedLink : ""
            }`}
            to={"/orders"}
            onClick={() => {
              setSelected("/orders");
              localStorage.setItem("path", "/orders");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
              />
            </svg>
            <p className={"md:flex hidden"}>Orders</p>
          </Link>
          <Link
            className={`${linksStyle} ${
              selected == "/sittings" ? selectedLink : ""
            }`}
            to={"/sittings"}
            onClick={() => {
              setSelected("/sittings");
              localStorage.setItem("path", "/sittings");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className={"md:flex hidden"}>Sitting</p>
          </Link>
        </nav>
      </div>
      <div className={"flex flex-col gap-3"}>
        <div className={"flex items-center gap-3"}>
          <Switch
            checked={theme == "light" ? false : true}
            onChange={() => changeTheme(theme == "light" ? "dark" : "light")}
            className={`${
              enabled ? "bg-white" : "bg-[#1f1f1f]"
            } relative h-5 w-10 items-center rounded-full`}
          >
            <span
              className={`${
                enabled
                  ? "-translate-x-2 bg-[#1f1f1f]"
                  : "translate-x-2 bg-white"
              } inline-block h-4 w-4 transform rounded-full transition translate-y-0`}
            />
          </Switch>
          <p className={"md:flex hidden"}>Theme</p>
        </div>
        <button
          onClick={handelLogoutClick}
          className={
            "p-2 hover:dark:bg-[#bbb2b2] hover:bg-slate-200 rounded-xl transition-all duration-200 border border-[#1f1f1f] dark:border-white hover:dark:text-[#1f1f1f] justify-center items-center gap-2 flex md:w-full w-fit"
          }
        >
          <BiLogOut className={"w-5 h-5 text-center mr-1"} />
          <p className={"md:block hidden"}>Logout</p>
        </button>
      </div>
    </aside>
  );
};

export default Nav;
