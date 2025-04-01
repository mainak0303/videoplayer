import { Box, Card, CardMedia, CardContent, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Video } from '../utils/storage';
import { useState } from 'react';
import { EditVideoDialog } from './EditVideoDialog';

interface VideoListProps {
  videos: Video[];
  onEdit: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onPlay: (id: string) => void;
}

export const VideoList: React.FC<VideoListProps> = ({ videos, onEdit, onDelete, onPlay }) => {
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <>
      <Box>
        {videos.map((video) => (
          <Card sx={{ display: 'flex', marginBottom: 2 }} key={video.id}>
            <Box sx={{ position: 'relative', width: '120px', height: '90px' }}>
              <CardMedia
                component="div"
                sx={{
                  pt: '56.25%',
                  cursor: 'pointer',
                  position: 'relative',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  backgroundSize: 'cover',
                }}
                onClick={() => onPlay(video.id)}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  <Typography sx={{ fontSize: '40px', color: 'white' }}>▶️</Typography>
                </Box>
              </CardMedia>
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="h3" noWrap>
                {video.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {video.fileType ? video.fileType.split('/')[1].toUpperCase() : 'Unknown'} • {formatDate(video.lastModified)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatSize(video.size)}
              </Typography>
            </CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', p: 1 }}>
              <IconButton onClick={() => setEditingVideo(video)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete(video.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Box>

      <EditVideoDialog
        video={editingVideo}
        onClose={() => setEditingVideo(null)}
        onSave={(newName) => {
          if (editingVideo) {
            onEdit(editingVideo.id, newName);
            setEditingVideo(null);
          }
        }}
      />
    </>
  );
};
