const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  
  function getDistanceTime(timePost) {
    const timeNow = new Date();
    const distance = timeNow - timePost; // milliseconds
  
    const seconds = Math.floor(distance / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 1) {
      return `${days} days ago`;
    } else if (days === 1) {
      return `1 day ago`;
    } else if (hours > 1) {
      return `${hours} hours ago`;
    } else if (hours === 1) {
      return `1 hour ago`;
    } else if (minutes > 1) {
      return `${minutes} minutes ago`;
    } else if (minutes === 1) {
      return `1 minute ago`;
    } else {
      return `${seconds} seconds ago`;
    }
  }
  
  function getFullTime(time) {
    const date = time.getDate();
    const monthIndex = time.getMonth();
    const year = time.getFullYear();
    let hours = time.getHours();
    let minutes = time.getMinutes();
  
    if (hours < 10) {
      hours = "0" + hours;
    }
  
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
  
    return `${date} ${months[monthIndex]} ${year} ${hours}:${minutes} WIB`;
  }
  
  // Array to store project data
  const projects = [];
  
  function addProject(event) {
    event.preventDefault();
  
    const projectName = document.getElementById("projectName").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const description = document.getElementById("description").value;
    
    const projectImage = document.getElementById("projectImage").files;
  
    const blobImage = projectImage.length > 0 ? URL.createObjectURL(projectImage[0]) : '';
    const checkboxes = document.querySelectorAll('input[name="technologies"]:checked');
    const selectedTechnologies = Array.from(checkboxes).map((checkbox) => checkbox.value);
    const data = {
      title: projectName,
      startDate,
      endDate,
      description,
      technologies: selectedTechnologies,
      image: blobImage,
      author: "Ikram",
      createdAt: new Date(),
    };
  
    projects.unshift(data);
  
    console.log(projects);
    renderProjects();
  }
  
  function renderProjects() {
    let html = "";
  
    for (let index = 0; index < projects.length; index++) {
      const techList = projects[index].technologies.map((tech) => `<span>${tech}</span>`).join(", ");
      
      html += `<div class="blog-list-item">
                  <div class="blog-image">
                      ${projects[index].image ? `<img src="${projects[index].image}" alt="Project Image" />` : ''}
                  </div>
                  <div class="blog-content">
                      <h1>
                          <a href="project-detail.html" target="_blank">${projects[index].title}</a>
                      </h1>
                       <div class="detail-blog-content">
                          <i class="fa-regular fa-clock"></i>${getFullTime(projects[index].createdAt)} | ${projects[index].author}
                      </div>
                      <p><i class="fa-regular fa-calendar-days"></i> ${projects[index].startDate}</p>
                      <p><i class="fa-regular fa-calendar-days"></i> ${projects[index].endDate}</p>
                      <p> ${techList}</p>
                      <p>${projects[index].description}</p>
                      <p>${getDistanceTime(projects[index].createdAt)}</p>
                       
                      <div class="btn-group">
                          <button class="btn-edit">Edit Project</button>
                          <button class="btn-post">Delete Project</button>
                      </div>
                  </div>
              </div>`;
    }
  
    document.getElementById("contents").innerHTML = html;
  }
  
  
  // Update project display every second
  setInterval(() => {
    renderProjects();
  }, 1000);
  