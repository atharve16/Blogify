import React, { createContext, useContext } from "react";
import { useAuth } from "./authContext";

const BlogContext = createContext();

// Helper function to create Basic Auth header
const createAuthHeader = (email, password) => {
  const credentials = btoa(`${email}:${password}`);
  return `Basic ${credentials}`;
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

const blogApi = {
  getBlogs: async (page = 0, size = 12) => {
    try {
      const res = await fetch(`${BASE_URL}/blogs`);
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      const blogs = Array.isArray(data) ? data : [];
      const startIndex = page * size;
      const paginatedBlogs = blogs.slice(startIndex, startIndex + size);
      return {
        blogs: paginatedBlogs,
        totalPages: Math.ceil(blogs.length / size),
        totalBlogs: blogs.length,
      };
    } catch (error) {
      console.error("Error in getBlogs:", error);
      return {
        blogs: [],
        totalPages: 0,
        totalBlogs: 0,
      };
    }
  },

  getBlog: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/blogs/${id}`);
      if (!res.ok) throw new Error("Failed to fetch blog");
      return await res.json();
    } catch (error) {
      console.error("Error in getBlog:", error);
      throw error;
    }
  },

  createBlog: async (title, content, userCredentials) => {
    try {
      const res = await fetch(`${BASE_URL}/blogs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: createAuthHeader(
            userCredentials.email,
            userCredentials.password
          ),
        },
        body: JSON.stringify({
          title,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Failed to create blog");
      return await res.json();
    } catch (error) {
      throw error;
    }
  },

  updateBlog: async (id, title, content, userCredentials) => {
    try {
      const res = await fetch(`${BASE_URL}/blogs/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: createAuthHeader(
            userCredentials.email,
            userCredentials.password
          ),
        },
        body: JSON.stringify({
          title,
          content,
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Failed to update blog");
      return await res.json();
    } catch (error) {
      throw error;
    }
  },

  deleteBlog: async (id, userCredentials) => {
    try {
      const res = await fetch(`${BASE_URL}/blogs/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: createAuthHeader(
            userCredentials.email,
            userCredentials.password
          ),
        },
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};

// Blog Provider
const BlogProvider = ({ children }) => {
  const { user } = useAuth();

  // Enhanced API object that includes user credentials
  const api = {
    ...blogApi,
    createBlog: (title, content) => blogApi.createBlog(title, content, user),
    updateBlog: (id, title, content) =>
      blogApi.updateBlog(id, title, content, user),
    deleteBlog: (id) => blogApi.deleteBlog(id, user),
  };

  return (
    <BlogContext.Provider value={{ api }}>
      {children}
    </BlogContext.Provider>
  );
};

const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};

export { BlogProvider, useBlog };
