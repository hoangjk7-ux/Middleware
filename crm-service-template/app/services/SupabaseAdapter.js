const { createClient } = require('@supabase/supabase-js');

class SupabaseAdapter {
  constructor() {
    this.supabase = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return this.supabase;

    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_KEY environment variables');
      }

      this.supabase = createClient(supabaseUrl, supabaseKey);

      // Test connection
      const { data, error } = await this.supabase.auth.getSession();
      if (error) throw error;

      this.isConnected = true;
      console.log('✅ Supabase adapter connected');
      return this.supabase;
    } catch (error) {
      console.error('❌ Supabase adapter connection failed:', error.message);
      throw error;
    }
  }

  // User operations
  async createUser(userData) {
    await this.connect();
    const { data, error } = await this.supabase
      .from('users')
      .insert([{
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'user'
      }])
      .select();

    if (error) throw error;
    return data[0];
  }

  async getUserById(id) {
    await this.connect();
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getUserByEmail(email) {
    await this.connect();
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  }

  async updateUser(id, updateData) {
    await this.connect();
    const { data, error } = await this.supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  async deleteUser(id) {
    await this.connect();
    const { error } = await this.supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // Customer operations
  async createCustomer(customerData) {
    await this.connect();
    const { data, error } = await this.supabase
      .from('customers')
      .insert([{
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address_street: customerData.address?.street,
        address_city: customerData.address?.city,
        address_state: customerData.address?.state,
        address_zip_code: customerData.address?.zipCode,
        address_country: customerData.address?.country,
        company: customerData.company,
        notes: customerData.notes
      }])
      .select();

    if (error) throw error;
    return data[0];
  }

  async getAllCustomers() {
    await this.connect();
    const { data, error } = await this.supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getCustomerById(id) {
    await this.connect();
    const { data, error } = await this.supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateCustomer(id, updateData) {
    await this.connect();
    const { data, error } = await this.supabase
      .from('customers')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  async deleteCustomer(id) {
    await this.connect();
    const { error } = await this.supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // Lead operations
  async createLead(leadData) {
    await this.connect();
    const { data, error } = await this.supabase
      .from('leads')
      .insert([{
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        position: leadData.position,
        source: leadData.source || 'other',
        status: leadData.status || 'new',
        notes: leadData.notes,
        assigned_to: leadData.assignedTo
      }])
      .select();

    if (error) throw error;
    return data[0];
  }

  async getAllLeads() {
    await this.connect();
    const { data, error } = await this.supabase
      .from('leads')
      .select(`
        *,
        assigned_to:users(username, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getLeadById(id) {
    await this.connect();
    const { data, error } = await this.supabase
      .from('leads')
      .select(`
        *,
        assigned_to:users(username, email)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateLead(id, updateData) {
    await this.connect();
    const { data, error } = await this.supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  async deleteLead(id) {
    await this.connect();
    const { error } = await this.supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // Interaction operations
  async createInteraction(interactionData) {
    await this.connect();
    const { data, error } = await this.supabase
      .from('interactions')
      .insert([{
        customer_id: interactionData.customer,
        type: interactionData.type,
        description: interactionData.description,
        date: interactionData.date,
        user_id: interactionData.user,
        notes: interactionData.notes
      }])
      .select();

    if (error) throw error;
    return data[0];
  }

  async getAllInteractions() {
    await this.connect();
    const { data, error } = await this.supabase
      .from('interactions')
      .select(`
        *,
        customer_id:customers(name, email),
        user_id:users(username, email)
      `)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getInteractionsByCustomer(customerId) {
    await this.connect();
    const { data, error } = await this.supabase
      .from('interactions')
      .select(`
        *,
        customer_id:customers(name, email),
        user_id:users(username, email)
      `)
      .eq('customer_id', customerId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateInteraction(id, updateData) {
    await this.connect();
    const { data, error } = await this.supabase
      .from('interactions')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  async deleteInteraction(id) {
    await this.connect();
    const { error } = await this.supabase
      .from('interactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // Statistics
  async getLeadStatistics() {
    await this.connect();
    const { data, error } = await this.supabase
      .from('leads')
      .select('status')
      .then(result => {
        if (result.error) throw result.error;
        const stats = {};
        result.data.forEach(lead => {
          stats[lead.status] = (stats[lead.status] || 0) + 1;
        });
        return Object.entries(stats).map(([status, count]) => ({ _id: status, count }));
      });

    if (error) throw error;
    return data;
  }
}

module.exports = new SupabaseAdapter();