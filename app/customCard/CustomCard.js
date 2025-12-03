"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";
import { CREATE_URL, READ_ADMIN_URL } from "@/libs/config";
import Cropper from "react-easy-crop";
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaUser, 
  FaMobileAlt,
  FaGlobe,
  FaBirthdayCake,
  FaIdCard,
  FaHome,
  FaBuilding,
  FaBriefcase,
  FaGraduationCap,
  FaCar,
  FaHeart,
  FaStar,
  FaTrash,
  FaUndo,
  FaRedo,
  FaDownload,
  FaCrop,
  FaTimes
} from "react-icons/fa";
import { FaRotateLeft, FaRotateRight, FaUpRightAndDownLeftFromCenter, FaDownLeftAndUpRightToCenter } from "react-icons/fa6";

export default function CustomCard() {
  const cardRef = useRef();
  const fileInputRef = useRef(null);
  const [elements, setElements] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [cropMode, setCropMode] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [shapeColor, setShapeColor] = useState("#1E90FF");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [csvData, setCsvData] = useState([]);
  const [orientation, setOrientation] = useState("portrait");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [cropSize, setCropSize] = useState({ width: 400, height: 260 });
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [requireLogin, setRequireLogin] = useState(true);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Undo/Redo functionality
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Card dimensions based on orientation (174mm x 114mm)
  const cardDimensions = {
    portrait: { width: 430, height: 655 }, // 114mm x 174mm
    landscape: { width: 655, height: 430 } // 174mm x 114mm
  };

  // Updated Crop presets
  const cropPresets = {
    portrait: { width: 223, height: 336, label: "Card (Portrait)" }, // 59mm × 89mm
    landscape: { width: 336, height: 223, label: "Card (Landscape)" }, // 89mm × 59mm
    standard: { width: 150, height: 200, label: "150×200px" },
    custom: { width: 400, height: 260, label: "Custom" }
  };

  const [selectedCropPreset, setSelectedCropPreset] = useState("portrait");

  const currentDimensions = cardDimensions[orientation];

  // ---------------------- AUTHENTICATION ----------------------
  useEffect(() => {
    // Check if user is logged in using localStorage
    const signedIn = localStorage.getItem('isSignedIn');
    if (signedIn === 'true') {
      setIsLoggedIn(true);
    }

    // Check if login is required from API
    checkLoginRequirement();
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      // Cleanup any object URLs to prevent memory leaks
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  // ---------------------- CHECK LOGIN REQUIREMENT FROM API ----------------------
  const checkLoginRequirement = async () => {
    try {
      const response = await fetch(`${READ_ADMIN_URL}/control.php`);
      const data = await response.json();

      const status = data.user_status;

      // Convert ANY type to boolean
      const loginRequired = status == 1 || status === true || status === "1" || status === "true";
      setRequireLogin(loginRequired);
    } catch (error) {
      console.error("Error checking login requirement:", error);
      setRequireLogin(false);
    }
  };

  // ---------------------- UNDO/REDO MANAGEMENT ----------------------
  const saveToHistory = useCallback((newElements) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newElements)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(JSON.parse(JSON.stringify(history[newIndex])));
    }
  }, [historyIndex, history, setHistoryIndex, setElements]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(JSON.parse(JSON.stringify(history[newIndex])));
    }
  }, [historyIndex, history, setHistoryIndex, setElements]);

  // Update history when elements change
  useEffect(() => {
    if (JSON.stringify(elements) !== JSON.stringify(history[historyIndex])) {
      saveToHistory(elements);
    }
  }, [elements, history, historyIndex, saveToHistory]);

  // ---------------------- KEYBOARD SHORTCUTS ----------------------
  const deleteElement = useCallback((id) => {
    setElements((prevElements) => prevElements.filter((el) => el.id !== id));
    setSelectedElement(null);
  }, [setElements, setSelectedElement]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElement !== null) {
          deleteElement(selectedElement);
        }
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElement, deleteElement, redo, undo]);

  // ---------------------- CLEAR UPLOADED FILE ----------------------
  const clearUploadedFile = () => {
    setUploadedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ---------------------- CSV/UPLOAD HANDLING ----------------------
  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target.result;
      parseCSV(csvText);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText) => {
    try {
      const lines = csvText.split('\n');
      if (lines.length === 0) {
        setCsvData([]);
        return;
      }
      
      // Parse CSV with better handling of quoted fields
      const parseLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const nextChar = line[i + 1];
          
          if (char === '"' && !inQuotes) {
            inQuotes = true;
          } else if (char === '"' && inQuotes && nextChar === '"') {
            current += '"';
            i++; // Skip next quote
          } else if (char === '"' && inQuotes) {
            inQuotes = false;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        
        result.push(current.trim());
        return result;
      };
      
      const headers = parseLine(lines[0]);
      
      const data = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = parseLine(lines[i]);
        const row = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        
        data.push(row);
      }
      
      setCsvData(data);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error parsing CSV file. Please ensure it is properly formatted.');
    }
  };

  // ---------------------- BULK CARD GENERATION ----------------------
  const generateBulkCards = async () => {
    setIsGenerating(true);
    
    if (requireLogin && !isLoggedIn) {
      alert('Please login to generate bulk cards');
      setIsGenerating(false);
      return;
    }

    if (csvData.length === 0) {
      alert('Please upload a CSV file first');
      setIsGenerating(false);
      return;
    }

    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const generatedImages = [];
      const imageDataArray = [];

      for (let i = 0; i < csvData.length; i++) {
        const cardData = csvData[i];
        
        const tempCard = document.createElement('div');
        tempCard.style.width = `${currentDimensions.width}px`;
        tempCard.style.height = `${currentDimensions.height}px`;
        tempCard.style.background = 'white';
        tempCard.style.position = 'relative';
        tempCard.style.border = '1px solid #ccc';
        tempCard.style.padding = '20px';

        elements.forEach((element) => {
          const elementDiv = document.createElement('div');
          elementDiv.style.position = 'absolute';
          elementDiv.style.left = `${element.x}px`;
          elementDiv.style.top = `${element.y}px`;
          elementDiv.style.width = `${element.w}px`;
          elementDiv.style.height = `${element.h}px`;

          if (element.type === 'text') {
            let textContent = element.text;
            Object.keys(cardData).forEach(key => {
              const placeholder = `{${key}}`;
              if (textContent.includes(placeholder)) {
                textContent = textContent.replace(new RegExp(placeholder, 'g'), cardData[key]);
              }
            });
            
            elementDiv.innerHTML = `
              <div style="color: ${element.color}; font-size: ${element.size}px; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                ${textContent}
              </div>
            `;
          } else if (element.type === 'image') {
            let imageSrc = element.src;
            
            Object.keys(cardData).forEach(key => {
              const placeholder = `{${key}}`;
              if (imageSrc.includes(placeholder)) {
                imageSrc = imageSrc.replace(new RegExp(placeholder, 'g'), cardData[key]);
              }
            });
            
            elementDiv.innerHTML = `
              <img 
                src="${imageSrc}" 
                alt="card" 
                style="width: 100%; height: 100%; object-fit: cover;" 
                onerror="this.style.display='none'" 
                crossorigin="anonymous"
              />
            `;
          } else if (element.type === 'icon') {
            elementDiv.innerHTML = `
              <div style="color: ${element.color}; font-size: ${element.size}px; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                ${renderIconToString(element.iconType, element.size, element.color)}
              </div>
            `;
          } else if (element.type === 'shape') {
            elementDiv.innerHTML = `
              <div style="width: 100%; height: 100%; background-color: ${element.color}; border: ${element.strokeWidth}px solid ${element.strokeColor}; border-radius: ${element.shape === 'circle' ? '50%' : '0'};"></div>
            `;
          }

          tempCard.appendChild(elementDiv);
        });

        document.body.appendChild(tempCard);

        try {
          const canvas = await html2canvas(tempCard, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            allowTaint: true
          });

          const exportCanvas = document.createElement('canvas');
          exportCanvas.width = orientation === 'portrait' ? 672 : 1024;
          exportCanvas.height = orientation === 'portrait' ? 1024 : 672;
          const ctx = exportCanvas.getContext('2d');
          ctx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);

          const dataURL = exportCanvas.toDataURL('image/jpeg', 1.0);
          const base64Data = dataURL.replace(/^data:image\/jpeg;base64,/, '');
          
          const fileName = `idcard_${i + 1}_${cardData.name || cardData.id || 'card'}.jpg`;
          zip.file(fileName, base64Data, { base64: true });
          generatedImages.push(fileName);
          
          imageDataArray.push(dataURL);

        } catch (error) {
          console.error('Error generating card:', error);
        } finally {
          document.body.removeChild(tempCard);
        }
      }

      setIsGenerating(false);

      zip.generateAsync({ type: 'blob' }).then(async (content) => {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `idcards_batch_${new Date().getTime()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        try {
          const result = await saveDownloadRecord(generatedImages, 'bulk', imageDataArray);
          if (result.success) {
            console.log('✅ Bulk download record saved successfully');
          } else {
            console.warn('⚠️ Bulk download record not saved:', result.error);
          }
        } catch (error) {
          console.warn('⚠️ Bulk download record save failed:', error);
        }
        
        alert(`✅ Successfully generated ${csvData.length} ID cards! Download started.`);
      });
    } catch (error) {
      console.error('Error in bulk card generation:', error);
      setIsGenerating(false);
      alert('Error generating cards. Please try again.');
    }
  };

  const renderIconToString = (iconType, size = 24, color = "#000") => {
    const icons = {
      phone: '📞',
      email: '✉️',
      location: '📍',
      user: '👤',
      mobile: '📱',
      website: '🌐',
      birthday: '🎂',
      id: '🆔',
      address: '🏠',
      building: '🏢',
      briefcase: '💼',
      graduation: '🎓',
      car: '🚗',
      heart: '❤️',
      star: '⭐'
    };
    
    return icons[iconType] || '❓';
  };

  // ---------------------- IMAGE CROPPING ----------------------
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropMode(true);
      setEditingImageIndex(null);
      setRotation(0);
      setCropSize(cropPresets[selectedCropPreset]);
    };
    reader.readAsDataURL(file);
  };

  const editImageElement = (index) => {
    const element = elements[index];
    if (element.type === 'image') {
      setImageSrc(element.src);
      setCropMode(true);
      setEditingImageIndex(index);
      setRotation(0);
      setCropSize({ width: element.w, height: element.h });
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      // Use native Image constructor
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = url;
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
    });

  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const rotRad = (rotation * Math.PI) / 180;

    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);

    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');

    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;

    croppedCtx.drawImage(
      canvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      croppedCanvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/jpeg');
    });
  };

  const rotateSize = (width, height, rotation) => {
    const rotRad = (rotation * Math.PI) / 180;

    return {
      width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  };

  const applyCroppedImage = async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;

      const croppedImageUrl = await getCroppedImg(
        imageSrc, 
        croppedAreaPixels, 
        rotation
      );
      
      if (editingImageIndex !== null) {
        const newElements = [...elements];
        newElements[editingImageIndex] = {
          ...newElements[editingImageIndex],
          src: croppedImageUrl
        };
        setElements(newElements);
      } else {
        const newElements = [...elements, { 
          type: "image", 
          src: croppedImageUrl, 
          x: 50, 
          y: 50, 
          w: cropSize.width,
          h: cropSize.height,
          id: Date.now() + Math.random()
        }];
        setElements(newElements);
      }
      
      setCropMode(false);
      setImageSrc(null);
      setEditingImageIndex(null);
      setRotation(0);
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Error cropping image. Please try again.');
    }
  };

  // ---------------------- CROPPER CONTROLS ----------------------
  const rotateLeft = () => {
    setRotation(prev => prev - 90);
  };

  const rotateRight = () => {
    setRotation(prev => prev + 90);
  };

  const rotateFineLeft = () => {
    setRotation(prev => prev - 1);
  };

  const rotateFineRight = () => {
    setRotation(prev => prev + 1);
  };

  const getMaxCropSize = () => {
    const containerWidth = 800;
    const containerHeight = 384;
    
    return {
      width: containerWidth - 40,
      height: containerHeight - 40
    };
  };

  const increaseCropSize = () => {
    const maxSize = getMaxCropSize();
    setCropSize(prev => ({
      width: Math.min(prev.width + 10, maxSize.width),
      height: Math.min(prev.height + 10, maxSize.height)
    }));
  };

  const decreaseCropSize = () => {
    setCropSize(prev => ({
      width: Math.max(prev.width - 10, 50),
      height: Math.max(prev.height - 10, 50)
    }));
  };

  // ---------------------- ZOOM CONTROLS ----------------------
  const increaseZoom = () => {
    setZoom(prev => parseFloat((Math.min(prev + 0.01, 3)).toFixed(2)));
  };

  const decreaseZoom = () => {
    setZoom(prev => parseFloat((Math.max(prev - 0.01, 0.1)).toFixed(2)));
  };

  // ---------------------- CROP PRESET HANDLING ----------------------
  const handleCropPresetChange = (preset) => {
    setSelectedCropPreset(preset);
    if (preset !== 'custom') {
      setCropSize(cropPresets[preset]);
    } else {
      const maxSize = getMaxCropSize();
      setCropSize({
        width: Math.min(400, maxSize.width),
        height: Math.min(300, maxSize.height)
      });
    }
  };

  // ---------------------- ORIENTATION TOGGLE ----------------------
  const toggleOrientation = () => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
  };

  // ---------------------- ELEMENT ORDER MANAGEMENT ----------------------
  const bringToFront = (index) => {
    const newElements = [...elements];
    const [element] = newElements.splice(index, 1);
    newElements.push(element);
    setElements(newElements);
    setSelectedElement(newElements.length - 1);
  };

  const bringForward = (index) => {
    if (index < elements.length - 1) {
      const newElements = [...elements];
      [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
      setElements(newElements);
      setSelectedElement(index + 1);
    }
  };

  const sendBackward = (index) => {
    if (index > 0) {
      const newElements = [...elements];
      [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
      setElements(newElements);
      setSelectedElement(index - 1);
    }
  };

  const sendToBack = (index) => {
    const newElements = [...elements];
    const [element] = newElements.splice(index, 1);
    newElements.unshift(element);
    setElements(newElements);
    setSelectedElement(0);
  };

  // ---------------------- ADD ELEMENTS ----------------------
  const addText = () => {
    const newElement = { 
      type: "text", 
      text: "New Text", 
      x: 40, 
      y: 40, 
      color: "#000000", 
      size: 16,
      w: 100,
      h: 30,
      id: Date.now() + Math.random()
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElements.length - 1);
  };

  const addIcon = (iconType) => {
    const newElement = {
      type: "icon",
      iconType,
      text: "",
      x: 40,
      y: 40,
      color: "#000000",
      size: 24,
      w: 40,
      h: 40,
      id: Date.now() + Math.random()
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElements.length - 1);
  };

  const addShape = (shape) => {
    const newElement = {
      type: "shape", 
      shape, 
      x: 40, 
      y: 40, 
      w: 100, 
      h: 100, 
      color: shapeColor,
      strokeColor: strokeColor,
      strokeWidth: strokeWidth,
      id: Date.now() + Math.random()
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElements.length - 1);
  };

  // ---------------------- UPDATE ELEMENT PROPERTIES ----------------------
  const updateElement = (index, updates) => {
    const newElements = [...elements];
    newElements[index] = { ...newElements[index], ...updates };
    setElements(newElements);
  };

  // ---------------------- DATABASE RECORD SAVING ----------------------
  const saveDownloadRecord = async (images, type = 'single', imageData = null) => {
    try {
      const userId = localStorage.getItem('userId') || 'anonymous';
      const imageList = Array.isArray(images) ? images.join(',') : images;
      const imageCount = Array.isArray(images) ? images.length : 1;

      const requestData = {
        userId,
        cc_images: imageList,
        cc_count: imageCount,
        download_type: type,
        status: 'completed'
      };

      if (type === 'single' && imageData) {
        requestData.image_data = imageData;
      } else if (type === 'bulk' && Array.isArray(imageData)) {
        requestData.image_data = imageData;
      }

      const response = await fetch(`${CREATE_URL}/save-download.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error(`❌ Error saving ${type} download record:`, error);
      return { success: false, error: error.message };
    }
  };

  // ---------------------- SINGLE CARD DOWNLOAD ----------------------
  const downloadCard = async () => {
    setIsGenerating(true);
    if (requireLogin && !isLoggedIn) {
      alert('Please login to download cards');
      setIsGenerating(false);
      return;
    }

    try {
      const card = cardRef.current;
      const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: true
      });

      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = orientation === 'portrait' ? 672 : 1024;
      exportCanvas.height = orientation === 'portrait' ? 1024 : 672;

      const ctx = exportCanvas.getContext("2d");
      ctx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);

      const dataURL = exportCanvas.toDataURL("image/jpeg", 1.0);
      const fileName = `idcard_${orientation}_${new Date().getTime()}.jpg`;
      
      saveDownloadRecord(fileName, 'single', dataURL)
        .then(result => {
          if (result.success) {
            console.log('✅ Download record saved successfully');
          } else {
            console.warn('⚠️ Download record not saved, but continuing download:', result.error);
          }
        })
        .catch(error => {
          console.warn('⚠️ Download record save failed, but continuing download:', error);
        });
      
      const a = document.createElement("a");
      a.href = dataURL;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setIsGenerating(false);
      
    } catch (error) {
      console.error('❌ Error downloading card:', error);
      alert('Error downloading card. Please try again.');
      setIsGenerating(false);
    }
  };

  // ---------------------- RENDER ICON ----------------------
  const renderIcon = (iconType, size = 24, color = "#000") => {
    const icons = {
      phone: FaPhoneAlt,
      email: FaEnvelope,
      location: FaMapMarkerAlt,
      user: FaUser,
      mobile: FaMobileAlt,
      website: FaGlobe,
      birthday: FaBirthdayCake,
      id: FaIdCard,
      address: FaHome,
      building: FaBuilding,
      briefcase: FaBriefcase,
      graduation: FaGraduationCap,
      car: FaCar,
      heart: FaHeart,
      star: FaStar
    };
    
    const IconComponent = icons[iconType];
    return IconComponent ? <IconComponent size={size} color={color} /> : null;
  };

  // Check if download features should be disabled
  const downloadDisabled = requireLogin && !isLoggedIn;
  
  if (isGenerating) return <div className="flex justify-center items-center h-screen"><p className="text-center text-lg">Generating Card...</p></div>;
  
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 min-h-screen bg-gray-50">
      {/* LEFT PANEL - Controls */}
      <div className="w-full lg:w-1/3 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Controls</h2>
          <div className="flex gap-2">
            <button 
              onClick={undo}
              disabled={historyIndex === 0}
              className="p-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <FaUndo />
            </button>
            <button 
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="p-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <FaRedo />
            </button>
          </div>
        </div>

        {/* Login Required Message */}
        {downloadDisabled && (
          <div className="p-3 bg-yellow-100 border border-yellow-400 rounded-md">
            <div className="flex items-center">
              <div className="text-yellow-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Login Required
                </h3>
                <div className="mt-1 text-sm text-yellow-700">
                  <p>Please log in to use bulk card generation and download features.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CSV Upload for Multiple Cards */}
        <div className={`space-y-2 p-3 rounded ${downloadDisabled ? 'bg-gray-100' : 'bg-blue-50'}`}>
          <h3 className={`font-semibold ${downloadDisabled ? 'text-gray-500' : 'text-blue-800'}`}>
            Bulk Card Generator
          </h3>
          <input 
            type="file" 
            accept=".csv,.xlsx,.xls" 
            onChange={handleCsvUpload} 
            className={`border p-2 w-full text-sm rounded ${downloadDisabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
            disabled={downloadDisabled}
          />
          <button 
            onClick={generateBulkCards}
            disabled={csvData.length === 0 || downloadDisabled}
            className={`px-3 py-2 rounded w-full text-sm flex items-center justify-center gap-2 transition-colors ${
              downloadDisabled || csvData.length === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
            }`}
          >
            <FaDownload />
            {isGenerating ? 'Generating Cards...' : `Generate ${csvData.length} Cards from CSV`}
          </button>
          {csvData.length > 0 && (
            <div className="text-sm text-green-600">
              <p>{csvData.length} records loaded</p>
              <p className="text-xs text-gray-600">
                Use {"{column_name}"} in text/image fields
              </p>
            </div>
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <h3 className="font-semibold">Image</h3>
          <div className="relative">
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="border p-2 w-full pr-10 rounded bg-white"
            />
            {uploadedFileName && (
              <div className="flex items-center justify-between mt-2 p-2 bg-green-50 border border-green-200 rounded">
                <span className="text-sm text-green-700 truncate flex-1">
                  {uploadedFileName}
                </span>
                <button 
                  onClick={clearUploadedFile}
                  className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                  title="Clear file"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Text Controls */}
        <button 
          onClick={addText} 
          className="cursor-pointer px-3 py-2 bg-black text-white rounded w-full hover:bg-gray-800 transition-colors"
        >
          Add Text
        </button>

        {/* Icons Controls */}
        <div className="space-y-2">
          <h3 className="font-semibold">Icons</h3>
          <div className="grid grid-cols-5 gap-2">
            {[
              { key: "user", icon: FaUser, title: "User" },
              { key: "phone", icon: FaPhoneAlt, title: "Phone" },
              { key: "mobile", icon: FaMobileAlt, title: "Mobile" },
              { key: "email", icon: FaEnvelope, title: "Email" },
              { key: "location", icon: FaMapMarkerAlt, title: "Location" },
              { key: "address", icon: FaHome, title: "Address" },
              { key: "website", icon: FaGlobe, title: "Website" },
              { key: "birthday", icon: FaBirthdayCake, title: "Birthday" },
              { key: "id", icon: FaIdCard, title: "ID" },
              { key: "building", icon: FaBuilding, title: "Building" },
              { key: "briefcase", icon: FaBriefcase, title: "Work" },
              { key: "graduation", icon: FaGraduationCap, title: "Education" },
              { key: "car", icon: FaCar, title: "Vehicle" },
              { key: "heart", icon: FaHeart, title: "Health" },
              { key: "star", icon: FaStar, title: "Star" },
            ].map(({ key, icon: Icon, title }) => (
              <button 
                key={key}
                onClick={() => addIcon(key)} 
                className="p-2 bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all hover:scale-105 rounded"
                title={title}
              >
                <Icon className="transform scale-125" />
              </button>
            ))}
          </div>
        </div>

        {/* Shape Controls */}
        <div className="space-y-2">
          <h3 className="font-semibold">Shapes</h3>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm w-20">Fill Color:</span>
            <input 
              type="color" 
              value={shapeColor}
              onChange={(e) => setShapeColor(e.target.value)}
              className="w-10 h-10 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm w-20">Stroke Color:</span>
            <input 
              type="color" 
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-10 h-10 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm w-20">Stroke Width:</span>
            <input 
              type="range"
              min="0"
              max="10"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
              className="flex-1 cursor-pointer"
            />
            <span className="text-sm w-8">{strokeWidth}px</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => addShape("rect")} className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors">
              Rectangle
            </button>
            <button onClick={() => addShape("circle")} className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors">
              Circle
            </button>
            <button onClick={() => addShape("triangle")} className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors">
              Triangle
            </button>
            <button onClick={() => addShape("star")} className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors">
              Star
            </button>
          </div>
        </div>

        {/* Element Properties */}
        {selectedElement !== null && elements[selectedElement] && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Element Properties</h3>
              <button 
                onClick={() => deleteElement(elements[selectedElement].id)}
                className="p-2 bg-red-500 text-white rounded flex items-center gap-1 text-sm hover:bg-red-600 transition-colors"
              >
                <FaTrash size={12} />
                Delete
              </button>
            </div>
            
            {/* Edit Image Button */}
            {elements[selectedElement].type === "image" && (
              <button 
                onClick={() => editImageElement(selectedElement)}
                className="p-2 bg-blue-500 text-white rounded w-full flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
              >
                <FaCrop />
                Edit Image
              </button>
            )}
            
            <div className="space-y-2">
              <h4 className="font-medium">Layer Order</h4>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => bringToFront(selectedElement)} className="p-2 bg-blue-100 hover:bg-blue-200 text-sm rounded transition-colors">
                  Bring to Front
                </button>
                <button onClick={() => sendToBack(selectedElement)} className="p-2 bg-blue-100 hover:bg-blue-200 text-sm rounded transition-colors">
                  Send to Back
                </button>
                <button onClick={() => bringForward(selectedElement)} className="p-2 bg-blue-100 hover:bg-blue-200 text-sm rounded transition-colors">
                  Bring Forward
                </button>
                <button onClick={() => sendBackward(selectedElement)} className="p-2 bg-blue-100 hover:bg-blue-200 text-sm rounded transition-colors">
                  Send Backward
                </button>
              </div>
            </div>

            {elements[selectedElement].type === "text" && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm w-16">Color:</span>
                  <input
                    type="color"
                    value={elements[selectedElement].color}
                    onChange={(e) => updateElement(selectedElement, { color: e.target.value })}
                    className="flex-1 h-8 cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm w-16">Size:</span>
                  <input
                    type="number"
                    value={elements[selectedElement].size}
                    onChange={(e) => updateElement(selectedElement, { size: parseInt(e.target.value) || 16 })}
                    className="flex-1 border p-1 rounded"
                    min="8"
                    max="100"
                  />
                </div>
              </>
            )}

            {elements[selectedElement].type === "icon" && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm w-16">Color:</span>
                  <input
                    type="color"
                    value={elements[selectedElement].color}
                    onChange={(e) => updateElement(selectedElement, { color: e.target.value })}
                    className="flex-1 h-8 cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm w-16">Size:</span>
                  <input
                    type="number"
                    value={elements[selectedElement].size}
                    onChange={(e) => updateElement(selectedElement, { size: parseInt(e.target.value) || 24 })}
                    className="flex-1 border p-1 rounded"
                    min="8"
                    max="100"
                  />
                </div>
              </>
            )}

            {elements[selectedElement].type === "shape" && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm w-20">Fill Color:</span>
                  <input
                    type="color"
                    value={elements[selectedElement].color}
                    onChange={(e) => updateElement(selectedElement, { color: e.target.value })}
                    className="flex-1 h-8 cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm w-20">Stroke Color:</span>
                  <input
                    type="color"
                    value={elements[selectedElement].strokeColor}
                    onChange={(e) => updateElement(selectedElement, { strokeColor: e.target.value })}
                    className="flex-1 h-8 cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm w-20">Stroke Width:</span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={elements[selectedElement].strokeWidth}
                    onChange={(e) => updateElement(selectedElement, { strokeWidth: parseInt(e.target.value) })}
                    className="flex-1 cursor-pointer"
                  />
                  <span className="text-sm w-8">{elements[selectedElement].strokeWidth}px</span>
                </div>
              </>
            )}
          </div>
        )}

        <button 
          onClick={downloadCard} 
          disabled={downloadDisabled}
          className={`cursor-pointer px-4 py-2 rounded w-full flex items-center justify-center gap-2 transition-colors ${
            downloadDisabled 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <FaDownload />
          Download Current Card
        </button>
        {downloadDisabled && (
          <p className="text-sm text-red-600 text-center">
            Login required to download
          </p>
        )}
      </div>

      {/* RIGHT PANEL - ID CARD PREVIEW & CROPPER */}
      <div className="flex-1">
        {cropMode ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-2">Crop Image</h2>
            
            {/* Crop Preset Selection */}
            <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded items-center">
              <label className="text-sm font-medium">Crop Preset:</label>
              <select 
                value={selectedCropPreset}
                onChange={(e) => handleCropPresetChange(e.target.value)}
                className="border rounded px-2 py-1 text-sm bg-white"
              >
                {Object.entries(cropPresets).map(([key, preset]) => (
                  <option key={key} value={key}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Adjustment Controls */}
            <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded">
              <button onClick={rotateLeft} className="p-2 bg-white border rounded flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors">
                <FaRotateLeft /> Rotate 90° Left
              </button>
              <button onClick={rotateRight} className="p-2 bg-white border rounded flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors">
                <FaRotateRight /> Rotate 90° Right
              </button>
              
              {/* Fine rotation controls for custom preset */}
              {selectedCropPreset === 'custom' && (
                <>
                  <button onClick={rotateFineLeft} className="p-2 bg-white border rounded flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors">
                    <FaRotateLeft /> Rotate 1° Left
                  </button>
                  <button onClick={rotateFineRight} className="p-2 bg-white border rounded flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors">
                    <FaRotateRight /> Rotate 1° Right
                  </button>
                  <button onClick={increaseCropSize} className="p-2 bg-white border rounded flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors">
                    <FaUpRightAndDownLeftFromCenter /> Larger
                  </button>
                  <button onClick={decreaseCropSize} className="p-2 bg-white border rounded flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors">
                    <FaDownLeftAndUpRightToCenter  /> Smaller
                  </button>
                </>
              )}
            </div>

            {/* Rotation Display */}
            <div className="text-sm text-center text-blue-600">
              Current Rotation: {rotation}°
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded">
              <span className="text-sm font-medium">Zoom:</span>
              <div className="flex items-center gap-1">
                <button onClick={decreaseZoom} className="w-8 h-8 bg-white border rounded flex items-center justify-center hover:bg-gray-50 transition-colors">
                  -
                </button>
                <input
                  type="range"
                  value={zoom}
                  min={0.1}
                  max={3}
                  step={0.01}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-24 cursor-pointer"
                />
                <button onClick={increaseZoom} className="w-8 h-8 bg-white border rounded flex items-center justify-center hover:bg-gray-50 transition-colors">
                  +
                </button>
              </div>
              <span className="text-sm w-12">{Math.round(zoom * 100)}%</span>
            </div>

            {/* Current Crop Size Display */}
            <div className="text-sm text-gray-600 text-center">
              Current Crop Size: {cropSize.width} × {cropSize.height}px
              {selectedCropPreset === 'custom' && (
                <span className="text-xs text-blue-600 block">
                  (Max: {getMaxCropSize().width} × {getMaxCropSize().height}px with 20px padding)
                </span>
              )}
            </div>

            {/* Cropper Container */}
            <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={cropSize.width / cropSize.height}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropSize={cropSize}
                showGrid={true}
                style={{
                  containerStyle: {
                    width: "100%",
                    height: "100%",
                    position: "relative"
                  },
                  cropAreaStyle: {
                    border: "2px solid blue",
                    background: "rgba(0, 0, 255, 0.1)"
                  }
                }}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button onClick={applyCroppedImage} className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700 transition-colors">
                <FaCrop />
                {editingImageIndex !== null ? 'Update Image' : 'Apply Crop'}
              </button>
              <button onClick={() => setCropMode(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <h2 className="text-xl font-bold">ID Card Preview</h2>
              <button
                onClick={toggleOrientation}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded w-full sm:w-auto justify-center hover:bg-blue-700 transition-colors"
              >
                Switch to {orientation === 'portrait' ? 'Landscape' : 'Portrait'}
              </button>
            </div>
            
            <div className="text-sm text-gray-600 mb-2 flex flex-wrap gap-1 items-center">
              <kbd className="px-2 py-1 bg-gray-200 rounded">Delete</kbd>
              <span>to remove •</span>
              <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+Z</kbd>
              <span>to undo •</span>
              <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+Y</kbd>
              <span>to redo •</span>
              <kbd className="px-2 py-1 bg-gray-200 rounded">Double-click</kbd>
              <span>image to edit</span>
            </div>
            
            <div className="flex justify-center">
              <div
                ref={cardRef}
                style={{
                  width: `${currentDimensions.width}px`,
                  height: `${currentDimensions.height}px`,
                  background: "white",
                  position: "relative",
                  border: "1px solid #ccc",
                  maxWidth: "100%",
                  transform: "scale(0.9)",
                  transformOrigin: "center"
                }}
                className="mx-auto shadow-lg"
              >
                {elements.map((el, i) => (
                  <Rnd
                    key={el.id || i}
                    default={{ x: el.x, y: el.y, width: el.w || 120, height: el.h || 120 }}
                    bounds="parent"
                    onDragStop={(e, d) => updateElement(i, { x: d.x, y: d.y })}
                    onResizeStop={(e, direction, ref, delta, position) => {
                      updateElement(i, {
                        w: parseInt(ref.style.width),
                        h: parseInt(ref.style.height),
                        ...position
                      });
                    }}
                  >
                    <div 
                      onClick={() => setSelectedElement(i)}
                      onDoubleClick={() => el.type === 'image' && editImageElement(i)}
                      style={{ 
                        border: selectedElement === i ? '2px dashed blue' : 'none',
                        width: '100%', 
                        height: '100%',
                        cursor: 'move',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {el.type === "text" && (
                        <div
                          style={{ 
                            color: el.color, 
                            fontSize: `${el.size}px`,
                            width: '100%',
                            textAlign: 'center'
                          }}
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => updateElement(i, { text: e.target.textContent })}
                        >
                          {el.text}
                        </div>
                      )}

                      {el.type === "image" && (
                        <div className="w-full h-full">
                          <img
                            src={el.src} 
                            alt="cropped" 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">Image failed to load</div>';
                            }}
                            crossOrigin="anonymous"
                          />
                        </div>
                      )}

                      {el.type === "icon" && (
                        <div style={{ color: el.color, transform: 'scale(1.2)' }}>
                          {renderIcon(el.iconType, el.size, el.color)}
                        </div>
                      )}

                      {el.type === "shape" && (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: el.color,
                            border: `${el.strokeWidth}px solid ${el.strokeColor}`,
                            borderRadius: el.shape === "circle" ? "50%" : "0",
                            clipPath:
                              el.shape === "triangle"
                                ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                                : el.shape === "star"
                                ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                                : "none",
                          }}
                        ></div>
                      )}
                    </div>
                  </Rnd>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}