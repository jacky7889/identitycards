"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { READ_ADMIN_URL, UPDATE_ADMIN_URL } from "@/libs/config";

export default function EditBrandClient({ id }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // State for all fields
  const [companyname, setCompanyname] = useState("");
  const [copyright, setCopyright] = useState("");
  const [contactStatus, setContactStatus] = useState("");
  const [contactAdd, setContactAdd] = useState("");
  const [contactEmails, setContactEmails] = useState("");
  const [contactNumbers, setContactNumbers] = useState("");
  const [mapStatus, setMapStatus] = useState("");
  const [map, setMap] = useState("");

  // ------------------------------
  // FETCH DETAILS BY ID
  // ------------------------------
  useEffect(() => {
    if (!id) return;

    const fetchContactDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${READ_ADMIN_URL}/contact_locations.php?id=${id}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch contact details');
        }
        
        const data = await res.json();
        const row = data.data?.[0];
        
        if (row) {
          // Set all fields including companyname and copyright
          setCompanyname(String(row.companyname || ""));
          setCopyright(String(row.copyright || ""));
          setContactStatus(String(row.contact_status || ""));
          setContactAdd(String(row.contact || ""));
          setContactEmails(String(row.emails || ""));
          setContactNumbers(String(row.numbers || ""));
          setMapStatus(String(row.map_status || ""));
          setMap(String(row.map || ""));
        } else {
          alert("Contact details not found");
          router.push("/admin/brandDetails");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load contact details");
      } finally {
        setLoading(false);
      }
    };

    fetchContactDetails();
  }, [id, router]);

  // ------------------------------
  // UPDATE DETAILS USING ID
  // ------------------------------
  const handleUpdate = async () => {
    if (!companyname.trim()) {
      alert("Company name is required");
      return;
    }

    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append("id", String(id));
      formData.append("companyname", companyname);
      formData.append("copyright", copyright);
      formData.append("contact_status", contactStatus);
      formData.append("contact", contactAdd);
      formData.append("emails", contactEmails);
      formData.append("numbers", contactNumbers);
      formData.append("map_status", mapStatus);
      formData.append("map", map);

      const res = await fetch(
        `${UPDATE_ADMIN_URL}/contact_locations.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const result = await res.json();
      
      if (result.success) {
        alert("✅ Contact details updated successfully!");
        router.push("/admin/brandDetails");
      } else {
        alert("❌ Update failed: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating contact details:", error);
      alert("❌ Update failed: Network error");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Edit Contact & Brand Details</h1>

      <div className="space-y-6">
        {/* COMPANY NAME */}
        <div className="form-group">
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            type="text"
            value={companyname}
            onChange={(e) => setCompanyname(e.target.value)}
            placeholder="Enter company name"
          />
          <p className="text-xs text-gray-500 mt-1">
            {`Format: "LogoText, CompanyName" (e.g., "CG, Creation Graphics")`}
          </p>
        </div>

        {/* COPYRIGHT */}
        <div className="form-group">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Copyright Text</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            type="text"
            value={copyright}
            onChange={(e) => setCopyright(e.target.value)}
            placeholder="Enter copyright text"
          />
          <p className="text-xs text-gray-500 mt-1">
            {`e.g., "© 2024 Your Company. All rights reserved."`}
          </p>
        </div>

        {/* CONTACT ADDRESS */}
        <div className="form-group">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Contact Address</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            type="text"
            value={contactAdd}
            onChange={(e) => setContactAdd(e.target.value)}
            placeholder="Enter contact address"
          />
        </div>

        {/* EMAILS */}
        <div className="form-group">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Emails</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            type="text"
            value={contactEmails}
            onChange={(e) => setContactEmails(e.target.value)}
            placeholder="Enter email addresses (comma separated)"
          />
        </div>

        {/* NUMBERS */}
        <div className="form-group">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Phone Numbers</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            type="text"
            value={contactNumbers}
            onChange={(e) => setContactNumbers(e.target.value)}
            placeholder="Enter phone numbers (comma separated)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CONTACT STATUS */}
          <div className="form-group">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Contact Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              value={contactStatus}
              onChange={(e) => setContactStatus(e.target.value)}
            >
              <option value="0">Disable Contact</option>
              <option value="1">Enable Contact</option>
            </select>
          </div>

          {/* MAP STATUS */}
          <div className="form-group">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Map Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              value={mapStatus}
              onChange={(e) => setMapStatus(e.target.value)}
            >
              <option value="0">Disable Map</option>
              <option value="1">Enable Map</option>
            </select>
          </div>
        </div>

        {/* MAP URL */}
        <div className="form-group">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Map URL</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            type="text"
            value={map}
            onChange={(e) => setMap(e.target.value)}
            placeholder="Enter Google Maps embed URL or iframe code"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/brandDetails")}
            className="cursor-pointer w-full sm:flex-1 bg-gray-500 text-white px-4 sm:px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className={`cursor-pointer w-full sm:flex-1 px-4 sm:px-6 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm sm:text-base ${
              isUpdating
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {isUpdating ? "Updating..." : "Update Contact"}
          </button>
        </div>
      </div>
    </div>
  );
}