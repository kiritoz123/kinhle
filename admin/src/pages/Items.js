import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Switch, FormControlLabel, MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import API from '../api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link'],
    [{ 'color': [] }],
    ['clean']
  ]
};

export default function Items() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    festivalType: '', 
    quantity: '',
    isRequired: true,
    order: 0, 
    isActive: true 
  });

  const festivalTypes = ['Tết', 'Rằm', 'Vía', 'Tết Trung Thu', 'Vu Lan', 'Thanh Minh', 'Khác'];

  const load = async () => {
    const r = await API.get('/api/admin/items');
    setList(r.data || []);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { 
    setEditing(null); 
    setForm({ name: '', description: '', festivalType: '', quantity: '', isRequired: true, order: 0, isActive: true }); 
    setOpen(true); 
  };
  
  const openEdit = (item) => { 
    setEditing(item); 
    setForm({ 
      name: item.name, 
      description: item.description || '', 
      festivalType: item.festivalType || '', 
      quantity: item.quantity || '',
      isRequired: item.isRequired !== false,
      order: item.order || 0, 
      isActive: item.isActive !== false 
    }); 
    setOpen(true); 
  };

  const save = async () => {
    const payload = { ...form };
    if (editing) await API.put(`/api/admin/items/${editing.id}`, payload);
    else await API.post('/api/admin/items', payload);
    setOpen(false); 
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Xóa vật phẩm này?')) return;
    await API.delete(`/api/admin/items/${id}`);
    load();
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Dụng cụ chuẩn bị</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={openNew}>Thêm vật phẩm</Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên vật phẩm</TableCell>
              <TableCell>Loại ngày lễ</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Bắt buộc</TableCell>
              <TableCell>Thứ tự</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.festivalType || '-'}</TableCell>
                <TableCell>{item.quantity || '-'}</TableCell>
                <TableCell>{item.isRequired ? 'Bắt buộc' : 'Tùy chọn'}</TableCell>
                <TableCell>{item.order}</TableCell>
                <TableCell>{item.isActive ? 'Hiển thị' : 'Ẩn'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEdit(item)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(item.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Sửa vật phẩm' : 'Thêm vật phẩm'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <TextField 
            label="Tên vật phẩm" 
            value={form.name} 
            onChange={e => setForm({ ...form, name: e.target.value })} 
            fullWidth 
          />
          <Box>
            <Typography variant="subtitle2" gutterBottom>Mô tả</Typography>
            <ReactQuill 
              theme="snow"
              value={form.description}
              onChange={(value) => setForm({ ...form, description: value })}
              modules={quillModules}
              style={{ height: '150px', marginBottom: '50px' }}
            />
          </Box>
          <FormControl fullWidth>
            <InputLabel>Loại ngày lễ</InputLabel>
            <Select 
              value={form.festivalType} 
              onChange={e => setForm({ ...form, festivalType: e.target.value })}
              label="Loại ngày lễ"
            >
              <MenuItem value="">Tất cả</MenuItem>
              {festivalTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField 
            label="Số lượng gợi ý (VD: 3 bó, 1 chén)" 
            value={form.quantity} 
            onChange={e => setForm({ ...form, quantity: e.target.value })} 
            fullWidth 
          />
          <FormControlLabel 
            control={
              <Switch 
                checked={form.isRequired} 
                onChange={e => setForm({ ...form, isRequired: e.target.checked })} 
              />
            } 
            label="Bắt buộc" 
          />
          <TextField 
            label="Thứ tự hiển thị" 
            type="number" 
            value={form.order} 
            onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} 
            fullWidth 
          />
          <FormControlLabel 
            control={
              <Switch 
                checked={form.isActive} 
                onChange={e => setForm({ ...form, isActive: e.target.checked })} 
              />
            } 
            label="Hiển thị" 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={save}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
