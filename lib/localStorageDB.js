'use client';

export class LeadStorage {
  constructor() {
    this.storageKey = 'leads_data';
    // Don't initialize in constructor - wait for client-side
  }

  initializeStorage() {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem(this.storageKey)) {
        localStorage.setItem(this.storageKey, JSON.stringify([]));
      }
    }
  }

  getAllLeads() {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  saveLead(leadData) {
    if (typeof window === 'undefined') return null;
    
    const leads = this.getAllLeads();
    const newLead = {
      ...leadData,
      id: `lead_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    leads.push(newLead);
    localStorage.setItem(this.storageKey, JSON.stringify(leads));
    return newLead;
  }

  exportToExcel() {
    return this.getAllLeads();
  }

  clearAllLeads() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify([]));
  }
}