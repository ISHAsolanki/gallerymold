// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
  cloudName: 'dyidbgn10',      // Replace with your cloud name
  uploadPreset: 'gallery_mold_uploads', // From Step 4
  apiKey: '35779961567274'            // From Step 3 (optional for unsigned uploads)
};

// Helper function to upload image to Cloudinary
async function uploadToCloudinary(file, folder = 'exhibitions') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', folder);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    return data.secure_url; // Returns the image URL
    
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

// Helper: Upload with progress tracking
function uploadToCloudinaryWithProgress(file, folder, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', folder);
    
    const xhr = new XMLHttpRequest();
    
    // Progress tracking
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        if (onProgress) onProgress(percentComplete);
      }
    });
    
    // Success
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.secure_url);
      } else {
        reject(new Error('Upload failed'));
      }
    });
    
    // Error
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });
    
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`);
    xhr.send(formData);
  });
}

console.log('✅ Cloudinary config loaded');