import React, { useState } from "react";
import axios from "axios";
import MatrixBackground from "./components/MatrixBackground";

function App() {
  const [files, setFiles] = useState(null);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files) return alert("Please select images first!");
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const response = await axios.post("http://localhost:5000/convert", formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "converted.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
      alert("Failed to convert images!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Image to PDF Converter</h1>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Convert to PDF
      </button>
    </div>
  );
}

export default App;
