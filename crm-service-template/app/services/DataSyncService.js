const mongoose = require('mongoose');
const SupabaseAdapter = require('./SupabaseAdapter');

class DataSyncService {
  constructor() {
    this.mongoConnected = false;
    this.supabaseConnected = false;
  }

  async connectDatabases() {
    try {
      // Connect to MongoDB
      if (!this.mongoConnected) {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crm-db', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        this.mongoConnected = true;
        console.log('✅ MongoDB connected for sync');
      }

      // Connect to Supabase
      if (!this.supabaseConnected) {
        await SupabaseAdapter.connect();
        this.supabaseConnected = true;
        console.log('✅ Supabase connected for sync');
      }
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  // Sync Users from MongoDB to Supabase
  async syncUsersToSupabase() {
    try {
      await this.connectDatabases();

      const User = mongoose.model('User');
      const users = await User.find({}).select('-_id -__v');

      console.log(`🔄 Syncing ${users.length} users to Supabase...`);

      let successCount = 0;
      let errorCount = 0;

      for (const user of users) {
        try {
          await SupabaseAdapter.createUser({
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role
          });
          successCount++;
        } catch (error) {
          console.error(`❌ Failed to sync user ${user.email}:`, error.message);
          errorCount++;
        }
      }

      console.log(`✅ User sync completed: ${successCount} successful, ${errorCount} errors`);
      return { successCount, errorCount };
    } catch (error) {
      console.error('❌ User sync failed:', error.message);
      throw error;
    }
  }

  // Sync Customers from MongoDB to Supabase
  async syncCustomersToSupabase() {
    try {
      await this.connectDatabases();

      const Customer = mongoose.model('Customer');
      const customers = await Customer.find({}).select('-_id -__v');

      console.log(`🔄 Syncing ${customers.length} customers to Supabase...`);

      let successCount = 0;
      let errorCount = 0;

      for (const customer of customers) {
        try {
          await SupabaseAdapter.createCustomer({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            company: customer.company,
            notes: customer.notes
          });
          successCount++;
        } catch (error) {
          console.error(`❌ Failed to sync customer ${customer.email}:`, error.message);
          errorCount++;
        }
      }

      console.log(`✅ Customer sync completed: ${successCount} successful, ${errorCount} errors`);
      return { successCount, errorCount };
    } catch (error) {
      console.error('❌ Customer sync failed:', error.message);
      throw error;
    }
  }

  // Sync Leads from MongoDB to Supabase
  async syncLeadsToSupabase() {
    try {
      await this.connectDatabases();

      const Lead = mongoose.model('Lead');
      const leads = await Lead.find({}).select('-_id -__v');

      console.log(`🔄 Syncing ${leads.length} leads to Supabase...`);

      let successCount = 0;
      let errorCount = 0;

      for (const lead of leads) {
        try {
          await SupabaseAdapter.createLead({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            company: lead.company,
            position: lead.position,
            source: lead.source,
            status: lead.status,
            notes: lead.notes,
            assignedTo: lead.assignedTo
          });
          successCount++;
        } catch (error) {
          console.error(`❌ Failed to sync lead ${lead.email}:`, error.message);
          errorCount++;
        }
      }

      console.log(`✅ Lead sync completed: ${successCount} successful, ${errorCount} errors`);
      return { successCount, errorCount };
    } catch (error) {
      console.error('❌ Lead sync failed:', error.message);
      throw error;
    }
  }

  // Sync Interactions from MongoDB to Supabase
  async syncInteractionsToSupabase() {
    try {
      await this.connectDatabases();

      const Interaction = mongoose.model('Interaction');
      const interactions = await Interaction.find({}).select('-_id -__v');

      console.log(`🔄 Syncing ${interactions.length} interactions to Supabase...`);

      let successCount = 0;
      let errorCount = 0;

      for (const interaction of interactions) {
        try {
          await SupabaseAdapter.createInteraction({
            customer: interaction.customer,
            type: interaction.type,
            description: interaction.description,
            date: interaction.date,
            user: interaction.user,
            notes: interaction.notes
          });
          successCount++;
        } catch (error) {
          console.error(`❌ Failed to sync interaction:`, error.message);
          errorCount++;
        }
      }

      console.log(`✅ Interaction sync completed: ${successCount} successful, ${errorCount} errors`);
      return { successCount, errorCount };
    } catch (error) {
      console.error('❌ Interaction sync failed:', error.message);
      throw error;
    }
  }

  // Sync all data from MongoDB to Supabase
  async syncAllToSupabase() {
    try {
      console.log('🚀 Starting full data sync to Supabase...');

      const results = {
        users: await this.syncUsersToSupabase(),
        customers: await this.syncCustomersToSupabase(),
        leads: await this.syncLeadsToSupabase(),
        interactions: await this.syncInteractionsToSupabase()
      };

      console.log('✅ Full data sync completed!');
      console.log('📊 Summary:', results);

      return results;
    } catch (error) {
      console.error('❌ Full sync failed:', error.message);
      throw error;
    }
  }

  // Sync from Supabase to MongoDB (reverse sync)
  async syncFromSupabaseToMongoDB() {
    try {
      await this.connectDatabases();

      console.log('🔄 Starting reverse sync from Supabase to MongoDB...');

      // Get data from Supabase
      const [users, customers, leads, interactions] = await Promise.all([
        SupabaseAdapter.supabase.from('users').select('*'),
        SupabaseAdapter.supabase.from('customers').select('*'),
        SupabaseAdapter.supabase.from('leads').select('*'),
        SupabaseAdapter.supabase.from('interactions').select('*')
      ]);

      // Sync to MongoDB
      const User = mongoose.model('User');
      const Customer = mongoose.model('Customer');
      const Lead = mongoose.model('Lead');
      const Interaction = mongoose.model('Interaction');

      let results = {
        users: { successCount: 0, errorCount: 0 },
        customers: { successCount: 0, errorCount: 0 },
        leads: { successCount: 0, errorCount: 0 },
        interactions: { successCount: 0, errorCount: 0 }
      };

      // Sync users
      for (const user of users.data || []) {
        try {
          await User.findOneAndUpdate(
            { email: user.email },
            {
              username: user.username,
              email: user.email,
              password: user.password,
              role: user.role
            },
            { upsert: true, new: true }
          );
          results.users.successCount++;
        } catch (error) {
          console.error(`❌ Failed to sync user ${user.email}:`, error.message);
          results.users.errorCount++;
        }
      }

      // Sync customers
      for (const customer of customers.data || []) {
        try {
          await Customer.findOneAndUpdate(
            { email: customer.email },
            {
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
              address: {
                street: customer.address_street,
                city: customer.address_city,
                state: customer.address_state,
                zipCode: customer.address_zip_code,
                country: customer.address_country
              },
              company: customer.company,
              notes: customer.notes
            },
            { upsert: true, new: true }
          );
          results.customers.successCount++;
        } catch (error) {
          console.error(`❌ Failed to sync customer ${customer.email}:`, error.message);
          results.customers.errorCount++;
        }
      }

      // Sync leads
      for (const lead of leads.data || []) {
        try {
          await Lead.findOneAndUpdate(
            { email: lead.email },
            {
              name: lead.name,
              email: lead.email,
              phone: lead.phone,
              company: lead.company,
              position: lead.position,
              source: lead.source,
              status: lead.status,
              notes: lead.notes,
              assignedTo: lead.assigned_to
            },
            { upsert: true, new: true }
          );
          results.leads.successCount++;
        } catch (error) {
          console.error(`❌ Failed to sync lead ${lead.email}:`, error.message);
          results.leads.errorCount++;
        }
      }

      // Sync interactions
      for (const interaction of interactions.data || []) {
        try {
          await Interaction.findOneAndUpdate(
            { 
              customer: interaction.customer_id,
              type: interaction.type,
              description: interaction.description,
              date: interaction.date
            },
            {
              customer: interaction.customer_id,
              type: interaction.type,
              description: interaction.description,
              date: interaction.date,
              user: interaction.user_id,
              notes: interaction.notes
            },
            { upsert: true, new: true }
          );
          results.interactions.successCount++;
        } catch (error) {
          console.error(`❌ Failed to sync interaction:`, error.message);
          results.interactions.errorCount++;
        }
      }

      console.log('✅ Reverse sync completed!');
      console.log('📊 Summary:', results);

      return results;
    } catch (error) {
      console.error('❌ Reverse sync failed:', error.message);
      throw error;
    }
  }

  // Check sync status
  async getSyncStatus() {
    try {
      await this.connectDatabases();

      const User = mongoose.model('User');
      const Customer = mongoose.model('Customer');
      const Lead = mongoose.model('Lead');
      const Interaction = mongoose.model('Interaction');

      const [mongoCounts, supabaseCounts] = await Promise.all([
        Promise.all([
          User.countDocuments(),
          Customer.countDocuments(),
          Lead.countDocuments(),
          Interaction.countDocuments()
        ]),
        Promise.all([
          SupabaseAdapter.supabase.from('users').select('*', { count: 'exact', head: true }),
          SupabaseAdapter.supabase.from('customers').select('*', { count: 'exact', head: true }),
          SupabaseAdapter.supabase.from('leads').select('*', { count: 'exact', head: true }),
          SupabaseAdapter.supabase.from('interactions').select('*', { count: 'exact', head: true })
        ])
      ]);

      return {
        mongodb: {
          users: mongoCounts[0],
          customers: mongoCounts[1],
          leads: mongoCounts[2],
          interactions: mongoCounts[3]
        },
        supabase: {
          users: supabaseCounts[0].count,
          customers: supabaseCounts[1].count,
          leads: supabaseCounts[2].count,
          interactions: supabaseCounts[3].count
        }
      };
    } catch (error) {
      console.error('❌ Failed to get sync status:', error.message);
      throw error;
    }
  }
}

module.exports = new DataSyncService();