import { useEffect, useState } from "react";
import { ChevronLeft, Save, FileText, AlertCircle } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useBlog } from "../context/blogContext";

const BlogForm = ({ setCurrentPage, blogId, isEdit = false }) => {
  const { user } = useAuth();
  const { api } = useBlog();
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && blogId) {
      loadBlog();
    }
  }, [isEdit, blogId]);

  const loadBlog = async () => {
    try {
      const blog = await api.getBlog(blogId);
      setFormData({ title: blog.title, content: blog.content });
    } catch (error) {
      console.error("Error loading blog:", error);
      setError("Failed to load blog");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please login to create or edit posts");
      return;
    }

    if (!user.email || !user.password) {
      setError("Authentication credentials missing. Please login again.");
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Both title and content are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isEdit) {
        await api.updateBlog(blogId, formData.title, formData.content);
      } else {
        await api.createBlog(formData.title, formData.content);
      }
      setCurrentPage("home");
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "An error occurred while saving the post");

      if (err.message.includes("Authentication failed")) {
        setError("Authentication failed. Please logout and login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h3>
          <p className="text-gray-600 mb-6">
            You need to be logged in to create or edit posts.
          </p>
          <button
            onClick={() => setCurrentPage("home")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage("home")}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Cancel</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {isEdit ? "Edit Blog" : "Create New Blog"}
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {isEdit ? "Update your thoughts" : "Share your story"}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {isEdit
                ? "Update your thoughts and ideas"
                : "Write something amazing for the world to read"}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 font-medium text-sm sm:text-base">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Blog Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter an engaging title..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-base sm:text-lg font-medium"
                required
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Content *
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Share your thoughts, experiences, and insights..."
                rows={16}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-y text-sm sm:text-base"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                {formData.content.split(/\s+/).filter(Boolean).length} words
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    {isEdit ? "Updating..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isEdit ? "Update Blog" : "Publish Blog"}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage("home")}
                className="flex-1 sm:flex-initial px-6 py-3 sm:py-4 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;
