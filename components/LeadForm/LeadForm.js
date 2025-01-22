'use client';

import React, { useState, useEffect } from 'react';
import { LeadStorage } from '@/lib/localStorageDB';
import * as XLSX from 'xlsx';
import { Bell, X, CheckCircle, AlertCircle, Download, RefreshCw, User, Mail, Phone, Briefcase, UserCircle } from 'lucide-react';

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
  const [leadStorage] = useState(new LeadStorage());
  const [savedLeadsCount, setSavedLeadsCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const leads = leadStorage.getAllLeads();
    setSavedLeadsCount(leads.length);
  }, []);

  const showStatusNotification = (type, message) => {
    setStatus({ type, message });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      leadStorage.saveLead(formData);
      setSavedLeadsCount(prev => prev + 1);
      showStatusNotification('success', 'Lead saved successfully!');
      clearFields();
    } catch (error) {
      showStatusNotification('error', 'Error saving lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const leads = leadStorage.exportToExcel();
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(leads);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
      XLSX.writeFile(workbook, 'leads.xlsx');
      showStatusNotification('success', 'Leads exported successfully!');
    } catch (error) {
      showStatusNotification('error', 'Error exporting leads. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

  const inputClasses = "w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200";
  const labelClasses = "flex items-center gap-2 text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Floating Notification */}
      {showNotification && (
        <div className={`fixed top-4 right-4 max-w-sm w-full p-4 rounded-lg shadow-lg transform transition-all duration-500 ${
          status.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            {status.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <p className={`flex-1 text-sm ${
              status.type === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {status.message}
            </p>
            <button
              onClick={() => setShowNotification(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gray-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Lead Entry Form</h2>
              <div className="flex items-center gap-2">
                <span className="bg-red-500 px-3 py-1 rounded-full text-sm text-white">
                  {savedLeadsCount} Leads
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="clientName" className={labelClasses}>
                    <User className="w-4 h-4" /> Client Name
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                    placeholder="Enter client name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClasses}>
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                    placeholder="client@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className={labelClasses}>
                    <Phone className="w-4 h-4" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label htmlFor="brandName" className={labelClasses}>
                    <Briefcase className="w-4 h-4" /> Brand Name/Niche
                  </label>
                  <input
                    type="text"
                    id="brandName"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                    placeholder="Enter brand name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="agentName" className={labelClasses}>
                    <UserCircle className="w-4 h-4" /> Agent Name
                  </label>
                  <input
                    type="text"
                    id="agentName"
                    name="agentName"
                    value={formData.agentName}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                    placeholder="Enter agent name"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 
                    transition duration-200 flex items-center justify-center gap-2
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {loading ? 'Saving...' : 'Save Lead'}
                </button>

                <button
                  type="button"
                  onClick={handleExport}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium 
                    hover:bg-green-700 transition duration-200 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export to Excel
                </button>

                <button
                  type="button"
                  onClick={clearFields}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium 
                    hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;