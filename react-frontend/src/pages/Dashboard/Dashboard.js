import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalLeads: 0,
    activeLeads: 0,
    conversionRate: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activitiesResponse] = await Promise.all([
        axios.get('/api/dashboard/stats'),
        axios.get('/api/dashboard/activities'),
      ]);

      setStats(statsResponse.data);
      setRecentActivities(activitiesResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <PeopleIcon />,
      color: 'primary.main',
      bgColor: 'primary.light',
    },
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: <BusinessIcon />,
      color: 'secondary.main',
      bgColor: 'secondary.light',
    },
    {
      title: 'Active Leads',
      value: stats.activeLeads,
      icon: <AssignmentIcon />,
      color: 'warning.main',
      bgColor: 'warning.light',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: <TrendingUpIcon />,
      color: 'success.main',
      bgColor: 'success.light',
    },
  ];

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {card.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: card.bgColor,
                      color: card.color,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activities */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <ListItem key={index} divider={index < recentActivities.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {activity.type === 'customer' ? <PeopleIcon /> : <BusinessIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.description}
                      secondary={new Date(activity.created_at).toLocaleDateString()}
                    />
                    <Chip
                      label={activity.status}
                      color={activity.status === 'completed' ? 'success' : 'default'}
                      size="small"
                    />
                  </ListItem>
                ))}
                {recentActivities.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No recent activities" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip
                  label="Add New Customer"
                  clickable
                  color="primary"
                  variant="outlined"
                  onClick={() => {/* Navigate to add customer */}}
                />
                <Chip
                  label="Create Lead"
                  clickable
                  color="secondary"
                  variant="outlined"
                  onClick={() => {/* Navigate to add lead */}}
                />
                <Chip
                  label="View Reports"
                  clickable
                  color="info"
                  variant="outlined"
                  onClick={() => {/* Navigate to reports */}}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;