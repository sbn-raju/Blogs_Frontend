import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BlogDetailPage = () => {
  const { id } = useParams(); // Get the id from the URL parameters
  const [blog, setBlog] = useState(null); // Default to null
  const navigate = useNavigate();

  // Fetch the blog based on the id
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/read/blogs?id=${id}`);
        const data = await response.json();
        console.log("This is the blog data", data);

        if (data.success) {
          setBlog(data.data); // Set the blog data
        } else {
          console.log("Blog not found:", data);
          // Redirect or show an error message if the blog is not found
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        // Redirect or show an error message on fetch error
      }
    };

    fetchBlog();
  }, [id]);

  // Show loading state while the blog is being fetched
  if (!blog) {
    return <div>Loading...</div>;
  }

  // Handle case where `blog` is an object instead of an array
  const blogData = Array.isArray(blog) ? blog[0] : blog;

  return (
    <div className="h-auto bg-gray-100 flex flex-col">
      {/* Blog Header */}
      <header className="bg-blue-600 text-black py-4 px-6 shadow-md">
        <h1 className="text-3xl font-bold text-center">{blogData.title}</h1>
      </header>

      {/* Blog Content */}
      <main className="flex-grow container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        {/* Blog Image */}
        {blogData.micro_image_path && (
          <img
            src={blogData.micro_image_path}
            alt={blogData.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
        )}

        {/* Blog Description */}
        <p className="text-lg text-gray-700 mb-4">{blogData.description}</p>

        {/* Blog HTML Content */}
        <article
          className="prose max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blogData.body }}
        ></article>
      </main>
    </div>
  );
};

export default BlogDetailPage;
