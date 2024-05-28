import { Link } from "react-router-dom";

const { Outlet } = require("react-router-dom");

const Root = () => {
  return (
    <div className="flex flex-row flex-1 h-screen">
      <div className="flex flex-col gap-3 w-60 items-center pt-16 bg-green-200">
        <Link className="bg-gray-600 px-3 py-2 w-fit text-white" to={"/"}>Home</Link>
        <Link className="bg-gray-600 px-3 py-2 w-fit text-white" to={"/client1"}>Client 1</Link>
        <Link className="bg-gray-600 px-3 py-2 w-fit text-white" to={"/client2"}>Client 2</Link>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Root
