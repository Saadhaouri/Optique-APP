import React from "react";
import { Link } from "react-router-dom";
// Corrected import statement for the image
import { IoGlassesOutline } from "react-icons/io5";
import useUser from "../hook/useUser";

const Header: React.FC = () => {
  const { userAuth, loading, error } = useUser();

  // Function to generate avatar letters
  const generateAvatarLetters = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <div className="w-full top-0 flex flex-row items-center justify-between bg-white p-4 border-b border-gray-300">
      {/* Logo */}
      <div className="flex justify-center items-center ">
        <IoGlassesOutline className="text-[36px] text-blue-500 mr-2" />
        <strong className="text-blue-500 text-lg font-semibold">
          MAYAN OPTIQUE
        </strong>
      </div>

      {/* User Info */}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Link
          to="/profile"
          className="hover:bg-gray-100 hover:cursor-pointer p-2 rounded-full"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white font-bold rounded-full mr-2">
              {userAuth
                ? generateAvatarLetters(userAuth.firstName, userAuth.lastName)
                : ""}
            </div>
            <span className="text-gray-700 text-lg">
              {userAuth ? `${userAuth.firstName} ${userAuth.lastName}` : ""}
            </span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Header;
