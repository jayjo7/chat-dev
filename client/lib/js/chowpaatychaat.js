
// an assumption is made here that the targeted div will have a static identifier, like class="navbar"
// this initializes the navbar on screen load with an appropriate class
if (window.innerWidth <= 767) {
	//  alert("mobile");
  $(".navbar").addClass("navbar-static-top");
} else {
  $(".navbar").addClass("navbar-default");
}

// if you want these classes to toggle when a desktop user shrinks the browser width to an xs width - or from xs to larger
$(window).resize(function() {
  if (window.innerWidth <= 767) {
    $(".navbar").removeClass("navbar-default");
    $(".navbar").addClass("navbar-static-top");
  } else {
    $(".navbar").removeClass("navbar-static-top");
    $(".navbar").addClass("navbar-default");
  }
});
