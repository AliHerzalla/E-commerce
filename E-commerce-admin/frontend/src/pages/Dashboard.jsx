import { useContext } from "react";
import { Context } from "../contextApi/contextApi";

const Dashboard = () => {
  const { userInformation } = useContext(Context);
  return (
    <div className={"flex justify-between items-center"}>
      <h2 className={"break-words max-w-[200px] md:w-full"}>
        Hello,{" "}
        <b>
          {userInformation?.user?.first_name} {userInformation?.user?.last_name}
        </b>{" "}
        welcome back.
      </h2>
      <div
        className={
          "flex items-center gap-2 dark:bg-slate-200 p-1 rounded-full dark:text-[#1f1f1f] text-white bg-[#1f1f1f] justify-end md:w-[150px] w-fit "
        }
      >
        <p className={"md:block hidden text-sm"}>
          {userInformation?.user?.first_name} {userInformation?.user?.last_name}
        </p>
        <img
          src={userInformation?.user?.profile_picture}
          alt="profile picture"
          className={"object-cover rounded-full w-10 h-10"}
        />
      </div>
    </div>
  );
};

export default Dashboard;
