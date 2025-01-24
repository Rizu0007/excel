'use client';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { CheckCircle, AlertCircle, Download, RefreshCw, User, Mail, Phone, Briefcase, UserCircle } from 'lucide-react';

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
      const worksheet = XLSX.utils.json_to_sheet(savedLeads);
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Lead Entry Form</h2>
      {status.message && (
        <div className={`p-3 rounded-md ${status.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
          {status.type === 'success' ? <CheckCircle className="text-green-500" /> : <AlertCircle className="text-red-500" />} {status.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="clientName" placeholder="Client Name" value={formData.clientName} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="text" name="brandName" placeholder="Brand Name" value={formData.brandName} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="text" name="agentName" placeholder="Agent Name" value={formData.agentName} onChange={handleChange} required className="w-full p-2 border rounded" />
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Saving...' : 'Save Lead'}</button>
      </form>
      <button onClick={handleExport} className="w-full mt-2 p-2 bg-green-600 text-white rounded">Export to Excel</button>
    </div>
  );
};

export default LeadForm;
