import React, { useState, useEffect, useContext } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import AuthContext from "../AuthContext";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const Profile = () => {
  const authContext = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    imageUrl: "",
    role: "",
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetchWithAuth("http://localhost:4000/api/auth/profile");
        const data = await response.json();
        if (response.ok) {
          setProfileData(data);
        } else {
          setError(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const [profileImage, setProfileImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("firstName", profileData.firstName);
      formData.append("lastName", profileData.lastName);
      formData.append("phoneNumber", profileData.phoneNumber);
      formData.append("imageUrl", profileData.imageUrl); // Fallback if no new image
      
      if (password) {
        formData.append("password", password);
      }
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      // We cannot use fetchWithAuth directly if we want the browser to set the multipart boundary automatically.
      // fetchWithAuth sets Content-Type to application/json by default.
      // So we will do a custom fetch but attach the token.
      const token = localStorage.getItem("token");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      // Need CSRF token for custom fetch
      let csrfToken = sessionStorage.getItem("csrfToken");
      if (!csrfToken) {
        const csrfRes = await fetch("http://localhost:4000/api/auth/csrf-token", { credentials: "include" });
        const csrfData = await csrfRes.json();
        csrfToken = csrfData.csrfToken;
        sessionStorage.setItem("csrfToken", csrfToken);
      }
      headers["CSRF-Token"] = csrfToken;

      const response = await fetch("http://localhost:4000/api/auth/profile/update", {
        method: "PUT",
        headers,
        credentials: "include",
        body: formData
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(data.user));
        setProfileData({ ...profileData, imageUrl: data.user.imageUrl });
        authContext.signin(data.user, () => {});
        setPassword("");
        setProfileImage(null);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-sm ring-1 ring-black ring-opacity-5 rounded-xl overflow-hidden mt-8">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 uppercase tracking-wide">
          {profileData.role}
        </span>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <p className="text-sm text-green-700">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6 mb-8">
            {profileData.imageUrl ? (
              <img src={profileData.imageUrl} alt="Profile" className="h-24 w-24 rounded-full object-cover border border-gray-200 shadow-sm" />
            ) : (
              <UserCircleIcon className="h-24 w-24 text-gray-400" />
            )}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                value={profileData.firstName}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                value={profileData.lastName}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (Read Only)</label>
              <input
                type="email"
                disabled
                value={profileData.email}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-500 sm:text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
