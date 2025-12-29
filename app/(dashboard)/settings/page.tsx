"use client";

import { useState, useEffect } from "react";
import { getCurrentUser, saveUser } from "@/services/auth";
import { updateUser, updateUserImage, deleteUser, getUserData } from "@/services/user";
import { User } from "@/types";
import { Shield, User as UserIcon, Mail, Phone, Calendar, Upload, Trash2, Save, AlertCircle, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "EG",
    dialCode: "+20",
    phone: "",
    dateOfBirth: "",
    gender: "male" as "male" | "female",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = getCurrentUser();
      if (userData) {
        setUser(userData);
        setFormData({
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          countryCode: userData.countryCode,
          dialCode: userData.dialCode,
          phone: userData.phone,
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender,
        });

        // Fetch latest user data from API
        const response = await getUserData({ username: userData.username });
        setUser(response.userData);
        // Update localStorage with latest data from API
        saveUser(response.userData);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUpdateLoading(true);

    try {
      const response = await updateUser(formData);
      setSuccess(response.message_en);
      // Update localStorage with new user data
      saveUser({ ...user!, ...formData });
      await loadUserData();
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateImage = async () => {
    if (!selectedImage || !user) return;

    setError("");
    setSuccess("");
    setImageLoading(true);

    try {
      const response = await updateUserImage(user.username, selectedImage);
      setSuccess(response.message_en);
      setSelectedImage(null);
      setImagePreview(null);
      await loadUserData();
    } catch (err: any) {
      setError(err.message || "Failed to update profile image");
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setError("");
    setSuccess("");
    setDeleteLoading(true);

    try {
      await deleteUser({ username: user.username });
      // Logout and redirect to login
      localStorage.removeItem("user");
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/login";
    } catch (err: any) {
      setError(err.message || "Failed to delete account");
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-gray-400">Manage your profile and account preferences</p>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-severity-critical/10 border border-severity-critical/50 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top duration-300">
          <AlertCircle className="w-5 h-5 text-severity-critical flex-shrink-0 mt-0.5" />
          <p className="text-sm text-severity-critical">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-500">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <div className="card hover:shadow-xl hover:shadow-accent-blue/5 transition-all duration-300">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <div className="p-2 bg-accent-blue/20 rounded-lg">
              <Upload className="w-5 h-5 text-accent-blue" />
            </div>
            Profile Picture
          </h2>

          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent-blue/30 to-accent-purple/30 flex items-center justify-center mb-4 overflow-hidden ring-4 ring-accent-blue/20 group-hover:ring-accent-blue/40 transition-all duration-300">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : user?.image ? (
                    <img 
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${user.image}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <UserIcon className="w-16 h-16 text-accent-blue" />
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="relative inline-flex items-center justify-center px-6 py-2.5 font-medium text-white bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg overflow-hidden group cursor-pointer mb-3 w-full transition-all duration-300 hover:shadow-lg hover:shadow-gray-700/50"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Choose Image
                </span>
              </label>

              {selectedImage && (
                <button
                  onClick={handleUpdateImage}
                  disabled={imageLoading}
                  className="relative inline-flex items-center justify-center px-6 py-2.5 font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg overflow-hidden group w-full transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent-purple to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    {imageLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Upload Image
                      </>
                    )}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="card lg:col-span-2 hover:shadow-xl hover:shadow-accent-blue/5 transition-all duration-300">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <div className="p-2 bg-accent-blue/20 rounded-lg">
              <UserIcon className="w-5 h-5 text-accent-blue" />
            </div>
            Profile Information
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.username}
                    disabled
                    className="input pl-10 bg-card-hover cursor-not-allowed"
                  />
                </div>
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input pl-10"
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input pl-10"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="input pl-10"
                    required
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" })}
                  className="input"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={updateLoading}
              className="relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent-purple to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                {updateLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-2 border-severity-critical/30 hover:border-severity-critical/50 hover:shadow-xl hover:shadow-severity-critical/10 transition-all duration-300">
        <h2 className="text-xl font-semibold text-severity-critical mb-4 flex items-center gap-2">
          <div className="p-2 bg-severity-critical/20 rounded-lg">
            <Trash2 className="w-5 h-5" />
          </div>
          Danger Zone
        </h2>

        {!showDeleteConfirm ? (
          <div>
            <p className="text-gray-400 mb-6">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="relative inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-gradient-to-r from-severity-critical to-red-700 rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-severity-critical/50"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-700 to-severity-critical opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-severity-critical/10 border border-severity-critical/50 rounded-xl p-5">
              <p className="text-severity-critical font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Are you absolutely sure?
              </p>
              <p className="text-gray-400 text-sm">
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="relative inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-gradient-to-r from-severity-critical to-red-700 rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-severity-critical/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-700 to-severity-critical opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center gap-2">
                  {deleteLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Yes, delete my account
                    </>
                  )}
                </span>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="relative inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-gray-700/50"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative">Cancel</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
