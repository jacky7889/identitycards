"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { saveItemToLocalStorage } from "@/app/utils/storage";
import { CREATE_URL, IMG_URL } from "@/libs/config";
import { Link } from "lucide-react";

export default function HolderDetails({ id, holder, initialStep = 1 }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [quantity, setQuantity] = useState(1);
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [uploadedDesignId, setUploadedDesignId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("recommended");
  const [selectedOrientation, setSelectedOrientation] = useState("Horizontal");
  const [selectedMaterial, setSelectedMaterial] = useState("Plastic");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(false);

  // Initialize client state and user data
  useEffect(() => {
    setIsClient(true);
    const userSignin = localStorage.getItem("isSignedIn");
    setUser(userSignin === "true");
    
    const storedUserId = localStorage.getItem("userId") || localStorage.getItem("user_id") || "unknown";
    setUserId(storedUserId);
  }, []);

  const steps = [
    { id: 1, label: "Details" },
    { id: 2, label: "Artwork Upload" },
    { id: 3, label: "Add to Cart" },
  ];

  // File upload handler for holder
  const handleFileUpload = async (file) => {
    if (!file) return null;
    
    setIsUploading(true);
    setUploadError("");
    
    const formData = new FormData();
    formData.append('design_file', file);
    formData.append('holder_id', id);
    formData.append('product_type', 'holder');
    formData.append('user_id', userId);
    
    try {
      const response = await fetch(`${CREATE_URL}/upload-design.php`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }
      
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
        id: id,
        title: holder.holder_name,
        details: holder.holder_detail,
        image: holder.images?.[0] || "",
        quantity,
        price: holder.price || 1.0,
        fileName: finalFileName || (file ? file.name : null),
        user_design_id: finalDesignId,
        quality: selectedQuality,
        orientation: selectedOrientation,
        material: selectedMaterial,
        category: "holder",
      };

      saveItemToLocalStorage("holder", newItem);
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

  // Handle custom quantity input
  const handleCustomQuantityChange = (value) => {
    const numValue = Number(value);
    if (numValue >= 1) {
      setQuantity(numValue);
    }
  };

  if (!holder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Holder not found</h2>
          <Link href="/holders" className="text-blue-600 hover:underline">
            Back to Holders
          </Link>
        </div>
      </div>
    );
  }

  // Render step content
  const renderStepContent = (step) => {
    switch(step) {
      case 1:
        return (
          <>
            <h2 className="bg-gray-500 text-white text-lg md:text-2xl font-bold mb-4 px-4 py-3 md:px-5 md:py-2 rounded-lg">
              Type, Quantity & Options
            </h2>

            {/* Quality Selection */}
            <div className="text-gray-700 mb-6 flex flex-col gap-2">
              <label className="font-medium">Quality:</label>
              <select
                className="w-full md:w-48 border border-gray-300 rounded p-2 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="breakable">Breakable</option>
                <option value="good">Good</option>
              </select>
            </div>

            {/* Orientation */}
            <div className="text-gray-700 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <p className="font-medium min-w-[100px]">Orientation:</p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="orientation"
                    value="Horizontal"
                    checked={selectedOrientation === "Horizontal"}
                    onChange={(e) => setSelectedOrientation(e.target.value)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  Horizontal
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="orientation"
                    value="Vertical"
                    checked={selectedOrientation === "Vertical"}
                    onChange={(e) => setSelectedOrientation(e.target.value)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  Vertical
                </label>
              </div>
            </div>

            {/* Material */}
            <div className="text-gray-700 mb-6 flex flex-col gap-2">
              <label className="font-medium">Material:</label>
              <select
                className="w-full md:w-48 border border-gray-300 rounded p-2 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
              >
                <option value="Plastic">Plastic</option>
                <option value="Glass">Glass</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="text-gray-700 mb-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <label className="font-medium min-w-[100px]">Quantity</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <select
                  className="w-full sm:w-40 border border-gray-300 rounded p-2 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "custom") setShowCustomInput(true);
                    else {
                      setShowCustomInput(false);
                      setQuantity(Number(value));
                    }
                  }}
                  value={showCustomInput ? "custom" : quantity}
                >
                  {Array.from({ length: 50 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                  <option value="custom">Custom</option>
                </select>

                {showCustomInput && (
                  <input
                    type="number"
                    min="1"
                    className="w-full sm:w-32 border border-gray-300 rounded p-2 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => handleCustomQuantityChange(e.target.value)}
                  />
                )}
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="bg-gray-500 text-white text-lg md:text-2xl font-bold mb-4 px-4 py-3 md:px-5 md:py-2 rounded-lg">
              Artwork Upload
            </h2>
            <div className="text-gray-700 mb-4 flex flex-col gap-4">
              <label className="font-medium">Upload your Design (optional)</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.pdf,.svg"
                onChange={handleFileChange}
                disabled={isUploading}
                className="w-full border border-gray-300 rounded-lg p-2 
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                  file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 
                  hover:file:bg-blue-100 disabled:opacity-50 text-sm md:text-base
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              />
              
              {isUploading && (
                <div className="flex items-center gap-2 text-blue-600 text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Uploading file...
                </div>
              )}
              
              {uploadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  {uploadError}
                </div>
              )}
              
              {file && !isUploading && !uploadError && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
                  Selected: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
              
              {uploadedFileName && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
                  <p>✓ File uploaded successfully: <strong>{uploadedFileName}</strong></p>
                  {uploadedDesignId && (
                    <p>✓ Design ID: <strong>{uploadedDesignId}</strong></p>
                  )}
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF, PDF, SVG (Max 10MB)
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Title */}
      <h3 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6 mt-6 md:mt-10 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg">
        {holder.holder_name}
      </h3>

      {/* Progress Bar */}
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
                <span className="text-sm md:text-base font-semibold">{step.id}</span>
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
        {/* Left Images */}
        <div className="w-full lg:w-[40%] space-y-4 md:space-y-5">
          <div className="relative w-full aspect-square md:aspect-video rounded-lg overflow-hidden shadow-md border border-gray-200">
            <Image
              src={`${IMG_URL}/${holder.images?.[0] || ''}`}
              alt={holder.holder_name}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 35vw"
            />
          </div>
          {holder.images?.[1] && (
            <div className="relative w-full aspect-square md:aspect-video rounded-lg overflow-hidden shadow-md border border-gray-200">
              <Image
                src={`${IMG_URL}/${holder.images[1]}`}
                alt={`${holder.holder_name} - additional view`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 35vw"
              />
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-[60%] bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200">
          {renderStepContent(currentStep)}

          {/* Navigation Buttons */}
          {user ? (
            <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-6 md:mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-4 md:px-6 py-2 rounded-md font-semibold text-sm md:text-base transition-colors ${
                  currentStep === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-700 text-white hover:bg-red-800 cursor-pointer"
                }`}
              >
                Previous
              </button>

              <button
                onClick={nextStep}
                disabled={currentStep === steps.length || (currentStep === 2 && isUploading)}
                className={`px-4 md:px-6 py-2 rounded-md font-semibold text-sm md:text-base transition-colors ${
                  currentStep === steps.length || (currentStep === 2 && isUploading)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                }`}
              >
                {currentStep === 2 ? "Add to Cart" : "Next"}
              </button>
            </div>
          ) : (
            <div className="mt-6 flex justify-end">
              <Link 
                href="/signin" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base text-center w-full sm:w-auto transition-colors"
              >
                Sign in to Customize
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}