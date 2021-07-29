// Menu open
function click() {
  var bOverlay = document.getElementById("b-overlay");
  bOverlay.classList.toggle("d-none");
  var hMenu = document.getElementById("h-menu");
  hMenu.classList.toggle("menuBarAddRemove");
}

// Body touch close
function BClick() {
  var bOverlay = document.getElementById("b-overlay");
  bOverlay.classList.toggle("d-none");
  var hMenu = document.getElementById("h-menu");
  hMenu.classList.toggle("menuBarAddRemove");
}

// Close btn touch close
function Bclose() {
  var BodyOverlay = document.getElementById("b-overlay");
  BodyOverlay.classList.toggle("d-none");
  var menuBar = document.getElementById("h-menu");
  menuBar.classList.toggle("menuBarAddRemove");
}

// addRemoveExWarranty

function addRemoveExWarranty() {
  var BOverlay = document.getElementById("ex-warr-b-overlay");
  BOverlay.classList.toggle("body-overlay");
  var extandedWarrantyOverlay = document.getElementById(
    "extended-warranty-overlay"
  );
  extandedWarrantyOverlay.classList.toggle("db-none");
}

// addRemoveAMC

function addRemoveAMC() {
  var B_Overlay = document.getElementById("AMC-b-overlay");
  B_Overlay.classList.toggle("body-overlay");
  var addAMC = document.getElementById("AMC-overlay");
  addAMC.classList.toggle("db-none");
}

// Take a picture page
function panelAddRemove() {
  var panelOverlay = document.getElementById("ex-warr-b-overlay");
  panelOverlay.classList.toggle("body-overlay");
  var panel = document.getElementById("takePicturePanel");
  panel.classList.toggle("panel");
}

// claimWarrantyPopup
function claimWarrantyPopup() {
  var B_OverlayClaimWarranty = document.getElementById("AMC-b-overlay");
  B_OverlayClaimWarranty.classList.toggle("body-overlay");
  var addclaimWarrantyPopup = document.getElementById("claimWarranty");
  addclaimWarrantyPopup.classList.toggle("claimWarrantyPopup");
}

// Home Carousel

// $("#homeCarousel.owl-carousel").owlCarousel({
//   loop: true,
//   margin: 10,
//   nav: false,
//   dots: false,
//   responsive: {
//     0: {
//       items: 1,
//     },
//     360: {
//       items: 1.6,
//     },
//   },
// });

$("#plansCarosel.owl-carousel").owlCarousel({
  stagePadding:40,
  loop: false,
  margin: 10,
  nav: false,
  dots: false,
  responsive: {
    0: {
      items: 1,
    },
  },
});

// subscribe carousel
$("#subscribeCarousel.owl-carousel").owlCarousel({
  stagePadding: 50,
  loop: false,
  margin: 10,
  nav: false,
  dots: false,
  responsive: {
    0: {
      items: 1,
    },
    360: {
      items: 1,
    },
  },
});

// ticket carousel
$("#ticketsCarousel.owl-carousel").owlCarousel({
  stagePadding: 40,
  margin: 15,
  center: true,
  loop: false,
  nav: false,
  dots: false,
  responsive: {
    0: {
      items: 1,
    },
    360: {
      items: 1,
    },
  },
});

// // products carousel
// $("#productsCarousel").owlCarousel({
//   margin: 15,
//   center: true,
//   loop: true,
//   nav: true,
//   navText: ["<img src='../images/leftCarousel.png'>", "<img src='../images/rightCarousel.png'>"],
//   dots: true,
//   responsive: {
//     0: {
//       items: 1,
//     },
//     360: {
//       items: 1,
//     },
//   },
// });


$('#productsCarousel').owlCarousel({
    loop:false,
    margin:0,
    dots:false,
    nav:true,
    navText: ["<img src='images/leftCarousel.png'>","<img src='images/rightCarousel.png'>"],
    items:1
})

// Notification Show Hide
function notificationShowHide() {
  var notificationShowHide = document.getElementById("notification");
  notificationShowHide.classList.toggle("notificationShowHide");
}

// Rating Show Hide
function ratingShowHide() {
  var ratingShowHide = document.getElementById("rating");
  ratingShowHide.classList.toggle("ratingShowHide");
}
