import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useAuth } from "../context/authContext";
import { useBlog } from "../context/blogContext";
import BlogCard from "./blogCard";
import Pagination from "../Components/Pagnation/pagination";
import {
  Search,
  Filter,
  TrendingUp,
  Users,
  BookOpen,
  Plus,
  Sparkles,
  AlertCircle,
} from "lucide-react";

const Home = ({ setCurrentPage, setBlogId }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blogPage, setBlogPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [authorEmails, setAuthorEmails] = useState({});
  const [visibleBlogs, setVisibleBlogs] = useState(6);
  const observerRef = useRef();

  const { user } = useAuth();
  const { api } = useBlog();

  useEffect(() => {
    loadBlogs(blogPage);
  }, [blogPage]);

  const loadBlogs = async (page) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.getBlogs(page, 12);
      const blogsData = response.blogs;

      const uniqueAuthorIds = [...new Set(blogsData.map((blog) => blog.authorId))];
      const emailsMap = { ...authorEmails };
      const newAuthors = uniqueAuthorIds.filter((id) => !emailsMap[id]);

      if (newAuthors.length > 0) {
        const emailPromises = newAuthors.map(async (authorId) => {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_BASE_URL}/user/${authorId}`
            );
            const data = await res.json();
            return { authorId, email: data.email };
          } catch (err) {
            console.error("Error fetching author email:", authorId);
            return { authorId, email: "Unknown" };
          }
        });

        const results = await Promise.all(emailPromises);
        results.forEach(({ authorId, email }) => {
          emailsMap[authorId] = email;
        });
      }

      setAuthorEmails(emailsMap);
      setBlogs(blogsData);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error loading blogs:", error);
      setError("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.authorName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [blogs, searchTerm]);

  const lastBlogRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && visibleBlogs < filteredBlogs.length) {
            setVisibleBlogs((prev) => Math.min(prev + 6, filteredBlogs.length));
          }
        },
        { threshold: 0.1, rootMargin: "100px" }
      );

      if (node) observerRef.current.observe(node);
    },
    [loading, visibleBlogs, filteredBlogs.length]
  );

  const handleView = useCallback(
    (id) => {
      setBlogId(id);
      setCurrentPage("detail");
    },
    [setBlogId, setCurrentPage]
  );

  const handleEdit = useCallback(
    (id) => {
      setBlogId(id);
      setCurrentPage("edit");
    },
    [setBlogId, setCurrentPage]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm("Are you sure you want to delete this blog?")) {
        try {
          await api.deleteBlog(id);
          await loadBlogs(blogPage);
        } catch (error) {
          console.error("Error deleting blog:", error);
          alert("Failed to delete blog. Please try again.");
        }
      }
    },
    [api, blogPage]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white shadow-lg">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-xs sm:text-sm font-medium">
                Welcome to Blogify - Where Ideas Come to Life
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight">
              Share Your Story
              <span className="block text-yellow-300 mt-2">Inspire the World</span>
            </h1>
            
            <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-indigo-100 px-4">
              Join our vibrant community of storytellers, thought leaders, and
              innovators. Share your ideas and discover perspectives that will
              inspire and transform your thinking.
            </p>
            
            {user && (
              <button
                onClick={() => setCurrentPage("create")}
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-indigo-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 mt-4"
              >
                <Plus className="w-5 h-5" />
                Create Your First Blog
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{blogs.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Total Blogs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {Object.keys(authorEmails).length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Active Writers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalPages}</p>
                <p className="text-xs sm:text-sm text-gray-600">Pages</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search blogs by title, content, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none text-sm sm:text-base"
            />
          </div>
          <button className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-500 transition-all duration-200 font-medium text-gray-700 hover:text-indigo-600 w-full sm:w-auto justify-center">
            <Filter className="w-5 h-5" />
            <span className="text-sm sm:text-base">Filter</span>
          </button>
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 font-medium text-sm sm:text-base">{error}</p>
          </div>
        )}

        {filteredBlogs.length === 0 && !loading ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-2xl shadow-lg">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg sm:text-xl text-gray-600 mb-2 px-4">
              {searchTerm
                ? "No blogs found matching your search."
                : "No blogs available yet."}
            </p>
            <p className="text-sm sm:text-base text-gray-500 px-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : user
                ? "Be the first to create a blog!"
                : "Check back later for new content!"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredBlogs.slice(0, visibleBlogs).map((blog, index) => {
                const isLastBlog = index === visibleBlogs - 1;
                return (
                  <div
                    key={blog.id}
                    ref={isLastBlog ? lastBlogRef : null}
                  >
                    <BlogCard
                      blog={blog}
                      authorEmail={authorEmails[blog.authorId]}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      user={user}
                    />
                  </div>
                );
              })}
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                <p className="mt-4 text-gray-600 font-medium text-sm sm:text-base">Loading blogs...</p>
              </div>
            )}

            {visibleBlogs < filteredBlogs.length && !loading && (
              <div className="text-center mt-8 sm:mt-12">
                <button
                  onClick={() =>
                    setVisibleBlogs((prev) => Math.min(prev + 6, filteredBlogs.length))
                  }
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  Load More ({filteredBlogs.length - visibleBlogs} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={blogPage}
        totalPages={totalPages}
        onPageChange={setBlogPage}
      />
    </div>
  );
};

export default Home;
