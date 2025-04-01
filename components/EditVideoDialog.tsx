import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { Video } from '../utils/storage';
import { useEffect, useState } from 'react';

export interface EditVideoDialogProps {
  video: Video | null;
  onClose: () => void;
  onSave: (newName: string) => void;
}

export const EditVideoDialog: React.FC<EditVideoDialogProps> = ({ video, onClose, onSave }) => {
  const [name, setName] = useState(video?.name || '');

  useEffect(() => {
    if (video) {
      setName(video.name);
    }
  }, [video]);

  return (
    <Dialog open={!!video} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Video Name</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Video Name"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(name)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};