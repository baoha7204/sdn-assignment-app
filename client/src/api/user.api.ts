import { customAxios } from "@/config/axios";
import { ProfileInputs } from "@/pages/Profile/ProfileForm";

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  YOB: number;
  gender: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

const userApi = {
  updateProfile: async (profileData: ProfileInputs) => {
    const response = await customAxios.put("/users/profile", profileData);
    return response.data;
  },

  changePassword: async (passwordData: ChangePasswordData) => {
    const response = await customAxios.patch(
      "/users/profile/password",
      passwordData
    );
    return response.data;
  },

  getAllUsers: async (page = 1, limit = 10, search = "") => {
    const response = await customAxios.get("/users", {
      params: { page, limit, search },
    });
    return response.data as UsersResponse;
  },
};

export default userApi;
