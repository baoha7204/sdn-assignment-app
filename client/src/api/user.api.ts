import { customAxios } from "@/config/axios";
import { ProfileInputs } from "@/pages/Profile/ProfileForm";

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
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
};

export default userApi;
