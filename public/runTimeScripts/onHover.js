let clip1 = document.querySelector(".vid1");


clip1.addEventListener("mouseover", function (e) {
    clip1.play();
 })
 /* Applying the mouse out event to pause the video */
 clip1.addEventListener("mouseout", function (e) {
    clip1.currentTime = 0;
    clip1.pause();
    
 })