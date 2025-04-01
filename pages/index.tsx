import { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { ViewToggle } from '../components/ViewToggle';
import { VideoList } from '../components/VideoList';
import { VideoGrid } from '../components/VideoGrid';
import FileUpload from '../components/FileUpload';
import { getVideos, updateVideoName, deleteVideo, Video } from '../utils/storage';

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setVideos(getVideos());
  }, [refresh]);

  const handleUpload = () => {
    setRefresh(!refresh);
  };

  const handleEdit = (id: string, newName: string) => {
    updateVideoName(id, newName);
    setRefresh(!refresh);
  };

  const handleDelete = (id: string) => {
    deleteVideo(id);
    setRefresh(!refresh);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Video Library
      </Typography>
      
      <FileUpload onUpload={handleUpload} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Your Videos ({videos.length})
        </Typography>
        <ViewToggle view={view} onChange={setView} />
      </Box>
      
      {view === 'list' ? (
        <VideoList
          videos={videos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPlay={(id) => window.location.href = `/watch/${id}`}
        />
      ) : (
        <VideoGrid
          videos={videos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPlay={(id) => window.location.href = `/watch/${id}`}
        />
      )}
    </Container>
  );
}