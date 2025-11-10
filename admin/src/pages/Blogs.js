import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Switch, FormControlLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import API from '../api';

export default function Blogs() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', content: '', published: false });

  const load = async () => {
    const r = await API.get('/api/admin/blogs');
    setList(r.data || []);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: '', slug: '', content: '', published: false }); setOpen(true); };
  const openEdit = (b) => { setEditing(b); setForm({ title: b.title, slug: b.slug, content: b.content || '', published: b.published }); setOpen(true); };

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
              <TableCell>Published</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map(b => (
              <TableRow key={b.id || b._id}>
                <TableCell>{b.title}</TableCell>
                <TableCell>{b.slug}</TableCell>
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

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Blog' : 'New Blog'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} fullWidth />
          <TextField label="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
          <TextField label="Content" multiline rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} fullWidth />
          <FormControlLabel control={<Switch checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />} label="Published" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
