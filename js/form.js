// document
//   .getElementById("galleryMoldForm")
//   .addEventListener("submit", async function (e) {
//     e.preventDefault();

//     const loader = document.getElementById("formLoader");
//     loader.style.display = "block";

//     // Get form values
//     let name = document.getElementById("name").value.trim();
//     let contactInfo = document.getElementById("contactInfo").value.trim();
//     let message = document.getElementById("message").value.trim();
//     // Get checkbox value
//     const subscribeCheckbox = document.querySelector(
//       '.checkbox-label input[type="checkbox"]'
//     );
//     const isSubscribed = subscribeCheckbox.checked ? "Yes" : "No";

//     // Validate contact
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const phoneRegex = /^(\+?\d{10,15})$/;
//     const isEmail = emailRegex.test(contactInfo);
//     const isPhone = phoneRegex.test(contactInfo);
//     let selectedDates = [];

//     // Initialize Flatpickr with multiple date selection
//     const datePicker = flatpickr("#datePicker", {
//       mode: "multiple",
//       dateFormat: "Y-m-d",
//       minDate: "today",
//       onChange: function (selectedDatesArray, dateStr, instance) {
//         selectedDates = selectedDatesArray;
//         displaySelectedDates();
//       },
//     });

//     function displaySelectedDates() {
//       const container = document.getElementById("selectedDates");
//       container.innerHTML = "";

//       selectedDates.forEach((date, index) => {
//         const badge = document.createElement("div");
//         badge.className = "date-badge";

//         const formattedDate = date.toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//           year: "numeric",
//         });

//         badge.innerHTML = `
//                     <span>${formattedDate}</span>
//                     <span class="remove-date" onclick="removeDate(${index})">×</span>
//                 `;

//         container.appendChild(badge);
//       });
//     }

//     function removeDate(index) {
//       selectedDates.splice(index, 1);
//       datePicker.setDate(selectedDates);
//       displaySelectedDates();
//     }

//     // Form submission handler
//     document
//       .getElementById("galleryMoldForm")
//       .addEventListener("submit", async function (e) {
//         e.preventDefault();

//         const loader = document.getElementById("formLoader");
//         loader.style.display = "block";

//         // Get form values
//         let name = document.getElementById("name").value.trim();
//         let contactInfo = document.getElementById("contactInfo").value.trim();
//         let message = document.getElementById("message").value.trim();

//         // Format selected dates
//         const formattedDates = selectedDates
//           .map((date) =>
//             date.toLocaleDateString("en-US", {
//               month: "short",
//               day: "numeric",
//               year: "numeric",
//             })
//           )
//           .join(", ");

//         // Get checkbox value
//         const subscribeCheckbox = document.getElementById("subscribeCheckbox");
//         const isSubscribed = subscribeCheckbox.checked ? "Yes" : "No";

//         // Validate contact
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         const phoneRegex = /^(\+?\d{10,15})$/;
//         const isEmail = emailRegex.test(contactInfo);
//         const isPhone = phoneRegex.test(contactInfo);

//         if (!isEmail && !isPhone) {
//           alert("Please enter a valid email or phone number.");
//           loader.style.display = "none";
//           return;
//         }

//         // Validate dates
//         if (selectedDates.length === 0) {
//           alert("Please select at least one date.");
//           loader.style.display = "none";
//           return;
//         }

//         // Prepare data
//         const data = {
//           emails: ["shilpa.designs@gmail.com"],
//           cc: ["thegallerymold@gmail.com"],
//           subject: "New Website Registration",
//           message: `<strong>Name</strong>: ${name}<br/>
//                           <strong>Contact</strong>: ${contactInfo}<br/>
//                           <strong>Selected Date(s)</strong>: ${formattedDates}<br/>
//                           <strong>Message</strong>: ${message || "N/A"}<br/>
//                           <strong>Subscribe to Gallery Mold</strong>: ${isSubscribed}`,
//         };

//         // Send request
//         try {
//           const response = await fetch(
//             "https://mailer-5x4h33dpla-uc.a.run.app/",
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(data),
//             }
//           );

//           const result = await response.text();

//           if (response.ok) {
//             document.getElementById("galleryMoldForm").reset();
//             selectedDates = [];
//             datePicker.clear();
//             displaySelectedDates();
//             window.open("thankyou.html");
//             setTimeout(() => {
//               window.location.reload();
//             }, 1000);
//           } else {
//             alert("Failed: " + result);
//           }
//         } catch (err) {
//           console.error("Error:", err);
//           alert("Something went wrong. Please try again later.");
//         } finally {
//           loader.style.display = "none";
//         }
//       });
//     if (!isEmail && !isPhone) {
//       alert("Please enter a valid email or phone number.");
//       loader.style.display = "none";
//       return;
//     }

//     // Prepare data
//     const data = {
//       emails: ["shilpa.designs@gmail.com"],
//       cc: ["thegallerymold@gmail.com"],
//       subject: "New Website Registration",
//       message: `<strong>Name</strong>: ${name}<br/>
//                   <strong>Contact</strong>: ${contactInfo}<br/>
//                   <strong>Message</strong>: ${message || "N/A"}<br/>
//                     <strong>Subscribe to Gallery Mold</strong>: ${isSubscribed}`,
//     };

//     // Send request
//     try {
//       const response = await fetch("https://mailer-5x4h33dpla-uc.a.run.app/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       const result = await response.text();

//       if (response.ok) {
//         document.getElementById("galleryMoldForm").reset();
//         window.open("thankyou.html");
//         setTimeout(() => {
//           window.location.reload();
//         }, 1000);
//       } else {
//         alert("Failed: " + result);
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       alert("Something went wrong. Please try again later.");
//     } finally {
//       loader.style.display = "none";
//     }
//   });










// Get the contact form element
const contactForm = document.getElementById('galleryMoldForm');

// Check if form exists on this page
if (contactForm) {
  
  // Listen for form submission
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page from refreshing
    
    console.log("Form submitted!"); // For testing
    
    // Get values from form inputs
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const selectedDates = document.getElementById('datePicker').value;
    const message = document.getElementById('message').value;
    const isSubscribed = document.getElementById('subscribeCheckbox').checked;

    console.log("Name:", name); // For testing
    console.log("Email:", email); // For testing
    
    // Save to Firebase Firestore
    db.collection('contacts').add({
        name: name,
        phone: phone,
        email: email,
        selectedDates: selectedDates,
        message: message,
        subscribed: isSubscribed,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'unread'
      })
      .then(() => {
      // Success!
      console.log("✅ Data saved to Firebase!");
      window.open("thankyou.html", "_blank");


    })
    .catch((error) => {
      // Error occurred
      console.error("❌ Error:", error);
      alert("❌ Sorry, there was an error. Please try again.");
    });
  });
}