import apiClient from "./api";
import {
  UpdateUserRequest,
  UpdateUserResponse,
  UpdateImageResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  GetUserRequest,
  GetUserResponse,
} from "@/types";

/**
 * Update user profile information
 */
export async function updateUser(data: UpdateUserRequest): Promise<UpdateUserResponse> {
  const response = await apiClient.post<UpdateUserResponse>("/user/update", data);
  return response.data;
}

/**
 * Update user profile image
 */
export async function updateUserImage(username: string, image: File): Promise<UpdateImageResponse> {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("image", image);

  const response = await apiClient.post<UpdateImageResponse>("/user/update-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

/**
 * Delete user account
 */
export async function deleteUser(data: DeleteUserRequest): Promise<DeleteUserResponse> {
  const response = await apiClient.post<DeleteUserResponse>("/user/delete", data);
  return response.data;
}

/**
 * Get user data by username
 */
export async function getUserData(data: GetUserRequest): Promise<GetUserResponse> {
  const response = await apiClient.post<GetUserResponse>("/user/get", data);
  return response.data;
}
