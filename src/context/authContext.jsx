import React, { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext();

const createAuthHeader = (email, password) => {
  const credentials = btoa(`${email}:${password}`);
  return `Basic ${credentials}`;
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

const authApi = {
  login: async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");
      const message = await res.text();
      return { email, password };
    } catch (error) {
      throw new Error("Login failed");
    }
  },

  signup: async (name, email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/user/newUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) throw new Error("Registration failed");
      const message = await res.text();
      return { name, email, password };
    } catch (error) {
      throw new Error("Registration failed");
    }
  },

  logout: async () => {
    try {
      const res = await fetch(`${BASE_URL}/user/logout`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Logout failed");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  },

  getAllUsers: async () => {
    try {
      const res = await fetch(`${BASE_URL}/user`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return await res.json();
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/user/${id}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      return await res.json();
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (userData, userCredentials) => {
    try {
      const res = await fetch(`${BASE_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: createAuthHeader(
            userCredentials.email,
            userCredentials.password
          ),
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) throw new Error("Failed to update user");
      return await res.text();
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id, userCredentials) => {
    try {
      const res = await fetch(`${BASE_URL}/user/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: createAuthHeader(
            userCredentials.email,
            userCredentials.password
          ),
        },
      });

      if (!res.ok) throw new Error("Failed to delete user");
      return await res.text();
    } catch (error) {
      throw error;
    }
  },
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser =
          typeof localStorage !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "null")
            : null;
        setUser(storedUser);
      } catch (error) {
        console.error("Error loading user from storage:", error);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await authApi.login(email, password);
      setUser(userData);
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Error saving user to storage:", error);
      }
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const userData = await authApi.signup(name, email, password);
      setUser(userData);
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Error saving user to storage:", error);
      }
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error removing user from storage:", error);
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      const result = await authApi.updateUser(userData, user);

      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Error saving updated user to storage:", error);
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteUserAccount = async (id) => {
    try {
      const result = await authApi.deleteUser(id, user);
      logout();
      return result;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateUserProfile,
        deleteUserAccount,
        loading,
        authApi,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
