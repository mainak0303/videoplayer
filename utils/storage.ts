export interface Video {
    id: string;
    name: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileContent: string; 
    lastModified: number;
    size: number;
  }
  
  export const saveVideoInfo = async (file: File): Promise<Video> => {
    const videos = getVideos();
    const fileContent = await readFileAsBase64(file);
    
    const newVideo = {
      id: Date.now().toString(),
      name: file.name.replace(/\.[^/.]+$/, ""),
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileContent,
      lastModified: Date.now(),
      size: file.size
    };
    
    localStorage.setItem('videos', JSON.stringify([...videos, newVideo]));
    return newVideo;
  };
  
  export const getVideos = (): Video[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('videos') || '[]');
  };
  
  export const updateVideoName = (id: string, newName: string): void => {
    const videos = getVideos();
    const updated = videos.map(v => v.id === id ? { ...v, name: newName } : v);
    localStorage.setItem('videos', JSON.stringify(updated));
  };
  
  export const deleteVideo = (id: string): void => {
    const videos = getVideos().filter(v => v.id !== id);
    localStorage.setItem('videos', JSON.stringify(videos));
  };
  
  
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };