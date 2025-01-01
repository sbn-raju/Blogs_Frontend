import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
import Popup from "./Popup";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(3);
  const [editingBlog, setEditingBlog] = useState(null); // Track the blog being edited
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedBody, setUpdatedBody] = useState("");
  const [updatedMicroImage, setUpdatedMicroImage] = useState(null);
  const [updatedDisplayImage, setUpdatedDisplayImage] = useState(null); // State to hold the new image file
  const [loading, setLoading] = useState(true);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const [updateMessage, setUpdateMessage] = useState(null);

  // Fetch blogs from the backend with pagination
  useEffect(() => {
    const fetchBlogs = async () => {
      const offset = (currentPage - 1) * blogsPerPage; // Calculate the offset based on current page
      const limit = blogsPerPage;

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
          setLoading(false);
          setBlogs(data.data);
          setTotalBlogs(data.totalBlogs);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [currentPage, blogsPerPage, updateMessage]);

  // Handle deleting a blog
  const handleDeleteBlog = async (blogId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (confirmation) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/delete/blog?id=${blogId}`,
          {
            method: "DELETE",
            headers: {
              authorization: `${authState.token}`,
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          setUpdateMessage(data.message);
        } else {
          setUpdateMessage(data.message);
        }
        // Remove the deleted blog from the state
        setBlogs(blogs.filter((blog) => blog.id !== blogId));
      } catch (error) {
        console.error("Error deleting blog:", error);
        setUpdateMessage(error.message);
      }
    }
  };

  // Handle editing a blog (open modal and pre-fill the form)
  const handleEditBlog = (blog) => {
    console.log("Pre-filled blogs", blog);
    setEditingBlog(blog);
    setUpdatedTitle(blog.title);
    setUpdatedDescription(blog.description);
    setUpdatedBody(blog.body); // Set the current body content for React Quill
    setUpdatedDisplayImage(blog.display_image_path);
    setUpdatedMicroImage(blog.micro_image_path);
  };

  // Handle updating the blog
  const handleUpdateBlog = async () => {
    const updatedBlog = {
      title: updatedTitle,
      description: updatedDescription,
      body: updatedBody,
    };

    // Form data to handle image upload
    const formData = new FormData();
    formData.append("title", updatedBlog.title);
    formData.append("description", updatedBlog.description);
    formData.append("body", updatedBlog.body);

    // if (updatedDisplayImage) {
    //   formData.append("images", updatedDisplayImage);
    // }
    // if(updatedMicroImage){
    //   formData.append("images", updatedMicroImage);
    // }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/update/blog?id=${editingBlog.id}`,
        {
          method: "PUT",
          headers: {
            authorization: `${authState.token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update the blog");
      }
      const data = await response.json();
      console.log("This is the updated data", data);

      if (data.success) {
        setUpdateMessage(data.message);
      }

      // Update the state with the updated blog
      setBlogs(
        blogs.map((blog) =>
          blog.id === editingBlog.id ? { ...blog, ...updatedBlog } : blog
        )
      );

      setEditingBlog(null); // Close the modal after update
    } catch (error) {
      setUpdateMessage(error.message);
      console.error("Error updating blog:", error);
    }
  };

  // Change page handler
  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBlogView = (id) => {
    navigate(`/view/${id}`);
  };

  // const handleDisplayImageChange = (e) =>{
  //   setUpdatedDisplayImage(e.target.files[0]);
  // }

  // const handleMicroImageChange = (e) =>{
  //   setUpdatedMicroImage(e.target.files[1]);
  // }

  // Calculate total pages
  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  return (
    <div className="h-auto flex justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              Manage Blogs
            </h1>

            {/* If a blog is being edited, show the edit modal */}
            {editingBlog && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 w-full max-w-lg rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Edit Blog</h2>

                  <div className="mb-4">
                    <label className="block text-gray-700">Title</label>
                    <input
                      type="text"
                      value={updatedTitle}
                      onChange={(e) => setUpdatedTitle(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <input
                      type="text"
                      value={updatedDescription}
                      onChange={(e) => setUpdatedDescription(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* <div className="mb-4">
                  <label className="block text-gray-700">Update Micro Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMicroImageChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {updatedMicroImage && (
                    <div className="mb-4">
                    <img
        src={URL.createObjectURL(updatedMicroImage)} // Generate a preview URL
        alt="Micro Image Preview"
        className="mt-2"
      />
                    <p className="text-sm text-gray-600 mt-2 text-wrap">
                       Selected file: {updatedMicroImage}
                    </p>
                </div>
                  )}
                </div>
  
                <div className="mb-4">
                  <label className="block text-gray-700">Update Display Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDisplayImageChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {updatedDisplayImage && (
                    <div className="mb-4">
                        <img
        src={URL.createObjectURL(updatedDisplayImage)} // Generate a preview URL
        alt="Display Image Preview"
        className="mt-2"
      />
                        <p className="text-sm text-gray-600 mt-2 text-wrap">
                           Selected file: {updatedDisplayImage}
                        </p>
                    </div>
                  )}
                </div> */}

                  <div className="mb-4">
                    <label className="block text-gray-700">Body</label>
                    <ReactQuill
                      value={updatedBody}
                      onChange={setUpdatedBody}
                      className="w-full border border-gray-300 rounded-lg"
                      modules={{
                        toolbar: [
                          [{ header: "1" }, { header: "2" }, { font: [] }],
                          [{ list: "ordered" }, { list: "bullet" }],
                          [{ align: [] }],
                          ["bold", "italic", "underline"],
                          ["link"],
                          ["blockquote"],
                          [{ color: [] }],
                        ],
                      }}
                    />
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={handleUpdateBlog}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      Update Blog
                    </button>
                    <button
                      onClick={() => setEditingBlog(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                        onClick={() => handleEditBlog(blog)} // Open modal with blog data
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                        onClick={() => handleDeleteBlog(blog.id)} //open model blog
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => changePage(index + 1)}
                  className={`${
                    currentPage === index + 1 ? "bg-blue-500" : "bg-gray-300"
                  } text-white font-semibold py-2 px-4 rounded-lg`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      <Popup message={updateMessage} onClose={() => setUpdateMessage(null)} />
    </div>
  );
};

export default Dashboard;
