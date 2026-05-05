import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, customer: null });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customers');
      setCustomers(response.data);
    } catch (error) {
      enqueueSnackbar('Error fetching customers', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/customers/${deleteDialog.customer.id}`);
      setCustomers(customers.filter(c => c.id !== deleteDialog.customer.id));
      enqueueSnackbar('Customer deleted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error deleting customer', { variant: 'error' });
    } finally {
      setDeleteDialog({ open: false, customer: null });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'prospect': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Customers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/customers/new')}
        >
          Add Customer
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Customers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id} hover>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.company || '-'}</TableCell>
                <TableCell>{customer.phone || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={customer.status}
                    color={getStatusColor(customer.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(customer.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/customers/${customer.id}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialog({ open: true, customer })}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? 'No customers found matching your search.' : 'No customers yet.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, customer: null })}
      >
        <DialogTitle>Delete Customer</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {deleteDialog.customer?.name}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, customer: null })}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;