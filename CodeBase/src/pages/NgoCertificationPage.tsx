import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";

const NgoCertificationPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.type.startsWith("image/") ||
        droppedFile.type === "application/pdf")
    ) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            NGO Certification Upload
          </h1>

          <div className="space-y-8">
            {/* Information Section */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Important Information
              </h2>
              <ul className="space-y-3 text-blue-800">
                <li className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Only valid NGO certification documents will be accepted
                  </span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Document must be in PDF, JPG, or PNG format</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Maximum file size: 10MB</span>
                </li>
              </ul>
            </div>

            {/* Upload Section */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
                isDragging
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center">
                {!file ? (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*,.pdf"
                          onChange={handleFileSelect}
                        />
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                    <p className="text-lg font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={() => setFile(null)}
                      className="mt-4 text-sm text-red-600 hover:text-red-500"
                    >
                      Remove file
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Requirements Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Document Requirements
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <FileText className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Must be a valid NGO registration certificate</span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Certificate should be current and not expired</span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Document should be clearly legible</span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>All text and seals should be visible</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NgoCertificationPage;
