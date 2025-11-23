import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box } from '@mui/material';
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

export default function Festivals() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', date: '', lunarDate: '', image: '', description: '' });

  const load = async () => {
    const r = await API.get('/api/admin/festivals');
    setList(r.data || []);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: '', date: '', lunarDate: '', image: '', description: '' }); setOpen(true); };
  const openEdit = (f) => { setEditing(f); setForm({ title: f.title, date: f.date ? f.date.split('T')[0] : '', lunarDate: f.lunarDate || '', image: f.image || '', description: f.description || '' }); setOpen(true); };

  const save = async () => {
    const payload = { ...form };
    if (editing) await API.put(`/api/admin/festivals/${editing.id}`, payload);
    else await API.post('/api/admin/festivals', payload);
    setOpen(false); load();
  };

  const remove = async (id) => {
    if (!window.confirm('Xóa thật chứ?')) return;
    await API.delete(`/api/admin/festivals/${id}`);
    load();
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Festivals</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={openNew}>Add Festival</Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Lunar</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map(f => (
              <TableRow key={f.id}>
                <TableCell>{f.title}</TableCell>
                <TableCell>{f.date ? new Date(f.date).toLocaleDateString() : ''}</TableCell>
                <TableCell>{f.lunarDate || ''}</TableCell>
                <TableCell>{f.image}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEdit(f)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(f.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Festival' : 'New Festival'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} fullWidth />
          <TextField label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} InputLabelProps={{ shrink: true }} />
          <TextField label="Lunar Date" value={form.lunarDate} onChange={e => setForm({ ...form, lunarDate: e.target.value })} />
          <TextField label="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          <Box>
            <Typography variant="subtitle2" gutterBottom>Description</Typography>
            <ReactQuill 
              theme="snow"
              value={form.description}
              onChange={(value) => setForm({ ...form, description: value })}
              modules={quillModules}
              style={{ height: '200px', marginBottom: '50px' }}
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