"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaEdit } from "react-icons/fa";
import { CREATE_ADMIN_URL, DELETE_ADMIN_URL, READ_ADMIN_URL } from "@/libs/config";

export default function ContactListPage() {
  const [contacts, setContacts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    companyname: "",
    copyright: "",
    contact: "",
    emails: "",
    numbers: "",
    contact_status: "1",
    map_status: "1",
    map: ""
  });

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const res = await fetch(`${READ_ADMIN_URL}/contact_locations.php`);
      const data = await res.json();
        setContacts(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Delete contact row
  const handleDelete = async (id) => {
    if (!confirm("Delete this contact entry?")) return;

    try {
      const res = await fetch(
        `${DELETE_ADMIN_URL}/contact_locations.php?id=${id}`
      );
      const data = await res.json();

      alert(data.message);
      if (data.success) fetchContacts();
    } catch (err) {
      alert("Failed to delete record.");
    }
  };

  // Add new contact
  const handleAdd = async () => {
    if (!formData.companyname.trim()) {
      alert("Company name is required");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("companyname", formData.companyname);
      formDataToSend.append("copyright", formData.copyright);
      formDataToSend.append("contact_status", formData.contact_status);
      formDataToSend.append("contact", formData.contact);
      formDataToSend.append("emails", formData.emails);
      formDataToSend.append("numbers", formData.numbers);
      formDataToSend.append("map_status", formData.map_status);
      formDataToSend.append("map", formData.map);

      const res = await fetch(
        `${CREATE_ADMIN_URL}/contact_locations.php`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const result = await res.json();
      alert(result.message);

      if (result.success) {
        // Reset form and hide it
        setFormData({
          companyname: "",
          copyright: "",
          contact: "",
          emails: "",
          numbers: "",
          contact_status: "1",
          map_status: "1",
          map: ""
        });
        setShowAddForm(false);
        fetchContacts(); // Refresh the list
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      alert("Failed to create contact");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">Brand Details</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`cursor-pointer bg-blue-600 text-white px-4 py-2 sm:py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto`}
        >
          {showAddForm ? "Hide" : "Add Contact"}
        </button>
      </div>

      {/* Add Contact Form */}
      {showAddForm && (
        <div className="mb-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">Add New Details</h2>

          <div className="space-y-4">
            {/* COMPANY NAME */}
            <div className="form-group">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                type="text"
                value={formData.companyname}
                onChange={(e) => handleInputChange("companyname", e.target.value)}
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                type="text"
                value={formData.copyright}
                onChange={(e) => handleInputChange("copyright", e.target.value)}
                placeholder="Enter copyright text"
              />
              <p className="text-xs text-gray-500 mt-1">
                {`e.g., "© 2024 Your Company. All rights reserved."`}
              </p>
            </div>

            {/* CONTACT ADDRESS */}
            <div className="form-group">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Contact Address
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                type="text"
                value={formData.contact}
                onChange={(e) => handleInputChange("contact", e.target.value)}
                placeholder="Enter contact address"
              />
            </div>

            {/* EMAILS */}
            <div className="form-group">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Emails</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                type="text"
                value={formData.emails}
                onChange={(e) => handleInputChange("emails", e.target.value)}
                placeholder="Enter emails (comma separated)"
              />
            </div>

            {/* NUMBERS */}
            <div className="form-group">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Phone Numbers</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                type="text"
                value={formData.numbers}
                onChange={(e) => handleInputChange("numbers", e.target.value)}
                placeholder="Enter phone numbers (comma separated)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CONTACT STATUS */}
              <div className="form-group">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Contact Status</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                  value={formData.contact_status}
                  onChange={(e) => handleInputChange("contact_status", e.target.value)}
                >
                  <option value="1">Enable Contact</option>
                  <option value="0">Disable Contact</option>
                </select>
              </div>

              {/* MAP STATUS */}
              <div className="form-group">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Map Status</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                  value={formData.map_status}
                  onChange={(e) => handleInputChange("map_status", e.target.value)}
                >
                  <option value="1">Enable Map</option>
                  <option value="0">Disable Map</option>
                </select>
              </div>
            </div>

            {/* MAP URL */}
            <div className="form-group">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Map URL</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                type="text"
                value={formData.map}
                onChange={(e) => handleInputChange("map", e.target.value)}
                placeholder="Enter map URL or embed code"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                loading
                  ? "bg-blue-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? "Adding Contact..." : "Add Contact"}
            </button>
          </div>
        </div>
      )}

      {/* Contacts Table */}
      <ContactTable
        data={contacts}
        columns={["id", "companyname", "copyright", "contact", "emails", "numbers", "contact_status", "map_status", "map"]}
        onDelete={handleDelete}
        router={router}
      />
    </div>
  );
}

// ----------------------
// CONTACT TABLE COMPONENT
// ----------------------

function ContactTable({ data, columns, onDelete, router }) {
  if (!Array.isArray(data) || data.length === 0)
    return <p className="text-center text-gray-500 py-8">No contact records found.</p>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-200">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 capitalize font-semibold text-gray-700">
                {col.replace("_", " ")}
              </th>
            ))}
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td key={col} className="px-4 py-3 align-top text-sm">
                  {row[col]}
                </td>
              ))}

              <td className="px-4 py-3">
                <div className="flex justify-center gap-3">
                  {/* EDIT BUTTON */}
                  <button
                    className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors p-1 rounded"
                    onClick={() => router.push(`/admin/brandDetails/edit/${row.id}`)}
                    title="Edit"
                  >
                    <FaEdit size={16} />
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    className="cursor-pointer text-red-600 hover:text-red-800 transition-colors p-1 rounded"
                    onClick={() => onDelete(row.id)}
                    title="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}