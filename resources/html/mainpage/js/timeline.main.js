$(document).ready(function() {
  // define the class that vertial aligns stuff
  var objects = '.tab-img';
  // initial setup
  verticalAlign(objects);
  // register resize event listener
  $(window).resize(function() {
    verticalAlign(objects);
  });
});

var adaptation_list_tab = document.getElementById('adaptation-list-tab');
var adaptation_information_tab = document.getElementById('adaptation-information-tab');
var adaptation_list_OPEN = false;
var adaptation_information_OPEN = false;
adaptation_list_tab.style.cursor = 'pointer';
adaptation_information_tab.style.cursor = 'pointer';

adaptation_list_tab.onclick = function() {
  if(adaptation_list_OPEN) {
    closeAdaptationList();
  }
  else if(adaptation_information_OPEN) {
    closeAdaptationInformation();
    // add wait
    openAdaptationList();
  }
  else {
    openAdaptationList();
  }

};

adaptation_information_tab.onclick = function() {
  if(adaptation_information_OPEN) {
    closeAdaptationInformation();
  }
  else if(adaptation_list_OPEN) {
    if(SelectedAdaptation.Exists()) {
      closeAdaptationList();
      // add wait
      openAdaptationInformation();
    }
    else {
      alert("Select an adaptation to view its associated information");
    }
  }
  else {
    if(SelectedAdaptation.Exists()) {
      openAdaptationInformation();
    }
    else {
      alert("Select an adaptation to view its associated information");
    }
  }

};

function openAdaptationList() {
  document.getElementById("timeline-div").style.width = "calc(100vw - 290px)";
  document.getElementById("side-nav").style.width = "290px";
  adaptation_list_OPEN = true;
}

function closeAdaptationList() {
  document.getElementById("timeline-div").style.width = "calc(100vw - 40px)";
  document.getElementById("side-nav").style.width = "40px";
  adaptation_list_OPEN = false;
}

function openAdaptationInformation() {
  document.getElementById("timeline-div").style.width = "calc(100vw - 290px)";
  document.getElementById("side-nav").style.width = "290px";
  adaptation_information_OPEN = true;
}

function closeAdaptationInformation() {
  document.getElementById("timeline-div").style.width = "calc(100vw - 40px)";
  document.getElementById("side-nav").style.width = "40px";
  adaptation_information_OPEN = false;
}

function verticalAlign(selector) {
  $(selector).each(function(val) {
    var parent_height = $(this).parent().height();
    var dif = parent_height - $(this).height()
    // should only work if the parent is larger than the element
    var margin_top = dif > 0 ? dif/2 : 0;
    $(this).css("margin-top", margin_top + "px");
  });
}
