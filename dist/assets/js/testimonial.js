const testimonials = [
    {
      image:"",
        
      content: "Kerja Bagus",
      author: "Gojo Satoru",
      rating: 1,
    },
    {
      image:
        "",
      content: "Mantap sekali!",
      author: "Fushugiro",
      rating: 2,
    },
    {
      image:
        "",
      content: "Rasaenggan sekali!",
      author: "Naruto",
      rating: 3,
    },
    {
      image:
        "",
      content: "Chidori sekali!",
      author: "Sasuke",
      rating: 4,
    },
    {
      image:
        "",
      content: "Chidori sekali!",
      author: "Ikram",
      rating: 5,
    },
  ];
  
  function allTestimonial() {
    const testimonialHTML = testimonials.map((testimonial) => {
      return `<div class="testimonial">
                  <img
                    src="${testimonial.image}"
                    class="profile-testimonial"
                  />
                  <p class="quote">${testimonial.content}</p>
                  <p class="author">- ${testimonial.author}</p>
                </div>`;
    });
  
    document.getElementById("testimonials").innerHTML = testimonialHTML.join(" ");
  }

//   filter
function filterTestimonial(rating) {
    const filteredTestimonialByRating = testimonials.filter((testimonial) => {
      return testimonial.rating == rating;
    });
  
    const testimonialHTML = filteredTestimonialByRating.map((testimonial) => {
      return `<div class="testimonial">
                      <img
                        src="${testimonial.image}"
                        class="profile-testimonial"
                      />
                      <p class="quote">${testimonial.content}</p>
                      <p class="author">- ${testimonial.author}</p>
                    </div>`;
    });
  
    document.getElementById("testimonials").innerHTML = testimonialHTML.join(" ");
  }
  

  allTestimonial();