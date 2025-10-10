document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a[data-section]");
  const header = document.querySelector("header");

  links.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const sectionId = link.getAttribute("data-section");
      const section = document.getElementById(sectionId);

      const headerHeight = header.offsetHeight;
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      const offset = (viewportHeight - sectionHeight) / 3;
      const topPosition = section.getBoundingClientRect().top + window.scrollY - headerHeight - offset;

      window.scrollTo({
        top: topPosition,
        behavior: "smooth"
      });
    });
  });

  const footer = document.getElementById("footerPopup");
  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
      footer.style.bottom = "0";
    } else {
      footer.style.bottom = "-100px";
    }
  });

  //header
  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }
    lastScrollY = window.scrollY;
  });


  //header
  document.addEventListener("mousemove", (e) => {
    if (e.clientY <= 50) { 
      header.style.transform = "translateY(0)";
    }
  });
});

