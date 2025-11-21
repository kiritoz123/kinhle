import React, { useEffect, useState } from 'react';
import { 
  Grid, Paper, Typography, CircularProgress, Box, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, Card, CardContent 
} from '@mui/material';
import { 
  PeopleAlt, AccountBalanceWallet, TrendingUp, CheckCircle 
} from '@mui/icons-material';
import API from '../api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, paymentsRes, usersRes] = await Promise.all([
          API.get('/api/admin/stats'),
          API.get('/api/admin/payments'),
          API.get('/api/admin/users')
        ]);
        
        setStats(statsRes.data);
        setPayments(paymentsRes.data || []);
        setUsers(usersRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;

  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN').format(amount || 0);
  const formatDate = (date) => new Date(date).toLocaleString('vi-VN');

  // Dữ liệu cho biểu đồ
  const paymentStatusData = [
    { name: 'Thành công', value: payments.filter(p => p.status === 'completed').length },
    { name: 'Đang chờ', value: payments.filter(p => p.status === 'pending').length },
    { name: 'Thất bại', value: payments.filter(p => p.status === 'failed').length },
    { name: 'Đã hủy', value: payments.filter(p => p.status === 'cancelled').length }
  ].filter(d => d.value > 0);

  const revenueData = payments
    .filter(p => p.status === 'completed')
    .reduce((acc, p) => {
      const date = new Date(p.createdAt).toLocaleDateString('vi-VN');
      const existing = acc.find(d => d.date === date);
      if (existing) {
        existing.amount += p.amount;
      } else {
        acc.push({ date, amount: p.amount });
      }
      return acc;
    }, [])
    .slice(-7); // 7 ngày gần nhất

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">Dashboard Thống Kê</Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Tổng Users</Typography>
                  <Typography variant="h4" fontWeight="bold">{stats?.totalUsers || 0}</Typography>
                  <Typography variant="caption">+{stats?.usersToday || 0} hôm nay</Typography>
                </Box>
                <PeopleAlt sx={{ fontSize: 50, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Tổng Thanh Toán</Typography>
                  <Typography variant="h4" fontWeight="bold">{stats?.paymentsCount || 0}</Typography>
                  <Typography variant="caption">Giao dịch</Typography>
                </Box>
                <AccountBalanceWallet sx={{ fontSize: 50, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Tổng Doanh Thu</Typography>
                  <Typography variant="h5" fontWeight="bold">{formatMoney(stats?.totalPaymentsAmount)} ₫</Typography>
                  <Typography variant="caption">VND</Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 50, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Thành Công</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {payments.filter(p => p.status === 'completed').length}
                  </Typography>
                  <Typography variant="caption">Giao dịch</Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 50, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Biểu đồ */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Trạng Thái Thanh Toán</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={paymentStatusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Doanh Thu 7 Ngày Gần Nhất</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatMoney(value) + ' ₫'} />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Bảng Thanh Toán */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Lịch Sử Thanh Toán</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>User Email</strong></TableCell>
                <TableCell><strong>Mã Đơn</strong></TableCell>
                <TableCell><strong>Số Tiền</strong></TableCell>
                <TableCell><strong>Trạng Thái</strong></TableCell>
                <TableCell><strong>Mô Tả</strong></TableCell>
                <TableCell><strong>Thời Gian</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.slice(0, 10).map((payment) => (
                <TableRow key={payment.id} hover>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{payment.user?.email || 'N/A'}</TableCell>
                  <TableCell><code>{payment.orderCode}</code></TableCell>
                  <TableCell><strong>{formatMoney(payment.amount)} ₫</strong></TableCell>
                  <TableCell>
                    <Chip 
                      label={payment.status} 
                      size="small"
                      color={
                        payment.status === 'completed' ? 'success' : 
                        payment.status === 'pending' ? 'warning' : 
                        payment.status === 'failed' ? 'error' : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Bảng Users */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Danh Sách Users</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Tên</strong></TableCell>
                <TableCell><strong>Số Dư</strong></TableCell>
                <TableCell><strong>Admin</strong></TableCell>
                <TableCell><strong>Ngày Tạo</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(0, 10).map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.name || '-'}</TableCell>
                  <TableCell><strong>{formatMoney(user.balance || 0)} ₫</strong></TableCell>
                  <TableCell>
                    <Chip 
                      label={user.isAdmin ? 'Admin' : 'User'} 
                      size="small"
                      color={user.isAdmin ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
