import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Heart,
  ArrowRight,
  Edit,
  Trash2,
  Sparkles,
  User,
} from "lucide-react";

const BlogCard = ({ blog, authorEmail, onView, onEdit, onDelete, user }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const getReadTime = (content) => {
    const words = content?.split(" ").length || 0;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const canEdit = user && user.email === authorEmail;

  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-cyan-500 to-blue-600",
  ];
  const cardGradient = gradients[blog.id % gradients.length];

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${cardGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      ></div>

      {/* Glowing border effect */}
      <div
        className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${cardGradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`}
      ></div>

      <div className="relative p-6 space-y-4 flex flex-col flex-grow">
        {/* Header with badge and reading time */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${cardGradient} text-white shadow-md`}
          >
            <Sparkles className="w-3 h-3" />
            Featured
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {getReadTime(blog.content)}
          </div>
        </div>

        {/* Decorative icon that appears on hover */}
        {isHovered && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <ArrowRight className="w-6 h-6 text-indigo-600 transform group-hover:translate-x-1 transition-transform" />
          </div>
        )}

        {/* Blog Title */}
        <h3 className="text-2xl font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300 min-h-[3.5rem]">
          {blog.title}
        </h3>

        {/* Blog Content Preview */}
        <p className="text-gray-600 line-clamp-3 leading-relaxed flex-grow">
          {blog.content.substring(0, 150)}...
        </p>

        {/* Author Info */}
        <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${cardGradient} flex items-center justify-center text-white font-bold shadow-md flex-shrink-0`}
          >
            {blog.authorName?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {blog.authorName || "Anonymous"}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{formatDate(blog.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center space-x-2 hover:text-red-500 transition-all duration-300 hover:scale-110 ${
              isLiked ? "text-red-500" : "text-gray-500"
            }`}
            aria-label="Like blog"
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-sm font-medium">{isLiked ? 1 : 0}</span>
          </button>

          <div className="flex items-center gap-2">
            {canEdit && (
              <>
                <button
                  onClick={() => onEdit(blog.id)}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition-all duration-300 hover:scale-110"
                  aria-label="Edit blog"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(blog.id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-all duration-300 hover:scale-110"
                  aria-label="Delete blog"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Read More Button */}
        <button
          onClick={() => onView(blog.id)}
          className={`w-full flex items-center justify-center space-x-2 bg-gradient-to-r ${cardGradient} text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm mt-auto`}
        >
          <span>Read Full Story</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
