import React from "react";

const BlogPage = ({ blog }) => {
  if (!blog) {
    return <div>Blog not found!</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Blog Header */}
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <h1 className="text-3xl font-bold text-center">{blog.title}</h1>
      </header>

      {/* Blog Content */}
      <main className="flex-grow container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        {/* Blog Image */}
        {blog.micro_image_path && (
          <img
            src={blog.micro_image_path}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
        )}

        {/* Blog Description */}
        <p className="text-lg text-gray-700 mb-4">{blog.description}</p>

        {/* Blog HTML Content */}
        <article
          className="prose max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        ></article>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; {new Date().getFullYear()} Blog Platform</p>
      </footer>
    </div>
  );
};

export default BlogPage;
