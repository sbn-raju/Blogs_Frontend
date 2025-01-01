import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null); // Blog ID to delete

  // Fetch blogs from the backend with pagination
  useEffect(() => {
    const fetchBlogs = async () => {
      const offset = (currentPage - 1) * blogsPerPage; // Calculate the offset based on current page
      const limit = blogsPerPage;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/read-all/blogs?limit=${limit}&offset=${offset}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();

        if (data.success) {
          setBlogs(data.data);
          setTotalBlogs(data.totalBlogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [currentPage, blogsPerPage]);

  // Handle deleting a blog
  const handleDeleteBlog = async () => {
    if (blogToDelete) {
      try {
        const response = await fetch(`/api/blogs/${blogToDelete}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete the blog");
        }
        // Remove the deleted blog from the state
        setBlogs(blogs.filter((blog) => blog._id !== blogToDelete));
        setShowModal(false); // Close the modal after deletion
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  // Change page handler
  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Delete Blogs</h1>

        {/* Blog List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                <h2 className="text-xl font-semibold text-gray-800">{blog.title}</h2>

                {/* Blog Description */}
                <p className="text-gray-600 mt-2">{blog.description}</p>

                {/* Full Blog Content */}
                <div className="mt-4 text-gray-800">
                  <p>{blog.body.slice(0, 150)}...</p>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex gap-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    View
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                    onClick={() => {
                      setBlogToDelete(blog._id); // Set the blog to delete
                      setShowModal(true); // Show the confirmation modal
                    }}
                  >
                    Delete
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

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-96">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600">Are you sure you want to delete this blog?</p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBlog}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
