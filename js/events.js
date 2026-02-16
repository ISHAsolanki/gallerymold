// Events loader shared by index.html and events.html
// Tries to find either #events-container or #exhibition-slider

function getEventsContainer() {
  return (
    document.getElementById('events-container') ||
    document.getElementById('exhibition-slider')
  );
}

function renderEventCard(data) {
  const card = document.createElement('div');
  card.className = 'event-card';
  card.innerHTML = `
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
  return card;
}

function loadEvents() {
  const container = getEventsContainer();
  if (!container) {
    console.log('Events container not found');
    return;
  }

  console.log('Loading events...');
  db.collection('exhibitions')
    .where('status', '==', 'active')
    .orderBy('order', 'asc')
    .get()
    .then((snapshot) => {
      container.innerHTML = '';

      if (snapshot.empty) {
        container.innerHTML = '<p style="text-align:center; padding: 40px;">No events available</p>';
        return;
      }

      snapshot.forEach((doc) => {
        const data = doc.data();
        container.appendChild(renderEventCard(data));
      });
    })
    .catch((error) => {
      console.error('Error loading events:', error);
      container.innerHTML = '<p style="text-align:center; padding: 40px;">Error loading events</p>';
    });
}

function filterEvents(category) {
  const container = getEventsContainer();
  if (!container) return;

  console.log('Filtering by:', category);
  let query = db.collection('exhibitions').where('status', '==', 'active');
  if (category && category !== 'all') {
    query = query.where('category', '==', category);
  }

  query
    .orderBy('order', 'asc')
    .get()
    .then((snapshot) => {
      container.innerHTML = '';
      if (snapshot.empty) {
        container.innerHTML = '<p style="text-align:center; padding: 40px;">No events in this category</p>';
        return;
      }
      snapshot.forEach((doc) => {
        container.appendChild(renderEventCard(doc.data()));
      });
    })
    .catch((error) => console.error('Filter error:', error));
}

// Auto-run on pages that include this script
document.addEventListener('DOMContentLoaded', function () {
  loadEvents();
  const filterButtons = document.querySelectorAll('[data-filter]');
  if (filterButtons.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const category = this.getAttribute('data-filter');
        filterButtons.forEach((b) => b.classList.remove('active'));
        this.classList.add('active');
        filterEvents(category);
      });
    });
  }
});
