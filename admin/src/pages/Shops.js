import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Chip, Rating, Box, Tabs, Tab } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StoreIcon from '@mui/icons-material/Store';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import API from '../api';

export default function Shops() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tabValue, setTabValue] = useState(0); // 0: Tất cả, 1: Chờ duyệt, 2: Đã duyệt
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    owner: '', 
    phone: '', 
    address: '', 
    logo: '', 
    rating: 5.0,
    status: 'pending',
    isActive: true 
  });

  const load = async () => {
    const r = await API.get('/api/admin/shops');
    setList(r.data || []);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { 
    setEditing(null); 
    setForm({ name: '', description: '', owner: '', phone: '', address: '', logo: '', rating: 5.0, status: 'approved', isActive: true }); 
    setOpen(true); 
  };
  
  const openEdit = (item) => { 
    setEditing(item); 
    setForm({ 
      name: item.name, 
      description: item.description || '', 
      owner: item.owner || '', 
      phone: item.phone || '', 
      address: item.address || '', 
      logo: item.logo || '', 
      rating: item.rating || 5.0,
      status: item.status || 'pending',
      isActive: item.isActive !== false 
    }); 
    setOpen(true); 
  };

  const approveShop = async (id, status) => {
    try {
      await API.put(`/api/admin/shops/${id}/approve`, { status });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Lỗi khi duyệt shop');
    }
  };

  const save = async () => {
    const payload = { ...form };
    if (editing) await API.put(`/api/admin/shops/${editing.id}`, payload);
    else await API.post('/api/admin/shops', payload);
    setOpen(false); 
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Xóa shop này?')) return;
    await API.delete(`/api/admin/shops/${id}`);
    load();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      case 'pending': return 'Chờ duyệt';
      default: return status;
    }
  };

  const filteredList = list.filter(item => {
    if (tabValue === 1) return item.status === 'pending';
    if (tabValue === 2) return item.status === 'approved';
    return true;
  });

  return (
    <div>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <StoreIcon fontSize="large" color="primary" />
        <Typography variant="h5" fontWeight="bold">Quản lý Shop</Typography>
      </Box>
      
      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
        <Tab label={`Tất cả (${list.length})`} />
        <Tab label={`Chờ duyệt (${list.filter(s => s.status === 'pending').length})`} />
        <Tab label={`Đã duyệt (${list.filter(s => s.status === 'approved').length})`} />
      </Tabs>

      <Button variant="contained" sx={{ mb: 2 }} onClick={openNew}>Thêm Shop</Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><strong>Logo</strong></TableCell>
              <TableCell><strong>Tên Shop</strong></TableCell>
              <TableCell><strong>Chủ Shop</strong></TableCell>
              <TableCell><strong>Điện thoại</strong></TableCell>
              <TableCell><strong>Địa chỉ</strong></TableCell>
              <TableCell><strong>Đánh giá</strong></TableCell>
              <TableCell><strong>Trạng thái duyệt</strong></TableCell>
              <TableCell><strong>Hoạt động</strong></TableCell>
              <TableCell><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList.map(item => (
              <TableRow key={item.id} hover>
                <TableCell>
                  {item.logo ? <img src={item.logo} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} /> : '-'}
                </TableCell>
                <TableCell><strong>{item.name}</strong></TableCell>
                <TableCell>{item.owner || '-'}</TableCell>
                <TableCell>{item.phone || '-'}</TableCell>
                <TableCell>{item.address || '-'}</TableCell>
                <TableCell>
                  <Rating value={parseFloat(item.rating || 0)} readOnly size="small" />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusLabel(item.status)} 
                    color={getStatusColor(item.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Chip label={item.isActive ? 'Hoạt động' : 'Ngừng'} color={item.isActive ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  {item.status === 'pending' && (
                    <Box display="flex" gap={1}>
                      <IconButton 
                        color="success" 
                        size="small" 
                        onClick={() => approveShop(item.id, 'approved')}
                        title="Duyệt"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small" 
                        onClick={() => approveShop(item.id, 'rejected')}
                        title="Từ chối"
                      >
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  )}
                  <IconButton onClick={() => openEdit(item)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(item.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Sửa Shop' : 'Thêm Shop'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <TextField 
            label="Tên Shop" 
            value={form.name} 
            onChange={e => setForm({ ...form, name: e.target.value })} 
            fullWidth 
            required
          />
          <TextField 
            label="Mô tả" 
            multiline 
            rows={3} 
            value={form.description} 
            onChange={e => setForm({ ...form, description: e.target.value })} 
            fullWidth 
          />
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField 
              label="Chủ Shop" 
              value={form.owner} 
              onChange={e => setForm({ ...form, owner: e.target.value })} 
            />
            <TextField 
              label="Điện thoại" 
              value={form.phone} 
              onChange={e => setForm({ ...form, phone: e.target.value })} 
            />
          </Box>
          <TextField 
            label="Địa chỉ" 
            value={form.address} 
            onChange={e => setForm({ ...form, address: e.target.value })} 
            fullWidth 
          />
          <TextField 
            label="URL Logo" 
            value={form.logo} 
            onChange={e => setForm({ ...form, logo: e.target.value })} 
            fullWidth 
          />
          <Box>
            <Typography variant="subtitle2" gutterBottom>Đánh giá</Typography>
            <Rating 
              value={parseFloat(form.rating)} 
              onChange={(e, newValue) => setForm({ ...form, rating: newValue })} 
            />
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Trạng thái:</Typography>
            <Chip 
              label={form.isActive ? 'Hoạt động' : 'Ngừng'} 
              color={form.isActive ? 'success' : 'default'} 
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
              clickable
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={save}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
