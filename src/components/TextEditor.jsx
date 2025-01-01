import React, { useState, useRef, useContext } from "react";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import ReactQuill from "react-quill";
import ResetPopup from "./ResetPopup";
import { AuthContext } from "../context/authContext";
import Popup from "./Popup";

const TextEditor = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [displayPicture, setDisplayPicture] = useState(null);
  const [microPicture, setMicroPicture] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const { authState } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setPopupMessage] = useState();

  const quillRef = useRef(null);

  const handleDisplayPictureChange = (e) => {
    setDisplayPicture(e.target.files[0]);
  };

  const handleMicroPictureChange = (e) => {
    setMicroPicture(e.target.files[0]);
  };

  const handleContentChange = (value) => {
    setContent(value);
    console.log(value);
  };

  const getQuillInstance = () => {
    if (quillRef.current) {
      return quillRef.current.getEditor();
    }
    return null;
  };

  const handleReset = () => {
    setShowModal(true); // Show the confirmation modal
  };

  const confirmReset = () => {
    setTitle("");
    setDescription("");
    setContent("");
    setDisplayPicture(null);
    setMicroPicture(null);
    if (quillRef.current) {
      quillRef.current.getEditor().setContents([]);
    }
    setShowModal(false); // Close the modal
  };

  const cancelReset = () => {
    setShowModal(false); // Close the modal without resetting
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quillInstance = getQuillInstance();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("body", content);

    // Append displayPicture and microPicture with proper keys if they exist
    if (displayPicture) {
      formData.append("images", displayPicture);
    }
    if (microPicture) {
      formData.append("images", microPicture);
    }

    await fetch(`${import.meta.env.VITE_API_URL}/create/blog`, {
      method: "POST",
      headers: {
        authorization: `${authState.token}`,
      },
      body: formData,
    })
      .then(async (result) => {
        console.log(result);
        if (result.ok) {
          const createData = await result.json();
          console.log(createData);
          setPopupMessage(createData.message);
          setTitle("");
          setDescription("");
          setContent("");
          setDisplayPicture(null);
          setMicroPicture(null);
        } else {
          const userError = await result.json();
          console.log(userError);
          setErrorMessage(userError.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    console.log({
      title,
      description,
      content,
      displayPicture,
      microPicture,
    });
  };

  return (
    <div className="h-full bg-gray-100 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6"
      >
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Create Post</h1>

        {/* Title Input */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a short description"
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300 focus:outline-none"
          ></textarea>
        </div>

        {/* Display Picture Input */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="displayPicture"
          >
            Upload Display Picture
          </label>
          <input
            id="displayPicture"
            type="file"
            accept="image/*"
            onChange={handleDisplayPictureChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>

        {/* Micro Picture Input */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="microPicture"
          >
            Upload Micro Picture
          </label>
          <input
            id="microPicture"
            type="file"
            accept="image/*"
            onChange={handleMicroPictureChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>

        {/* Rich Text Editor */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="content"
          >
            Main Content
          </label>
          <ReactQuill
            id="content"
            ref={quillRef}
            value={content}
            onChange={handleContentChange}
            className="bg-white rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Submit Post
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="w-full bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ResetPopup
        show={showModal}
        onConfirm={confirmReset}
        onCancel={cancelReset}
      />
      <Popup message={successMessage} onClose={() => setPopupMessage(null)} />
      <Popup message={errorMessage} onClose={() => setErrorMessage(null)} />
    </div>
  );
};

export default TextEditor;
