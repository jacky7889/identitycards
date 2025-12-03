"use client";
import { useState } from "react";
import { CREATE_URL} from "@/libs/config";

export default function ContactClient({ initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactno: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    contactno: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    contactno: false,
    message: false,
  });

  // Use the data passed from server component
  const { 
    contactAdd, 
    contactEmails, 
    contactNumbers, 
    map, 
    contactStatus, 
    mapStatus 
  } = initialData;

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 3) {
          error = "Name must be at least 3 characters";
        } else if (value.trim().split(' ').length < 2) {
          error = "Name must contain at least 2 words";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;

      case "contactno":
        if (!value.trim()) {
          error = "Contact number is required";
        } else if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) {
          error = "Contact number must be 10 digits";
        }
        break;

      case "message":
        if (!value.trim()) {
          error = "Message is required";
        } else {
          const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
          if (wordCount < 10) {
            error = `Message must be at least 10 words (currently ${wordCount})`;
          }
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format contact number to only allow digits
    let formattedValue = value;
    if (name === "contactno") {
      formattedValue = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Validate field in real-time if it's been touched
    if (touched[name]) {
      const error = validateField(name, formattedValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    // Clear error when user focuses on the field
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};

    Object.keys(formData).forEach(key => {
      newTouched[key] = true;
      newErrors[key] = validateField(key, formData[key]);
    });

    setTouched(newTouched);
    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Please fix the errors before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Sending data:', formData);
      
      const response = await fetch(`${CREATE_URL}/contact.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          to_email: contactEmails[0] // Dynamic email
        }),
      });

      console.log('Response status:', formData);
      
      const result = await response.json();
      console.log('Response result:', result);

      if (result.success) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", contactno: "", message: "" });
        setTouched({ name: false, email: false, contactno: false, message: false });
        setErrors({ name: "", email: "", contactno: "", message: "" });
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert("An error occurred while sending the message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to count words
  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <div id="contact" className="bg-gray-50">
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
          {/* Left Side - Form */}
          <div>
            <h1 className="text-3xl font-bold mb-4">
              Ask <span className="text-blue-600">Question</span>
              <i className="block text-base font-normal text-gray-600">
                For Bulk orders and any urgent query, We&apos;d love to hear from you.
              </i>
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6" noValidate>
              {/* Name Field */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  placeholder="Full Name (at least 2 words)"
                  required
                  className={`w-full p-3 border rounded-md transition-colors ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  placeholder="Email Address"
                  required
                  className={`w-full p-3 border rounded-md transition-colors ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Contact Number Field */}
              <div>
                <input
                  type="text"
                  name="contactno"
                  value={formData.contactno}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  placeholder="10-digit Contact Number"
                  required
                  className={`w-full p-3 border rounded-md transition-colors ${
                    errors.contactno ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.contactno && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.contactno}
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  placeholder={`Your message (minimum 10 words required) - Current: ${getWordCount(formData.message)}/10 words`}
                  required
                  rows="6"
                  className={`w-full p-3 border rounded-md transition-colors resize-vertical ${
                    errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.message ? (
                    <p className="text-red-500 text-sm flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.message}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      {getWordCount(formData.message)}/10 words
                    </p>
                  )}
                  {getWordCount(formData.message) >= 10 && !errors.message && (
                    <p className="text-green-500 text-sm flex items-center">
                      <span className="mr-1">✓</span>
                      Minimum requirement met
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || Object.values(errors).some(error => error !== "")}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed w-full"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Right Side - Contact Info */}
          {contactStatus === 1 ? (<div>
            <h1 className="text-3xl font-bold mb-4">
              Get in <span className="text-blue-600">Touch Now</span>
              <i className="block text-base font-normal text-gray-600">
                Contact us, just direct message or contact info below.
              </i>
            </h1>
            <ul className="space-y-3 text-gray-700">
              <li>
                <i className="fa fa-map-marker mr-2" aria-hidden="true"></i>
                {contactAdd}
              </li>
              <li>
                <i className="fa fa-envelope mr-2" aria-hidden="true"></i>
                <a href={`mailto:${contactEmails[0]}`} className="text-blue-600 hover:underline">
                  {contactEmails[0]}
                </a>
              </li>
              <li>
                <i className="fa fa-envelope mr-2" aria-hidden="true"></i>
                <a href={`mailto:${contactEmails[1]}`} className="text-blue-600 hover:underline">
                  {contactEmails[1]}
                </a>
              </li>
              <li>
                <i className="fa fa-phone mr-2" aria-hidden="true"></i> {contactNumbers[0]}
              </li>
              <li>
                <i className="fa fa-print mr-2" aria-hidden="true"></i> {contactNumbers[1]}
              </li>
            </ul>
          </div>) : ''}
          
        </div>
      </section>

      {/* Map Section */}
      {mapStatus === 1 ? (
        <section className="bg-blue-400 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start text-white">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Find us on Map
              <i className="block text-base font-normal">
                Check map for finding our location.
              </i>
            </h1>
          </div>
          <div className="rounded-lg overflow-hidden h-80 shadow-lg">
            <iframe
              title="Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={map}
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
      ) : ''}
    </div>
  );
}