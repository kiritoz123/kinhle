import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import API from '../api';

export default function Masters() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', experience: '', specialty: '', phone: '', bio: '', photo: '' });

  const load = async () => {
    const r = await API.get('/api/admin/masters');
    setList(r.data || []);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ name: '', experience: '', specialty: '', phone: '', bio: '', photo: '' }); setOpen(true); };
  const openEdit = (m) => { setEditing(m); setForm({ name: m.name, experience: m.experience, specialty: m.specialty, phone: m.phone, bio: m.bio, photo: m.photo }); setOpen(true); };

  const save = async () => {
    if (editing) await API.put(`/api/admin/masters/${editing.id}`, form);
    else await API.post('/api/admin/masters', form);
    setOpen(false); load();
  };

  const remove = async (id) => {
    if (!window.confirm('Xóa thật chứ?')) return;
    await API.delete(`/api/admin/masters/${id}`);
    load();
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Masters</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={openNew}>Add Master</Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Specialty</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map(m => (
              <TableRow key={m.id}>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.specialty}</TableCell>
                <TableCell>{m.phone}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEdit(m)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(m.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Master' : 'New Master'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} fullWidth />
          <TextField label="Experience" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
          <TextField label="Specialty" value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} />
          <TextField label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <TextField label="Photo URL" value={form.photo} onChange={e => setForm({ ...form, photo: e.target.value })} />
          <TextField label="Bio" multiline rows={4} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}