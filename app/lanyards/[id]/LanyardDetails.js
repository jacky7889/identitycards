"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { saveItemToLocalStorage } from "@/app/utils/storage";
import { CREATE_URL, IMG_URL } from "@/libs/config";

export default function LanyardDetails({ id, lanyard, initialStep = 1 }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [quantity, setQuantity] = useState(1);
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [uploadedDesignId, setUploadedDesignId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedSize, setSelectedSize] = useState("16mm");
  const [selectedText, setSelectedText] = useState("");
  const [selectedHook, setSelectedHook] = useState("Metal Hook");
  const [selectedDesign, setSelectedDesign] = useState("nodesign");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userId, setUserId] = useState("unknown");

  useEffect(() => {
    setIsClient(true);
    const user = localStorage.getItem("userId") || localStorage.getItem("user_id") || "unknown";
    setUserId(user);
  }, []);

  const steps = [
    { id: 1, label: "Details" },
    { id: 2, label: "Artwork Upload" },
    { id: 3, label: "Add to Cart" },
  ];

  // File upload handler for lanyard - UPDATED to return designId
  const handleFileUpload = async (file) => {
    if (!file) return null;
    
    setIsUploading(true);
    setUploadError("");
    
    const formData = new FormData();
    formData.append('design_file', file);
    formData.append('lanyard_id', id);
    formData.append('product_type', 'lanyard');
    formData.append('user_id', userId);
    
    try {
      const response = await fetch(`${CREATE_URL}/upload-design.php`, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUploadedFileName(result.fileName);
        setUploadedDesignId(result.designId);
        return {
          fileName: result.fileName,
          designId: result.designId
        };
      } else {
        setUploadError(result.message || 'Upload failed');
        return null;
      }
    } catch (error) {
      setUploadError('Network error: ' + error.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === 2) {
      let finalFileName = null;
      let finalDesignId = null;
      
      // Upload file if one is selected
      if (file) {
        const uploadResult = await handleFileUpload(file);
        if (uploadResult && !uploadError) {
          finalFileName = uploadResult.fileName;
          finalDesignId = uploadResult.designId;
        } else if (uploadError) {
          // Don't proceed if upload failed
          return;
        }
      }

      const newItem = {
        id,
        title: lanyard.lanyard_name,
        image: lanyard.images,
        quantity,
        price: lanyard.price || 2.0,
        fileName: finalFileName || (file ? file.name : null),
        user_design_id: finalDesignId,
        size: selectedSize,
        hook: selectedHook,
        text: selectedText,
        design: selectedDesign,
        length: lanyard.length,
        category: "lanyard",
      };

      saveItemToLocalStorage("lanyard", newItem);
      router.push("/cart");
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/svg+xml'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setUploadError('Please select a valid file type (JPG, PNG, GIF, PDF, SVG)');
        setFile(null);
        return;
      }
      
      if (selectedFile.size > maxSize) {
        setUploadError('File size must be less than 10MB');
        setFile(null);
        return;
      }
      
      setUploadError("");
      setFile(selectedFile);
      // Reset previous uploads when new file is selected
      setUploadedFileName(null);
      setUploadedDesignId(null);
    }
  };

  if (!lanyard)
    return (
      <div className="text-center py-20 text-red-600 font-semibold px-4">
        Lanyard not found
      </div>
    );

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Title */}
      <h3 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6 mt-6 md:mt-10 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg">
        {lanyard.lanyard_name}
      </h3>

      {/* --- Progress Bar --- */}
      <div className="w-full flex flex-col items-center my-6 md:my-10 px-2">
        <div className="relative flex justify-between w-full max-w-4xl">
          <div className="absolute top-4 md:top-5 left-0 w-full h-1 bg-gray-200 z-0" />
          <div
            className="absolute top-4 md:top-5 left-0 h-1 bg-red-700 z-0 transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center z-10 w-1/3">
              <div
                className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border-3 md:border-4 rounded-full transition-all duration-300 ${
                  step.id <= currentStep
                    ? "border-red-700 bg-red-700 text-white"
                    : "border-gray-400 text-gray-400 bg-white"
                }`}
              >
                <span className="text-sm md:text-base">{step.id}</span>
              </div>
              <p
                className={`mt-2 text-xs md:text-sm text-center px-1 ${
                  step.id <= currentStep
                    ? "text-gray-700 font-medium"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-12 lg:gap-24 mt-6">
        {/* --- Left Images --- */}
        <div className="w-full lg:w-[40%] space-y-4 md:space-y-5">
          <div className="relative w-full aspect-square md:aspect-video rounded-lg overflow-hidden shadow-md">
            <Image
              src={`${IMG_URL}/${lanyard.images[0]}`}
              alt={lanyard.lanyard_name || "lanyard, Dori"}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 35vw"
            />
          </div>
          {lanyard.images[1] && (
            <div className="relative w-full aspect-square md:aspect-video rounded-lg overflow-hidden shadow-md">
              <Image
                src={`${IMG_URL}/${lanyard.images[1]}`}
                alt={lanyard.lanyard_name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 35vw"
              />
            </div>
          )}
        </div>

        {/* --- Right Content --- */}
        <div className="w-full lg:w-[60%] bg-white p-4 md:p-6 rounded-lg shadow-md">
          {/* Step 1 */}
          {currentStep === 1 && (
            <>
              <h2 className="bg-gray-500 text-white text-lg md:text-2xl font-bold mb-4 px-4 py-3 md:px-5 md:py-2 rounded-lg md:rounded-none">
                Type, Quantity & Options
              </h2>

              {/* Size */}
              <div className="text-gray-700 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <p className="font-medium min-w-[60px]">Size:</p>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="size"
                      value="16mm"
                      checked={selectedSize === "16mm"}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-4 h-4"
                    />
                    16 mm
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="size"
                      value="20mm"
                      checked={selectedSize === "20mm"}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-4 h-4"
                    />
                    20 mm
                  </label>
                </div>
              </div>

              {/* Text to be Printed */}
              <div className="text-gray-700 mb-6 flex flex-col gap-2">
                <label className="font-medium">Text to be Printed:</label>
                <input
                  type="text"
                  placeholder="Enter your text"
                  value={selectedText}
                  onChange={(e) => setSelectedText(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-sm md:text-base"
                />
              </div>

              {/* Hook */}
              <div className="text-gray-700 mb-6 flex flex-col gap-2">
                <label className="font-medium">Hook Type:</label>
                <select
                  className="w-full md:w-48 border border-gray-300 rounded p-2 text-sm md:text-base"
                  value={selectedHook}
                  onChange={(e) => setSelectedHook(e.target.value)}
                >
                  <option>Metal Hook</option>
                  <option>Plastic Hook</option>
                  <option>Bulldog Clip</option>
                  <option>Carabiner Clip</option>
                </select>
              </div>

              {/* Quantity */}
              <div className="text-gray-700 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <label className="font-medium min-w-[80px]">Quantity</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <select
                    className="w-full sm:w-40 border border-gray-300 rounded p-2 text-sm md:text-base"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "custom") setShowCustomInput(true);
                      else {
                        setShowCustomInput(false);
                        setQuantity(Number(value));
                      }
                    }}
                    value={isClient ? (showCustomInput ? "custom" : quantity) : 1}
                  >
                    {Array.from({ length: 50 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                    <option value="custom">Custom</option>
                  </select>

                  {isClient && showCustomInput && (
                    <input
                      type="number"
                      min="1"
                      className="w-full sm:w-32 border border-gray-300 rounded p-2 text-sm md:text-base"
                      placeholder="Enter quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  )}
                </div>
              </div>

              {/* Design Options */}
              <div className="text-gray-700 mb-4 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
                <p className="font-medium min-w-[120px]">Design Service:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="design"
                      value="design"
                      checked={selectedDesign === "design"}
                      onChange={(e) => setSelectedDesign(e.target.value)}
                      className="w-4 h-4"
                    />
                    Design Service
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="design"
                      value="nodesign"
                      checked={selectedDesign === "nodesign"}
                      onChange={(e) => setSelectedDesign(e.target.value)}
                      className="w-4 h-4"
                    />
                    No Design
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <>
              <h2 className="bg-gray-500 text-white text-lg md:text-2xl font-bold mb-4 px-4 py-3 md:px-5 md:py-2 rounded-lg md:rounded-none">
                Artwork Upload
              </h2>
              <div className="text-gray-700 mb-4 flex flex-col gap-4">
                <label className="font-medium">Upload your Artwork (optional)</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.svg"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="w-full border border-gray-300 rounded-lg p-2 
                    file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                    file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 
                    hover:file:bg-gray-200 disabled:opacity-50 text-sm md:text-base"
                />
                
                {isUploading && (
                  <p className="text-blue-600 text-sm">Uploading file...</p>
                )}
                
                {uploadError && (
                  <p className="text-red-600 text-sm">{uploadError}</p>
                )}
                
                {isClient && file && !isUploading && !uploadError && (
                  <p className="text-green-600 text-sm break-words">Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                )}
                
                {uploadedFileName && (
                  <div className="text-green-600 text-sm break-words">
                    <p>✓ File uploaded successfully: {uploadedFileName}</p>
                    {uploadedDesignId && (
                      <p>✓ Design ID: {uploadedDesignId}</p>
                    )}
                  </div>
                )}
                
                <p className="text-xs text-gray-500">
                  Supported formats: JPG, PNG, GIF, PDF, SVG (Max 10MB)
                </p>
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-6 md:mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-4 md:px-6 py-2 rounded-md font-semibold text-sm md:text-base ${
                currentStep === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-700 text-white hover:bg-red-800 cursor-pointer"
              }`}
            >
              Prev
            </button>

            <button
              onClick={nextStep}
              className={`px-4 md:px-6 py-2 rounded-md font-semibold text-sm md:text-base ${
                currentStep === steps.length
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-400 text-white hover:bg-red-700 cursor-pointer"
              }`}
            >
              {currentStep === 2 ? "Add to Cart" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}