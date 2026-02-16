// Tab Switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Remove active from buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
    
    // Load data for that tab
    if (tabName === 'exhibitions') loadExhibitionsList();
    if (tabName === 'glimpse') loadGlimpseList();
    if (tabName === 'contacts') loadContactsList();
  }
  
  // ========== EXHIBITIONS ==========
  
  // Handle Exhibition Form Submit
  document.getElementById('exhibition-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const title = document.getElementById('ex-title').value;
    const subtitle = document.getElementById('ex-subtitle').value;
    const artist = document.getElementById('ex-artist').value;
    const description = document.getElementById('ex-description').value;
    const category = document.getElementById('ex-category').value;
    const order = parseInt(document.getElementById('ex-order').value);
    const status = document.getElementById('ex-status').value;
    const imageFile = document.getElementById('ex-image').files[0];
    
    if (!imageFile) {
      showMessage('exhibition-error', '❌ Please select an image');
      return;
    }
    
    try {
      // Show upload progress
      document.getElementById('ex-upload-progress').style.display = 'block';
      
      // Upload image to Cloudinary
      console.log('Uploading to Cloudinary...');
      const imageUrl = await uploadToCloudinaryWithProgress(imageFile, 'exhibitions', (progress) => {
        const progressFill = document.getElementById('ex-progress-fill');
        progressFill.style.width = progress + '%';
        progressFill.textContent = Math.round(progress) + '%';
      });
      
      console.log('Image uploaded:', imageUrl);
      
      // Add to Firestore
      await db.collection('exhibitions').add({
        title: title,
        subtitle: subtitle,
        artist: artist,
        description: description,
        category: category,
        order: order,
        status: status,
        imageUrl: imageUrl,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      showMessage('exhibition-success', '✅ Exhibition added successfully!');
      clearExhibitionForm();
      loadExhibitionsList();
      
    } catch (error) {
      console.error('Error:', error);
      showMessage('exhibition-error', '❌ Error: ' + error.message);
    }
    
    // Hide progress
    document.getElementById('ex-upload-progress').style.display = 'none';
  });
  
  // Load Exhibitions List
  function loadExhibitionsList() {
    db.collection('exhibitions')
      .orderBy('order', 'asc')
      .get()
      .then(snapshot => {
        const listContainer = document.getElementById('exhibitions-list');
        listContainer.innerHTML = '';
        
        if (snapshot.empty) {
          listContainer.innerHTML = `
            <div class="empty-state">
              <p>📭 No exhibitions yet</p>
              <p style="font-size: 14px; margin-top: 10px;">Add your first exhibition above!</p>
            </div>
          `;
          return;
        }
        
        snapshot.forEach(doc => {
          const data = doc.data();
          const card = document.createElement('div');
          card.className = 'item-card';
          card.innerHTML = `
            <div class="item-info">
              <h3>${data.title}</h3>
              <p><strong>Category:</strong> ${data.category} | <strong>Order:</strong> ${data.order} | <strong>Status:</strong> ${data.status}</p>
              ${data.artist ? `<p><strong>Artist:</strong> ${data.artist}</p>` : ''}
              ${data.imageUrl ? `<img src="${data.imageUrl}" class="item-thumbnail">` : ''}
            </div>
            <div class="item-actions">
              <button class="btn delete-btn" onclick="deleteExhibition('${doc.id}', '${data.title.replace(/'/g, "\\'")}')">🗑️ Delete</button>
            </div>
          `;
          listContainer.appendChild(card);
        });
      })
      .catch(error => {
        console.error('Error loading exhibitions:', error);
      });
  }
  
  // Delete Exhibition
  function deleteExhibition(id, title) {
    if (confirm(`Delete "${title}"?\n\nThis action cannot be undone.`)) {
      db.collection('exhibitions').doc(id).delete()
        .then(() => {
          showMessage('exhibition-success', '✅ Deleted successfully');
          loadExhibitionsList();
        })
        .catch(error => {
          showMessage('exhibition-error', '❌ Error deleting: ' + error.message);
        });
    }
  }
  
  // Clear Exhibition Form
  function clearExhibitionForm() {
    document.getElementById('exhibition-form').reset();
    document.getElementById('ex-image-preview').style.display = 'none';
    hideMessage('exhibition-success');
    hideMessage('exhibition-error');
  }
  
  // ========== GLIMPSE GALLERY ==========
  
  // Handle Glimpse Form Submit
  document.getElementById('glimpse-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const caption = document.getElementById('gl-caption').value;
    const order = parseInt(document.getElementById('gl-order').value);
    const imageFile = document.getElementById('gl-image').files[0];
    
    if (!imageFile) {
      showMessage('glimpse-error', '❌ Please select an image');
      return;
    }
    
    try {
      document.getElementById('gl-upload-progress').style.display = 'block';
      
      console.log('Uploading glimpse photo to Cloudinary...');
      const imageUrl = await uploadToCloudinaryWithProgress(imageFile, 'glimpse', (progress) => {
        const progressFill = document.getElementById('gl-progress-fill');
        progressFill.style.width = progress + '%';
        progressFill.textContent = Math.round(progress) + '%';
      });
      
      console.log('Photo uploaded:', imageUrl);
      
      await db.collection('glimpse').add({
        caption: caption,
        order: order,
        imageUrl: imageUrl,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      showMessage('glimpse-success', '✅ Photo added successfully!');
      clearGlimpseForm();
      loadGlimpseList();
      
    } catch (error) {
      console.error('Error:', error);
      showMessage('glimpse-error', '❌ Error: ' + error.message);
    }
    
    document.getElementById('gl-upload-progress').style.display = 'none';
  });
  
  // Load Glimpse List
  function loadGlimpseList() {
    db.collection('glimpse')
      .orderBy('order', 'asc')
      .get()
      .then(snapshot => {
        const listContainer = document.getElementById('glimpse-list');
        listContainer.innerHTML = '';
        
        if (snapshot.empty) {
          listContainer.innerHTML = `
            <div class="empty-state">
              <p>📭 No photos yet</p>
              <p style="font-size: 14px; margin-top: 10px;">Add your first glimpse photo above!</p>
            </div>
          `;
          return;
        }
        
        snapshot.forEach(doc => {
          const data = doc.data();
          const card = document.createElement('div');
          card.className = 'item-card';
          card.innerHTML = `
            <div class="item-info">
              <h3>${data.caption || 'No caption'}</h3>
              <p><strong>Order:</strong> ${data.order}</p>
              ${data.imageUrl ? `<img src="${data.imageUrl}" class="item-thumbnail">` : ''}
            </div>
            <div class="item-actions">
              <button class="btn delete-btn" onclick="deleteGlimpse('${doc.id}')">🗑️ Delete</button>
            </div>
          `;
          listContainer.appendChild(card);
        });
      })
      .catch(error => {
        console.error('Error loading glimpse:', error);
      });
  }
  
  // Delete Glimpse
  function deleteGlimpse(id) {
    if (confirm('Delete this photo?\n\nThis action cannot be undone.')) {
      db.collection('glimpse').doc(id).delete()
        .then(() => {
          showMessage('glimpse-success', '✅ Deleted successfully');
          loadGlimpseList();
        })
        .catch(error => {
          showMessage('glimpse-error', '❌ Error: ' + error.message);
        });
    }
  }
  
  // Clear Glimpse Form
  function clearGlimpseForm() {
    document.getElementById('glimpse-form').reset();
    document.getElementById('gl-image-preview').style.display = 'none';
    hideMessage('glimpse-success');
    hideMessage('glimpse-error');
  }
  
  // ========== CONTACTS ==========
  
  // Load Contacts List
  function loadContactsList() {
    db.collection('contacts')
      .orderBy('timestamp', 'desc')
      .get()
      .then(snapshot => {
        const listContainer = document.getElementById('contacts-list');
        listContainer.innerHTML = '';
        
        if (snapshot.empty) {
          listContainer.innerHTML = `
            <div class="empty-state">
              <p>📭 No contact messages yet</p>
            </div>
          `;
          return;
        }
        
        snapshot.forEach(doc => {
          const data = doc.data();
          const date = data.timestamp ? data.timestamp.toDate().toLocaleDateString() : 'N/A';
          const time = data.timestamp ? data.timestamp.toDate().toLocaleTimeString() : '';
          
          const card = document.createElement('div');
          card.className = 'item-card';
          card.innerHTML = `
            <div class="item-info" style="flex: 1;">
              <h3>${data.name}</h3>
              <p><strong>📧 Email:</strong> ${data.email}</p>
              <p><strong>📌 Subject:</strong> ${data.subject || 'N/A'}</p>
              <p><strong>💬 Message:</strong> ${data.message}</p>
              <p style="margin-top: 10px; color: #999; font-size: 13px;">📅 ${date} at ${time}</p>
            </div>
            <div class="item-actions">
              <button class="btn delete-btn" onclick="deleteContact('${doc.id}')">🗑️ Delete</button>
            </div>
          `;
          listContainer.appendChild(card);
        });
      })
      .catch(error => {
        console.error('Error loading contacts:', error);
      });
  }
  
  // Delete Contact
  function deleteContact(id) {
    if (confirm('Delete this message?')) {
      db.collection('contacts').doc(id).delete()
        .then(() => {
          loadContactsList();
        })
        .catch(error => {
          alert('Error deleting: ' + error.message);
        });
    }
  }
  
  // ========== HELPERS ==========
  
  // Show Success/Error Message
  function showMessage(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  }
  
  // Hide Message
  function hideMessage(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = 'none';
  }
  
  // Image Preview for Exhibition
  document.getElementById('ex-image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const preview = document.getElementById('ex-image-preview');
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Image Preview for Glimpse
  document.getElementById('gl-image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const preview = document.getElementById('gl-image-preview');
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Load data on page load
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel loaded');
    loadExhibitionsList();
  });