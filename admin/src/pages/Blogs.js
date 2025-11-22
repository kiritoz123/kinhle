import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Switch, FormControlLabel, Box, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import API from '../api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Cấu hình toolbar cho editor
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['link', 'image'],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ]
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'align',
  'link', 'image',
  'color', 'background'
];

export default function Blogs() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', content: '', category: '', published: false });

  const load = async () => {
    const r = await API.get('/api/admin/blogs');
    setList(r.data || []);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: '', slug: '', content: '', category: '', published: false }); setOpen(true); };
  const openEdit = (b) => { setEditing(b); setForm({ title: b.title, slug: b.slug, content: b.content || '', category: b.category || '', published: b.published }); setOpen(true); };

  const save = async () => {
    if (editing) {
      await API.put(`/api/admin/blogs/${editing.id}`, form);
    } else {
      await API.post('/api/admin/blogs', form);
    }
    setOpen(false);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Xóa thật chứ?')) return;
    await API.delete(`/api/admin/blogs/${id}`);
    load();
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Blogs</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={openNew}>Add Blog</Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Content Preview</TableCell>
              <TableCell>Published</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map(b => (
              <TableRow key={b.id || b._id}>
                <TableCell>{b.title}</TableCell>
                <TableCell>{b.slug}</TableCell>
                <TableCell>
                  {b.category && <Chip label={b.category} size="small" color="primary" />}
                </TableCell>
                <TableCell>
                  <div 
                    dangerouslySetInnerHTML={{ __html: b.content?.substring(0, 100) + '...' }} 
                    style={{ maxWidth: 300, overflow: 'hidden' }}
                  />
                </TableCell>
                <TableCell>{b.published ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEdit(b)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(b.id || b._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{editing ? 'Edit Blog' : 'New Blog'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <TextField 
            label="Title" 
            value={form.title} 
            onChange={e => setForm({ ...form, title: e.target.value })} 
            fullWidth 
          />
          <TextField 
            label="Slug" 
            value={form.slug} 
            onChange={e => setForm({ ...form, slug: e.target.value })} 
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Loại Bài Viết</InputLabel>
            <Select
              value={form.category}
              label="Loại Bài Viết"
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              <MenuItem value="">-- Không chọn --</MenuItem>
              <MenuItem value="Tin tức">Tin tức</MenuItem>
              <MenuItem value="Hướng dẫn">Hướng dẫn</MenuItem>
              <MenuItem value="Văn hoá">Văn Hoá</MenuItem>
              <MenuItem value="Phong tục">Phong tục</MenuItem>
              <MenuItem value="Ngày lễ">Ngày lễ</MenuItem>
              <MenuItem value="Khác">Khác</MenuItem>
            </Select>
          </FormControl>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>Content (HTML Editor)</Typography>
            <ReactQuill 
              theme="snow"
              value={form.content}
              onChange={(value) => setForm({ ...form, content: value })}
              modules={modules}
              formats={formats}
              style={{ height: '300px', marginBottom: '50px' }}
            />
          </Box>

          <FormControlLabel 
            control={
              <Switch 
                checked={form.published} 
                onChange={e => setForm({ ...form, published: e.target.checked })} 
              />
            } 
            label="Published" 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
