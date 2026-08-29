import { useState } from "react";

import type {
  User,
  UserRegistration,
  UserUpdate,
} from "../types/userRegistration.type";

import userService from "../service/userService";

const useUserRegistration = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [userList, setUserList] =
    useState<User[]>([]);

  // ============================================
  // CREATE USER
  // ============================================

  const registerUser = async (
    payload: UserRegistration
  ) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      console.log("User payload:", payload);

      const response =
        await userService.saveUser(payload);

      console.log(
        "Create user response:",
        response
      );

      setSuccessMessage(
        "User registered successfully."
      );

      return response;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while registering the user.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // GET USER LIST
  // ============================================

  const getUserList = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await userService.getUserList();

      console.log(
        "User list response:",
        response
      );

      setUserList(response.data);

      return response;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while getting users.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // UPDATE USER
  // ============================================

  const updateUser = async (
    userId: string,
    payload: UserUpdate
  ) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      console.log(
        "Update user ID:",
        userId
      );

      console.log(
        "Update user payload:",
        payload
      );

      const response =
        await userService.updateUser(
          userId,
          payload
        );

      setSuccessMessage(
        "User updated successfully."
      );

      await getUserList();

      return response;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the user.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // DELETE USER
  // ============================================

  const deleteUser = async (
    userId: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      console.log(
        "Delete user ID:",
        userId
      );

      const response =
        await userService.deleteUser(
          userId
        );

      setSuccessMessage(
        "User deleted successfully."
      );

      await getUserList();

      return response;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while deleting the user.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    registerUser,
    getUserList,
    updateUser,
    deleteUser,
    userList,
    loading,
    error,
    successMessage,
  };
};

export default useUserRegistration;