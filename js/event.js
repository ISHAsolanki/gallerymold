// Load all events/exhibitions for gallery page
function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    
    if (!eventsContainer) {
      console.log("Events container not found");
      return;
    }
  
    console.log("Loading events...");
    
    db.collection('exhibitions')
      .where('status', '==', 'active')
      .orderBy('order', 'asc')
      .get()
      .then((querySnapshot) => {
        
        eventsContainer.innerHTML = '';
        
        if (querySnapshot.empty) {
          eventsContainer.innerHTML = '<p style="text-align:center;">No events available</p>';
          return;
        }
  
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Create event card
          const eventCard = document.createElement('div');
          eventCard.className = 'event-card';
          eventCard.innerHTML = `
            <div class="event-image">
              <img src="${data.imageUrl || 'https://via.placeholder.com/400x300'}" alt="${data.title}">
            </div>
            <div class="event-info">
              <h3>${data.title}</h3>
              <p class="category">${data.category || 'Exhibition'}</p>
              ${data.artist ? `<p class="artist">${data.artist}</p>` : ''}
              ${data.subtitle ? `<p class="subtitle">${data.subtitle}</p>` : ''}
            </div>
          `;
          
          eventsContainer.appendChild(eventCard);
        });
        
      })
      .catch((error) => {
        console.error("Error loading events:", error);
        eventsContainer.innerHTML = '<p>Error loading events</p>';
      });
  }
  
  // Filter events by category
  function filterEvents(category) {
    const eventsContainer = document.getElementById('events-container');
    
    console.log("Filtering by:", category);
    
    let query = db.collection('exhibitions').where('status', '==', 'active');
    
    // Add category filter if not "all"
    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }
    
    query.orderBy('order', 'asc')
      .get()
      .then((querySnapshot) => {
        eventsContainer.innerHTML = '';
        
        if (querySnapshot.empty) {
          eventsContainer.innerHTML = '<p style="text-align:center;">No events in this category</p>';
          return;
        }
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          const eventCard = document.createElement('div');
          eventCard.className = 'event-card';
          eventCard.innerHTML = `
            <div class="event-image">
              <img src="${data.imageUrl || 'https://via.placeholder.com/400x300'}" alt="${data.title}">
            </div>
            <div class="event-info">
              <h3>${data.title}</h3>
              <p class="category">${data.category || 'Exhibition'}</p>
              ${data.artist ? `<p class="artist">${data.artist}</p>` : ''}
            </div>
          `;
          
          eventsContainer.appendChild(eventCard);
        });
      })
      .catch((error) => {
        console.error("Filter error:", error);
      });
  }
  
  // Run when page loads
  document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    
    // Add event listeners to filter buttons
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const category = this.getAttribute('data-filter');
        filterEvents(category);
        
        // Update active button styling
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
      });
    });
  });