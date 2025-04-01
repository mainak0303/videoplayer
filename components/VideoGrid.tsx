import { Grid, Card, CardMedia, CardContent, Typography, IconButton, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Video } from '../utils/storage';
import { useState } from 'react';
import { EditVideoDialog } from './EditVideoDialog';

interface VideoGridProps
{
    videos: Video[];
    onEdit: ( id: string, newName: string ) => void;
    onDelete: ( id: string ) => void;
    onPlay: ( id: string ) => void;
}


export const VideoGrid: React.FC<VideoGridProps> = ( { videos, onEdit, onDelete, onPlay } ) =>
{
    const [ editingVideo, setEditingVideo ] = useState<Video | null>( null );

    return (
        <>
            <Grid container spacing={ 3 }>
                { videos.map( video => (
                    <Grid item xs={ 12 } sm={ 6 } md={ 4 } lg={ 3 } key={ video.id }>
                        <Card sx={ { height: '100%', display: 'flex', flexDirection: 'column' } }>
                            <Box sx={ { position: 'relative' } }>
                                <CardMedia
                                    component="div"
                                    sx={ {
                                        pt: '56.25%',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        backgroundColor: 'rgba(0,0,0,0.1)',
                                        backgroundSize: 'cover'
                                    } }
                                    onClick={ () => onPlay( video.id ) }
                                >
                                    <Box
                                        sx={ {
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
                                                backgroundColor: 'rgba(0,0,0,0.3)'
                                            }
                                        } }
                                    >
                                        <PlayArrowIcon sx={ { fontSize: 60, color: 'white' } } />
                                    </Box>
                                </CardMedia>
                            </Box>
                            <CardContent sx={ { flexGrow: 1 } }>
                                <Typography gutterBottom variant="h6" component="h3" noWrap>
                                    { video.name }
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    { video.fileType ? video.fileType.split( '/' )[ 1 ].toUpperCase() : 'Unknown' } • { new Date( video.lastModified ).toLocaleDateString() }
                                </Typography>

                            </CardContent>
                            <Box sx={ { display: 'flex', justifyContent: 'flex-end', p: 1 } }>
                                <IconButton onClick={ () => setEditingVideo( video ) }>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={ () => onDelete( video.id ) }>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ) ) }
            </Grid>

            <EditVideoDialog
                video={ editingVideo }
                onClose={ () => setEditingVideo( null ) }
                onSave={ ( newName ) =>
                {
                    if ( editingVideo )
                    {
                        onEdit( editingVideo.id, newName );
                        setEditingVideo( null );
                    }
                } }
            />
        </>
    );
};