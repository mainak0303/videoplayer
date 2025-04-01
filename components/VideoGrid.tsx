import { Card, CardMedia, CardContent, Typography, IconButton, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Video } from '../utils/storage';
import { useState } from 'react';
import { EditVideoDialog } from './EditVideoDialog';

interface VideoGridProps {
    videos: Video[];
    onEdit: (id: string, newName: string) => void;
    onDelete: (id: string) => void;
    onPlay: (id: string) => void;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ videos, onEdit, onDelete, onPlay }) => {
    const [editingVideo, setEditingVideo] = useState<Video | null>(null);

    return (
        <>
            <Box 
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 2,
                    padding: 2
                }}
            >
                {videos.map(video => (
                    <Card 
                        key={video.id} 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            height: 'auto', 
                            maxWidth: 200 
                        }}
                    >
                        <Box sx={{ position: 'relative' }}>
                            <CardMedia
                                component="div"
                                sx={{
                                    pt: '100%', // Square aspect ratio
                                    cursor: 'pointer',
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
                                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.3)' },
                                    }}
                                >
                                    <PlayArrowIcon sx={{ fontSize: 40, color: 'white' }} />
                                </Box>
                            </CardMedia>
                        </Box>
                        <CardContent sx={{ flexGrow: 1, padding: 1 }}>
                            <Typography variant="body2" noWrap sx={{ fontWeight: 'bold' }}>
                                {video.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {video.fileType ? video.fileType.split('/')[1].toUpperCase() : 'Unknown'}
                            </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                            <IconButton onClick={() => setEditingVideo(video)} size="small">
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => onDelete(video.id)} size="small">
                                <DeleteIcon fontSize="small" />
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
