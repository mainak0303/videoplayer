import React, { useRef, useState, useEffect } from 'react';
import { Box, IconButton, Slider, Typography, Tooltip, CircularProgress } from '@mui/material';
import { PlayArrow, Pause, VolumeUp, VolumeOff, Fullscreen } from '@mui/icons-material';

interface VideoPlayerProps {
  src: string; 
  autoPlay?: boolean;
  onError?: (error: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  autoPlay = false,
  onError 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Handle video source changes
  useEffect(() => {
    if (videoRef.current) {
      setIsLoading(true);
      setHasError(false);
      videoRef.current.load();
    }
  }, [src]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error('Playback failed:', error);
          setHasError(true);
          if (onError) onError('Failed to play video');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (_: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setProgress(value);
    if (videoRef.current) {
      videoRef.current.currentTime = (value / 100) * duration;
    }
  };

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(value / 100);
    if (videoRef.current) {
      videoRef.current.volume = value / 100;
      setIsMuted(value === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && videoRef.current) {
      videoRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / duration) * 100;
      setProgress(currentProgress);
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError('Failed to load video');
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Autoplay failed:', error);
      });
    }
  };

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const timeString = date.toISOString().substr(11, 8);
    return timeString.startsWith('00:') ? timeString.substr(3) : timeString;
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', mx: 'auto' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          backgroundColor: 'black',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        {/* Loading indicator */}
        {isLoading && (
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
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 1
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}

        {/* Error message */}
        {hasError && (
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
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 1,
              color: 'white',
              textAlign: 'center',
              p: 2
            }}
          >
            <Typography variant="h6">
              Failed to load video. Please try another file.
            </Typography>
          </Box>
        )}

        <video
          ref={videoRef}
          src={src}
          autoPlay={autoPlay}
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
          onCanPlay={handleCanPlay}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            display: isLoading || hasError ? 'none' : 'block'
          }}
          playsInline
          muted={isMuted}
        />
        
        {/* Controls */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(0,0,0,0.7)',
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            zIndex: 2,
            opacity: isPlaying ? 0.9 : 1,
            transition: 'opacity 0.3s ease',
            '&:hover': {
              opacity: 1
            }
          }}
        >
          <Slider
            value={progress}
            onChange={handleProgressChange}
            sx={{
              color: 'primary.main',
              height: 4,
              '& .MuiSlider-thumb': {
                width: 8,
                height: 8,
                transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0px 0px 0px 8px rgba(255, 255, 255, 0.16)',
                },
                '&.Mui-active': {
                  width: 20,
                  height: 20,
                },
              },
            }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title={isPlaying ? 'Pause (k)' : 'Play (k)'}>
              <IconButton 
                onClick={togglePlay} 
                sx={{ color: 'white' }}
                size="small"
              >
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title={isMuted ? 'Unmute (m)' : 'Mute (m)'}>
              <IconButton 
                onClick={toggleMute} 
                sx={{ color: 'white' }}
                size="small"
              >
                {isMuted ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
            </Tooltip>
            
            <Slider
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              sx={{
                width: 100,
                color: 'white',
                '& .MuiSlider-track': {
                  border: 'none',
                },
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                  backgroundColor: '#fff',
                  '&:hover, &.Mui-focusVisible, &.Mui-active': {
                    boxShadow: 'none',
                  },
                },
              }}
            />
            
            <Typography variant="body2" sx={{ 
              color: 'white', 
              ml: 'auto',
              fontFamily: 'monospace'
            }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>
            
            <Tooltip title={isFullscreen ? 'Exit fullscreen (f)' : 'Fullscreen (f)'}>
              <IconButton 
                onClick={toggleFullscreen} 
                sx={{ color: 'white' }}
                size="small"
              >
                <Fullscreen />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};