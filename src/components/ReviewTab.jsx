import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Popup from "./Popup";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(3);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const [publishMessage, setPublishMessage] = useState("");

  // Fetch blogs from the backend with pagination
  useEffect(() => {
    const fetchBlogs = async () => {
      const offset = (currentPage - 1) * blogsPerPage; // Calculate the offset based on current page
      const limit = blogsPerPage;

      setLoading(true);
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/read-all/review/blogs?limit=${limit}&offset=${offset}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();

        if (data.success) {
          setBlogs(data.data);
          setTotalBlogs(data.totalBlogs);
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, blogsPerPage, publishMessage]);

  // Change page handler
  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBlogView = (id) => {
    navigate(`/view/${id}`);
  };

  const handlePublishBlogs = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_PUBLISH_URL}/publish/blog?id=${id}`,
        {
          method: "POST",
          headers: {
            authorization: `${authState.token}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setPublishMessage(data.message);
      }
    } catch (error) {
      setPublishMessage(error.message);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  return (
    <div className="h-auto bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Review Blogs</h1>

        {/* Blog List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading && <p className="text-black">Loading...</p>}
          {!loading && blogs.length === 0 && (
            <p className="text-gray-500">No blogs available on this page.</p>
          )}
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden"
            >
              {/* Display Picture */}
              <img
                src={blog.micro_image_path}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                {/* Blog Title */}
                <h2 className="text-xl font-semibold text-gray-800">
                  {blog.title}
                </h2>

                {/* Blog Description */}
                <p className="text-gray-600 mt-2">{blog.description}</p>

                {/* Full Blog Content */}
                <div className="mt-4 text-gray-800">
                  <article
                    className="prose max-w-none text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: blog.body.slice(0, 150),
                    }}
                  ></article>
                  {/* <p>{blog.body.slice(0, 150)}...</p> */}
                </div>

                {/* Buttons */}
                <div className="mt-4 flex gap-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                    onClick={() => handleBlogView(blog.id)}
                  >
                    View
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                    onClick={() => handlePublishBlogs(blog.id)}
                  >
                    Publish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="mt-6 flex justify-center gap-4">
          {/* Previous Page Button */}
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => changePage(index + 1)}
              className={`${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } font-semibold py-2 px-4 rounded-lg hover:bg-blue-300`}
            >
              {index + 1}
            </button>
          ))}

          {/* Next Page Button */}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <Popup message={publishMessage} onClose={() => setPublishMessage(null)} />
    </div>
  );
};

export default Dashboard;
