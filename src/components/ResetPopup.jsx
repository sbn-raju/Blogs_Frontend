import React from 'react'

const ResetPopup =({ show, onConfirm, onCancel }) => {
    if (!show) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <h2 className="text-xl font-semibold text-gray-700">Confirm Reset</h2>
          <p className="mt-2 text-gray-600">Are you sure you want to reset all the blog details?</p>
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </div>
    );
  };

export default ResetPopup