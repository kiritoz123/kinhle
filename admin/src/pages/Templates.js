import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Switch, FormControlLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import API from '../api';

export default function Templates() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', occasion: '', content: '', price: 0, isTemplate: true });

  const load = async () => {
    const r = await API.get('/api/admin/prayers');
    setList((r.data || []).filter(p => p.isTemplate));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: '', occasion: '', content: '', price: 0, isTemplate: true }); setOpen(true); };
  const openEdit = (b) => { setEditing(b); setForm({ title: b.title, occasion: b.occasion || '', content: b.content || '', price: b.price || 0, isTemplate: !!b.isTemplate }); setOpen(true); };

  const save = async () => {
    if (editing) await API.put(`/api/admin/prayers/${editing.id}`, form);
    else await API.post('/api/admin/prayers', form);
    setOpen(false); load();
  };

  const remove = async (id) => {
    if (!window.confirm('Xóa thật chứ?')) return;
    await API.delete(`/api/admin/prayers/${id}`);
    load();
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Prayer Templates</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={openNew}>Add Template</Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Occasion</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map(b => (
              <TableRow key={b.id}>
                <TableCell>{b.title}</TableCell>
                <TableCell>{b.occasion}</TableCell>
                <TableCell>{b.price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEdit(b)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(b.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Template' : 'New Template'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} fullWidth />
          <TextField label="Occasion" value={form.occasion} onChange={e => setForm({ ...form, occasion: e.target.value })} />
          <TextField label="Price (coin)" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
          <TextField label="Content" multiline rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} fullWidth />
          <FormControlLabel control={<Switch checked={form.isTemplate} onChange={e => setForm({ ...form, isTemplate: e.target.checked })} />} label="Is Template" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}