import { getDownloadURL, getMetadata, listAll, ref } from 'firebase/storage';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useCallback, useEffect, useState } from 'react';
import { storage } from '../../firebase/firebaseConfig';
import classes from './ImagePickerDialog.module.scss';

interface ImagePickerDialogProps {
  visible: boolean;
  onHide: () => void;
  onImageSelect: (imageUrl: string) => void;
  title?: string;
}

interface ImageItem {
  url: string;
  name: string;
  lastModified: number;
  size: number;
}

// Cache for images to avoid repeated API calls
let imageCache: ImageItem[] = [];
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const ImagePickerDialog: React.FC<ImagePickerDialogProps> = ({
  visible,
  onHide,
  onImageSelect,
  title = 'Chọn ảnh'
}) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we have valid cached images
      const now = Date.now();
      if (imageCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
        const sortedImages = sortImages(imageCache, sortBy);
        setImages(sortedImages);
        setLoading(false);
        return;
      }

      const folderRef = ref(storage, "images");
      const result = await listAll(folderRef);
      
      // Get metadata for each file to get last modified date and size
      const imagePromises = result.items.map(async (itemRef) => {
        try {
          const [url, metadata] = await Promise.all([
            getDownloadURL(itemRef),
            getMetadata(itemRef)
          ]);
          
          return {
            url,
            name: itemRef.name,
            lastModified: metadata.timeCreated ? new Date(metadata.timeCreated).getTime() : Date.now(),
            size: metadata.size || 0
          };
        } catch (error) {
          console.error(`Error getting metadata for ${itemRef.name}:`, error);
          // Fallback: return basic info without metadata
          const url = await getDownloadURL(itemRef);
          return {
            url,
            name: itemRef.name,
            lastModified: Date.now(),
            size: 0
          };
        }
      });
      
      const imageItems = await Promise.all(imagePromises);
      
      // Update cache
      imageCache = imageItems;
      cacheTimestamp = now;
      
      // Sort and set images
      const sortedImages = sortImages(imageItems, sortBy);
      setImages(sortedImages);
    } catch (error) {
      console.error('Error loading images:', error);
      setError('Không thể tải ảnh. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  const sortImages = (imageList: ImageItem[], sortType: 'date' | 'name' | 'size'): ImageItem[] => {
    const sorted = [...imageList];
    
    switch (sortType) {
      case 'date':
        return sorted.sort((a, b) => b.lastModified - a.lastModified); // Newest first
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'size':
        return sorted.sort((a, b) => b.size - a.size); // Largest first
      default:
        return sorted;
    }
  };

  const handleSortChange = (newSortBy: 'date' | 'name' | 'size') => {
    setSortBy(newSortBy);
    const sortedImages = sortImages(images, newSortBy);
    setImages(sortedImages);
  };

  useEffect(() => {
    if (visible) {
      loadImages();
    }
  }, [visible, loadImages]);

  const handleImageClick = (imageUrl: string) => {
    onImageSelect(imageUrl);
    onHide();
  };

  const handleRefresh = () => {
    // Clear cache and reload
    imageCache = [];
    cacheTimestamp = 0;
    loadImages();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const footer = (
    <div className="flex justify-content-between align-items-center">
      <div className="flex align-items-center gap-2">
        <Button 
          label="Ngày" 
          icon="pi pi-calendar" 
          size="small"
          className={sortBy === 'date' ? 'p-button-primary' : 'p-button-outlined'}
          onClick={() => handleSortChange('date')}
        />
        <Button 
          label="Tên" 
          icon="pi pi-sort-alpha-down" 
          size="small"
          className={sortBy === 'name' ? 'p-button-primary' : 'p-button-outlined'}
          onClick={() => handleSortChange('name')}
        />
      </div>
      <div className="flex align-items-center gap-2">
        <Button 
          label="Làm mới" 
          icon="pi pi-refresh" 
          onClick={handleRefresh}
          className="p-button-outlined p-button-sm"
          disabled={loading}
        />
        <Button 
          label="Hủy" 
          icon="pi pi-times" 
          onClick={onHide} 
          className="p-button-text" 
        />
      </div>
    </div>
  );

  const header = (
    <div className="flex justify-content-between align-items-center w-full">
      <span>{title}</span>
      <div style={{ width: '130px' }}>
        <Button 
          label="Thêm mới" 
          icon="pi pi-plus" 
          size="small"
          className={classes['add-new-btn']}
          onClick={() => {
            // You can add your logic here for adding new images
            console.log('Thêm mới clicked');
            // For example, you could open a file upload dialog
            // or navigate to an upload page
          }}
        />
      </div>
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={header}
      footer={footer}
      style={{ width: '90vw', maxWidth: '1000px' }}
      modal
      className={classes.imagePickerDialog}
    >
      {loading ? (
        <div className={classes.loading}>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
          <p>Đang tải ảnh...</p>
        </div>
      ) : error ? (
        <div className={classes.error}>
          <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem', color: '#f44336' }}></i>
          <p>{error}</p>
          <Button 
            label="Thử lại" 
            icon="pi pi-refresh" 
            onClick={loadImages}
            className="p-button-outlined"
          />
        </div>
      ) : (
        <div className={classes.imageGrid}>
          {images.map((image, index) => (
            <div
              key={index}
              className={classes.imageItem}
              onClick={() => handleImageClick(image.url)}
            >
              <img src={image.url} alt={image.name} />
              <div className={classes.imageInfo}>
                <div className={classes.imageName}>{image.name}</div>
                <div className={classes.imageMeta}>
                  <span>{formatFileSize(image.size)}</span>
                  <span>{formatDate(image.lastModified)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Dialog>
  );
};

export default ImagePickerDialog;
