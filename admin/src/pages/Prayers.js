import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControlLabel, Switch, Box } from '@mui/material';
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

export default function Prayers() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category: '', language: 'vi' });

  const load = async () => {
    const r = await API.get('/api/admin/prayers');
    setList(r.data || []);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: '', content: '', category: '', language: 'vi' }); setOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ title: p.title, content: p.content || '', category: p.category || '', language: p.language || 'vi' }); setOpen(true); };

  const save = async () => {
    if (editing) {
      await API.put(`/api/admin/prayers/${editing.id}`, form);
    } else {
      await API.post('/api/admin/prayers', form);
    }
    setOpen(false);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Xóa thật chứ?')) return;
    await API.delete(`/api/admin/prayers/${id}`);
    load();
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Prayers</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={openNew}>Add Prayer</Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map(p => (
              <TableRow key={p.id || p._id}>
                <TableCell>{p.title}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.language}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEdit(p)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(p.id || p._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Prayer' : 'New Prayer'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <TextField label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} fullWidth />
          <TextField label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <TextField label="Language" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} />
          <Box>
            <Typography variant="subtitle2" gutterBottom>Content</Typography>
            <ReactQuill 
              theme="snow"
              value={form.content}
              onChange={(value) => setForm({ ...form, content: value })}
              modules={quillModules}
              style={{ height: '250px', marginBottom: '50px' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
