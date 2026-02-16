// // import { db } from "./firebase.js";
// // import {
// //   collection,
// //   getDocs
// // } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // // 1. Reference to Firestore collection
// // const galleryRef = collection(db, "gallery");

// // // 2. Fetch data
// // const snapshot = await getDocs(galleryRef);

// // // 3. Use data in HTML
// // snapshot.forEach((doc) => {
// //   const data = doc.data();

// //   console.log(data); // for testing

// //   // Example: inject into page
// //   document.querySelector("#gallery").innerHTML += `
// //     <img src="${data.imageUrl}" alt="${data.title}">
// //   `;
// // });




// // Load Exhibitions for Home Page Slider
// function loadHomeSlider() {
//   const sliderContainer = document.getElementById('exhibition-slider');
  
//   if (!sliderContainer) {
//     console.log("Slider container not found");
//     return;
//   }

//   console.log("Loading exhibitions for slider...");
  
//   // Get exhibitions from Firebase
//   db.collection('exhibitions').get()
//     .where('status', '==', 'active')
//     .orderBy('order', 'asc')
//     .get()
//     .then((querySnapshot) => {
      
//       sliderContainer.innerHTML = ''; 
      
//       if (querySnapshot.empty) {
//         console.log("No exhibitions found");
//         sliderContainer.innerHTML = '<p>No exhibitions available</p>';
//         return;
//       }

//       console.log(`Found ${querySnapshot.size} exhibitions`);
      
//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         console.log("Exhibition:", data.title);
        
//         // Create slide HTML
//         const slide = document.createElement('div');
//         slide.className = 'slider-item';
//         slide.innerHTML = `
//           <div class="exhibition-slide">
//             ${data.imageUrl ? `<img src="${data.imageUrl}" alt="${data.title}" class="slide-image">` : ''}
//             <div class="slide-content">
//               <h1>${data.title}</h1>
//               <p class="subtitle">${data.subtitle || ''}</p>
//               ${data.artist ? `<p class="artist">Fine Artist: ${data.artist}</p>` : ''}
//               <p class="description">${data.description || ''}</p>
//             </div>
//           </div>
//         `;
        
//         sliderContainer.appendChild(slide);
//       });
      
//       // Initialize your slider library here (if using one)
//       // Example: initializeSlider();
      
//     })
//     .catch((error) => {
//       console.error("Error loading exhibitions:", error);
//       sliderContainer.innerHTML = '<p>Error loading exhibitions</p>';
//     });
// }

// // Run when page loads
// document.addEventListener('DOMContentLoaded', function() {
//   console.log("Page loaded, loading slider...");
//   loadHomeSlider();
// });





import { db } from "./firebase.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



async function loadHomeSlider() 
  {
  const eventContainer = document.getElementById("events-container");
  if (!eventContainer) return;

  const q = query(
    collection(db, "events"),
    where("status", "==", "active")
  );

  const snapshot = await getDocs(q);

  eventContainer.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();

    eventContainer.innerHTML += `
      <div class="event-card">
        <img src="${data.imageUrl}" alt="${data.title}">
        <div class="overlay">
          <h2>${data.title}</h2>
          <a href="#">KNOW MORE</a>
        </div>
      </div>
    `;
  });
}

// document.addEventListener("DOMContentLoaded", () => {
//   console.log("Page loaded, loading slider...");
//   loadHomeSlider();
// });


console.log("Calling loadHomeSlider...");
loadHomeSlider();


 