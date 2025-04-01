import { useCallback, useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { saveVideoInfo } from '../utils/storage';

const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

export default function FileUpload({ onUpload }: { onUpload: () => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    try {
      setError('');
      
      if (!validVideoTypes.includes(file.type)) {
        throw new Error('Only video files are allowed (MP4, WebM, OGG)');
      }
  
      await saveVideoInfo(file);
      onUpload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Paper
        variant="outlined"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          p: 4,
          border: dragActive ? '2px dashed #1976d2' : '2px dashed #e0e0e0',
          backgroundColor: dragActive ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
          textAlign: 'center',
          cursor: 'pointer'
        }}
      >
        <input
          type="file"
          id="video-upload"
          accept="video/*"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="video-upload">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CloudUploadIcon sx={{ fontSize: 60, color: dragActive ? '#1976d2' : '#9e9e9e', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {dragActive ? 'Drop your video here' : 'Drag & drop your video here'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              or click to browse files
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supported formats: MP4, WebM, OGG
            </Typography>
          </Box>
        </label>
      </Paper>
      {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}