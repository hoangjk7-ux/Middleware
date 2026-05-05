import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Avatar,
  Divider,
  LinearProgress,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const CustomerDetail = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (id !== 'new') {
      fetchCustomer();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`/api/customers/${id}`);
      setCustomer(response.data);
    } catch (error) {
      enqueueSnackbar('Error fetching customer details', { variant: 'error' });
      navigate('/customers');
    } finally {
      setLoading(false);
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

  if (!customer) {
    return (
      <Box>
        <Typography variant="h6">Customer not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/customers" color="inherit">
          Customers
        </Link>
        <Typography color="text.primary">{customer.name}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
            {customer.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4">{customer.name}</Typography>
            <Chip
              label={customer.status}
              color={getStatusColor(customer.status)}
              size="small"
            />
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/customers/${customer.id}/edit`)}
        >
          Edit Customer
        </Button>
      </Box>

      {/* Customer Details */}
      <Grid container spacing={3}>
        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">{customer.email}</Typography>
              </Box>

              {customer.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1">{customer.phone}</Typography>
                </Box>
              )}

              {customer.company && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1">{customer.company}</Typography>
                </Box>
              )}

              {customer.address && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <LocationIcon sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body1">{customer.address}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(customer.created_at).toLocaleDateString()}
                </Typography>
              </Box>

              {customer.updated_at && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Updated: {new Date(customer.updated_at).toLocaleDateString()}
                  </Typography>
                </Box>
              )}

              {customer.notes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {customer.notes}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Interactions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Interactions
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {customer.interactions && customer.interactions.length > 0 ? (
                customer.interactions.map((interaction) => (
                  <Box key={interaction.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2">{interaction.type}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {interaction.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(interaction.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No interactions recorded yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerDetail;