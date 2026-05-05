const Lead = require('../models/Lead');

class LeadService {
  
  async getAllLeads() {
    return await Lead.find().populate('assignedTo', 'username email');
  }

  async getLeadById(id) {
    return await Lead.findById(id).populate('assignedTo', 'username email');
  }

  async getLeadsByStatus(status) {
    return await Lead.find({ status }).populate('assignedTo', 'username email');
  }

  async getLeadsByAssignee(userId) {
    return await Lead.find({ assignedTo: userId }).populate('assignedTo', 'username email');
  }

  async createLead(leadData) {
    const lead = new Lead(leadData);
    return await lead.save();
  }

  async updateLead(id, updateData) {
    return await Lead.findByIdAndUpdate(id, updateData, { new: true }).populate('assignedTo', 'username email');
  }

  async deleteLead(id) {
    return await Lead.findByIdAndDelete(id);
  }

  async assignLead(id, userId) {
    return await Lead.findByIdAndUpdate(id, { assignedTo: userId }, { new: true }).populate('assignedTo', 'username email');
  }

  async convertLead(id, customerId) {
    return await Lead.findByIdAndUpdate(
      id, 
      { status: 'converted', updatedAt: Date.now() }, 
      { new: true }
    );
  }

  async getLeadStatistics() {
    return await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
  }
}

module.exports = new LeadService();