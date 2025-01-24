'use client';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { CheckCircle, AlertCircle, Download, RefreshCw, User, Mail, Phone, Briefcase, UserCircle } from 'lucide-react';
import Image from 'next/image';

const LeadForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phoneNumber: '',
    brandName: '',
    agentName: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [savedLeads, setSavedLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (!res.ok) throw new Error('Failed to fetch leads');
      const data = await res.json();
      setSavedLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Error saving lead');

      showStatusNotification('success', 'Lead saved successfully!');
      fetchLeads();
      clearFields();
    } catch (error) {
      showStatusNotification('error', 'Error saving lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const workbook = XLSX.utils.book_new();
  
      // Remove 'id' field and format 'createdAt' for export
      const formattedLeads = savedLeads.map(({ id, ...lead }) => ({
        ...lead,
        createdAt: new Date(lead.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(formattedLeads);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
      XLSX.writeFile(workbook, 'leads.xlsx');
      showStatusNotification('success', 'Leads exported successfully!');
    } catch (error) {
      showStatusNotification('error', 'Error exporting leads. Please try again.');
    }
  };
  

  const showStatusNotification = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clearFields = () => {
    setFormData({
      clientName: '',
      email: '',
      phoneNumber: '',
      brandName: '',
      agentName: ''
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {/* Logo */}
      <div className="w-full max-w-3xl text-center mb-">
        <Image
          src="/DigitalDostLogo.webp"
          alt="Logo"
          className="mx-auto  mb-4"
          height={500}
          width={500}
        />
      </div>

      {/* Total Leads */}
      <div className="w-full max-w-3xl bg-gray-800 text-white p-3 rounded-xl shadow-lg mb-3 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Total Leads Generated</h2>
        <p className="text-2xl font-bold">{savedLeads.length}</p>
      </div>

      <div className="max-w-3xl w-full bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Lead Entry Form</h2>

        {/* Status Notification */}
        {status.message && (
          <div className={`flex items-center gap-3 p-4 rounded-lg shadow-md transition-all duration-300 ${
            status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {status.type === 'success' ? <CheckCircle className="text-green-500 w-6 h-6" /> : <AlertCircle className="text-red-500 w-6 h-6" />}
            <span>{status.message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "clientName", icon: <User />, placeholder: "Client Name" },
              { name: "email", icon: <Mail />, placeholder: "Email" },
              { name: "phoneNumber", icon: <Phone />, placeholder: "Phone Number" },
              { name: "brandName", icon: <Briefcase />, placeholder: "Brand Name" },
              { name: "agentName", icon: <UserCircle />, placeholder: "Agent Name" },
            ].map((field, index) => (
              <div key={index} className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">{field.icon}</span>
                <input
                  type="text"
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 transition-all"
                />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              {loading ? 'Saving...' : 'Save Lead'}
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export to Excel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
