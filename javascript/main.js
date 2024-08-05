document.addEventListener("DOMContentLoaded", function() {
  var popup = document.getElementById("popup");
  var popupButton = document.getElementById("popupButton");
  var closeButton = document.querySelector(".close-button");

  popupButton.addEventListener("click", function() {
    popup.style.display = "flex";
  });

  closeButton.addEventListener("click", function() {
    popup.style.display = "none";
  });

  window.addEventListener("click", function(event) {
    if (event.target === popup) {
      popup.style.display = "none";
    }
  });
});
