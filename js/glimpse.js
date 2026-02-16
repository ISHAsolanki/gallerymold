// Load Glimpse Gallery Photos
function loadGlimpseGallery() {
    const galleryContainer = document.getElementById('glimpse-gallery');
    
    if (!galleryContainer) {
      console.log("Glimpse gallery container not found");
      return;
    }
  
    console.log("Loading glimpse gallery...");
    
    db.collection('glimpse')
      .orderBy('order', 'asc')
      .get()
      .then((querySnapshot) => {
        
        galleryContainer.innerHTML = '';
        
        if (querySnapshot.empty) {
          galleryContainer.innerHTML = '<p>No photos available</p>';
          return;
        }
  
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          const photoCard = document.createElement('div');
          photoCard.className = 'glimpse-photo';
          photoCard.innerHTML = `
            <img src="${data.imageUrl || 'https://via.placeholder.com/400'}" 
                 alt="${data.caption || 'Gallery photo'}"
                 loading="lazy">
            ${data.caption ? `<p class="caption">${data.caption}</p>` : ''}
          `;
          
          galleryContainer.appendChild(photoCard);
        });
        
        console.log(`Loaded ${querySnapshot.size} glimpse photos`);
        
      })
      .catch((error) => {
        console.error("Error loading glimpse gallery:", error);
        galleryContainer.innerHTML = '<p>Error loading gallery</p>';
      });
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    loadGlimpseGallery();
  });