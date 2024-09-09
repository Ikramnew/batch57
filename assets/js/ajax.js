// Function to fetch data asynchronously using XMLHttpRequest and Promises
function getTestimonialData(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
  
      xhr.onerror = () => {
        reject("Network Error!");
      };
  
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(`Error: ${xhr.status}`);
        }
      };
  
      xhr.send();
    });
  }
  
  // Asynchronous function to get and display all testimonials
  async function allTestimonial() {
    try {
      const testimonials = await getTestimonialData(
        "https://api.npoint.io/418e771b33eefaf45a42"
      );
  
      const testimonialHTML = testimonials.map((testimonial) => {
        return `<div class="testimonial">
          <img src="${testimonial.image}" class="profile-testimonial" />
          <p class="quote">${testimonial.content}</p>
          <p class="author">- ${testimonial.author}</p>
        </div>`;
      });
  
      document.getElementById("testimonials").innerHTML = testimonialHTML.join("");
    } catch (error) {
      console.error("Failed to load testimonials:", error);
    }
  }
  
  // Asynchronous function to filter testimonials by rating
  async function filterTestimonial(rating) {
    try {
      const testimonials = await getTestimonialData(
        "https://api.npoint.io/418e771b33eefaf45a42"
      );
  
      const filteredTestimonials = testimonials.filter((testimonial) => {
        return testimonial.rating == rating;
      });
  
      const testimonialHTML = filteredTestimonials.map((testimonial) => {
        return `<div class="testimonial">
          <img src="${testimonial.image}" class="profile-testimonial" />
          <p class="quote">${testimonial.content}</p>
          <p class="author">- ${testimonial.author}</p>
        </div>`;
      });
  
      document.getElementById("testimonials").innerHTML = testimonialHTML.join("");
    } catch (error) {
      console.error("Failed to filter testimonials:", error);
    }
  }
  
  // Call to load all testimonials when the page loads
  allTestimonial();
  