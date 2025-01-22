export class LeadStorage {
    constructor() {
      this.storageKey = 'leads_data';
      this.initializeStorage();
    }
  
    initializeStorage() {
      if (!localStorage.getItem(this.storageKey)) {
        localStorage.setItem(this.storageKey, JSON.stringify([]));
      }
    }
  
    getAllLeads() {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }
  
    saveLead(leadData) {
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
      const leads = this.getAllLeads();
      return leads;
    }
  
    clearAllLeads() {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }
  