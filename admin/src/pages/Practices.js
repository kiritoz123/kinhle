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

export default function Practices() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    title: '', 
    content: '', 
    imageUrl: '',
    festivalType: '', 
    order: 0, 
    isActive: true 
  });

  const festivalTypes = ['Tết', 'Rằm', 'Vía', 'Tết Trung Thu', 'Vu Lan', 'Thanh Minh', 'Khác'];

  const load = async () => {
    const r = await API.get('/api/admin/practices');
    setList(r.data || []);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { 
    setEditing(null); 
    setForm({ title: '', content: '', imageUrl: '', festivalType: '', order: 0, isActive: true }); 
    setOpen(true); 
  };
  
  const openEdit = (item) => { 
    setEditing(item); 
    setForm({ 
      title: item.title, 
      content: item.content || '', 
      imageUrl: item.imageUrl || '',
      festivalType: item.festivalType || '', 
      order: item.order || 0, 
      isActive: item.isActive !== false 
    }); 
    setOpen(true); 
  };

  const save = async () => {
    const payload = { ...form };
    if (editing) await API.put(`/api/admin/practices/${editing.id}`, payload);
    else await API.post('/api/admin/practices', payload);
    setOpen(false); 
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Xóa hướng dẫn này?')) return;
    await API.delete(`/api/admin/practices/${id}`);
    load();
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Hướng dẫn thực hành</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={openNew}>Thêm hướng dẫn</Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Loại ngày lễ</TableCell>
              <TableCell>Thứ tự</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.festivalType || '-'}</TableCell>
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
        <DialogTitle>{editing ? 'Sửa hướng dẫn' : 'Thêm hướng dẫn'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <TextField 
            label="Tiêu đề" 
            value={form.title} 
            onChange={e => setForm({ ...form, title: e.target.value })} 
            fullWidth 
          />
          <TextField 
            label="URL ảnh minh họa" 
            value={form.imageUrl} 
            onChange={e => setForm({ ...form, imageUrl: e.target.value })} 
            fullWidth
            placeholder="https://example.com/image.jpg"
          />
          {form.imageUrl && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>Preview ảnh:</Typography>
              <img src={form.imageUrl} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: 8 }} />
            </Box>
          )}
          <Box>
            <Typography variant="subtitle2" gutterBottom>Nội dung</Typography>
            <ReactQuill 
              theme="snow"
              value={form.content}
              onChange={(value) => setForm({ ...form, content: value })}
              modules={quillModules}
              style={{ height: '250px', marginBottom: '50px' }}
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
