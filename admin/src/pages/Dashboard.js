import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, CircularProgress } from '@mui/material';
import API from '../api';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/admin/stats')
      .then(r => setStats(r.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;

  if (!stats) return <Typography color="error">Không lấy được dữ liệu thống kê. Hãy kiểm tra backend và token.</Typography>;

  const usersPie = {
    labels: ['Users today', 'Other users'],
    datasets: [{
      data: [stats.usersToday, Math.max(0, stats.totalUsers - stats.usersToday)],
      backgroundColor: ['#1976d2', '#90caf9']
    }]
  };

  const paymentsBar = {
    labels: ['Payments count', 'Total amount (VND)'],
    datasets: [{
      label: 'Payments overview',
      data: [stats.paymentsCount, stats.totalPaymentsAmount],
      backgroundColor: ['#66bb6a', '#ffa726']
    }]
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Total users</Typography>
          <Typography variant="h4">{stats.totalUsers}</Typography>
          <Typography color="textSecondary">New today: {stats.usersToday}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Payments</Typography>
          <Typography variant="h4">{new Intl.NumberFormat().format(stats.totalPaymentsAmount || 0)} VND</Typography>
          <Typography color="textSecondary">Count: {stats.paymentsCount}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Quick actions</Typography>
          <Typography>Use the menu to manage Festivals / Blogs / Prayers</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1">Users distribution</Typography>
          <Pie data={usersPie} />
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1">Payments overview</Typography>
          <Bar data={paymentsBar} options={{ indexAxis: 'y' }} />
        </Paper>
      </Grid>
    </Grid>
  );
}
