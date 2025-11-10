import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import API from '../api';

export default function Banners() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', link: '', order: 0 });

  const load = async () => {
    const r = await API.get('/api/admin/banners');
    setList(r.data || []);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: '', subtitle: '', image: '', link: '', order: 0 }); setOpen(true); };
  const openEdit = (f) => { setEditing(f); setForm({ title: f.title || '', subtitle: f.subtitle || '', image: f.image || '', link: f.link || '', order: f.order || 0 }); setOpen(true); };

  const save = async () => {
    if (editing) await API.put(`/api/admin/banners/${editing.id}`, form);
    else await API.post('/api/admin/banners', form);
    setOpen(false); load();
  };

  const remove = async (id) => {
    if (!window.confirm('Xóa thật chứ?')) return;
    await API.delete(`/api/admin/banners/${id}`);
    load();
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Banners</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={openNew}>Add Banner</Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map(b => (
              <TableRow key={b.id}>
                <TableCell>{b.title}</TableCell>
                <TableCell>{b.image}</TableCell>
                <TableCell>{b.order}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEdit(b)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(b.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editing ? 'Edit Banner' : 'New Banner'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, width: 500 }}>
          <TextField label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <TextField label="Subtitle" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} />
          <TextField label="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          <TextField label="Link" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
          <TextField label="Order" type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}