
import { Outlet } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-end mb-8">
          <ProfileMenu />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
