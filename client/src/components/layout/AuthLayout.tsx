import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Perfume Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-100 relative">
        <img
          src="/images/perfume-banner.png"
          alt="Perfume"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right side - Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
