import { useRouter } from 'next/router';
import { Container, Box, Typography } from '@mui/material';
import { VideoPlayer } from '../../components/VideoPlayer';
import { getVideos } from '../../utils/storage';

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query;
  const videos = getVideos();
  const video = videos.find(v => v.id === id);

  if (!video) {
    return (
      <Container>
        <Typography>Video not found</Typography>
      </Container>
    );
  }

  // Convert base64 back to playable URL
  const videoUrl = video.fileContent;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <VideoPlayer src={videoUrl} autoPlay />
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {video.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Uploaded on {new Date(video.lastModified).toLocaleDateString()}
        </Typography>
      </Box>
    </Container>
  );
}