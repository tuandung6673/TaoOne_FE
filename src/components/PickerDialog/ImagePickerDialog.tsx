import { getDownloadURL, getMetadata, listAll, ref, uploadBytesResumable } from 'firebase/storage';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useCallback, useEffect, useState } from 'react';
import { useSpinner } from '../../custom-hook/SpinnerContext';
import { storage } from '../../firebase/firebaseConfig';
import './ImagePickerDialog.scss';

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

// Firebase Storage throttles/slows way down when hundreds of getDownloadURL +
// getMetadata calls fire at once — cap how many are in flight simultaneously
// so the dialog doesn't stutter while the folder listing loads.
const METADATA_FETCH_CONCURRENCY = 8;

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex++;
      results[currentIndex] = await mapper(items[currentIndex]);
    }
  });

  await Promise.all(workers);
  return results;
}

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
    year: 'numeric',
  });
};

const ImagePickerDialog: React.FC<ImagePickerDialogProps> = ({
  visible,
  onHide,
  onImageSelect,
  title = 'Chọn ảnh'
}) => {
  const { showSpinner, hideSpinner } = useSpinner();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we have valid cached images
      const now = Date.now();
      // cache already exist
      if (imageCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
        const sortedImages = sortImages(imageCache, sortBy);
        setImages(sortedImages);
        setLoading(false);
        return;
      }

      const folderRef = ref(storage, process.env.REACT_APP_FIREBASE_IMAGE_FILE);
      const result = await listAll(folderRef);

      // Fetching download URL + metadata for hundreds of files at once floods
      // Firebase Storage and stalls the main thread on the resulting burst of
      // setState/promise resolutions — cap concurrent requests instead.
      const imageItems = await mapWithConcurrency(
        result.items,
        METADATA_FETCH_CONCURRENCY,
        async (itemRef): Promise<ImageItem> => {
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
        }
      );

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

  const handleSortChange = useCallback((newSortBy: 'date' | 'name' | 'size') => {
    setSortBy(newSortBy);
    setImages((prev) => sortImages(prev, newSortBy));
  }, []);

  useEffect(() => {
    if (visible) {
      loadImages();
    }
  }, [visible, loadImages]);

  const handleImageClick = useCallback((imageUrl: string) => {
    onImageSelect(imageUrl);
    onHide();
  }, [onImageSelect, onHide]);

  const handleRefresh = useCallback(() => {
    // Clear cache and reload
    imageCache = [];
    cacheTimestamp = 0;
    loadImages();
  }, [loadImages]);

  // add new image
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      showSpinner();

      const storageRef = ref(storage, `${process.env.REACT_APP_FIREBASE_IMAGE_FILE}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
        },
        (error) => {
          hideSpinner();
        },
        async () => {
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          handleRefresh();
          hideSpinner();
        }
      );
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
      hideSpinner();
    }
  }, [showSpinner, hideSpinner, handleRefresh]);

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
          label=""
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
      <div style={{ width: '130px', marginRight: '10px' }}>
        <Button
          label="Thêm mới"
          icon="pi pi-plus"
          size="small"
          className="image-picker-add-new-btn"
          onClick={() => {
            fileInputRef.current?.click();
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
      draggable={false}
      footer={footer}
      style={{ width: '90vw', maxWidth: '1100px' }}
      modal
      className="image-picker-dialog"
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*"
      />
      {loading ? (
        <div className="image-picker-loading">
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
          <p>Đang tải ảnh...</p>
        </div>
      ) : error ? (
        <div className="image-picker-error">
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
        <div className="image-picker-grid">
          {images.map((image) => (
            <div
              key={image.url}
              className="image-picker-item"
              onClick={() => handleImageClick(image.url)}
            >
              <img src={image.url} alt={image.name} loading="lazy" decoding="async" />
              <div className="image-picker-item-info">
                <div className="image-picker-item-name">{image.name}</div>
                <div className="image-picker-item-meta">
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
