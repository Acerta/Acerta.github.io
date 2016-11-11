"use strict";

var myForm;

function validEmail(email) { // see:
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  email = 1 + re;
  // return re.test(email);
  return true;
}
// get all data in form and return object
function getFormData() {
  var elements = myForm.elements; // all form elements
  var fields = Object.keys(elements).map(function(k) {
    if (elements[k].name !== undefined) {
      return elements[k].name;
      // special case for Edge's html collection
    } else if (elements[k].length > 0) {
      return elements[k].item(0).name;
    }
  }).filter(function(item, pos, self) {
    return self.indexOf(item) == pos && item;
  });
  var data = {};
  fields.forEach(function(k) {
    data[k] = elements[k].value;
    if (elements[k].type === "checkbox") {
      data[k] = elements[k].checked;
      // special case for Edge's html collection
    } else if (elements[k].length) {
      for (var i = 0; i < elements[k].length; i++) {
        if (elements[k].item(i).checked) {
          data[k] = elements[k].item(i).value;
        }
      }
    }
  });
  console.log(data);
  return data;
}

function handleFormSubmit(event) { // handles form submit withtout any jquery
  event.preventDefault(); // we are submitting via xhr below
  var data = getFormData(); // get the values submitted in the form
  if (!validEmail(data.email)) { // if email is not valid show error
    document.getElementById('email-invalid').style.display = 'block';
    return false;
  } else {
    var url = event.target.action; //
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      console.log(xhr.status, xhr.statusText);
      console.log(xhr.responseText);
      // document.getElementById('gform').style.display = 'none'; // hide form
      // document.getElementById('thankyou_message').style.display = 'block';
      return;
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&');
    console.log(encoded);
    xhr.send(encoded);
  }
}

function loaded() {
  console.log('contact form submission handler loaded successfully');
  // bind to the submit event of our form
  myForm = document.getElementById('gform');
  myForm.addEventListener("submit", handleFormSubmit, false);
}

document.addEventListener('DOMContentLoaded', loaded, false);

// document.getElementById("myModal").addEventListener("show.bs.modal", function (event) {
//   console.log("working");
//   var button = event.relatedTarget;
//   var title = button.dataset.title;
//   var modal = this;
//   modal.getElementsByClassName('modal-title')[0].innerText = title;
// });

$('#myModal').on('show.bs.modal', function(event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var title = button.data('title'); // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this);
  modal.find('.modal-title').text(title);
});

$('#modalSubmit').on('click', function(e) {
  e.preventDefault();
  console.log("working");
  $.ajax({
    url: 'https://script.google.com/macros/s/AKfycbzgCP38t41IpaYC3bqET1QigLZy9nLJLFDqS2NZz2ReOWHtffk/exec',
    type: 'POST',
    datatype: 'xml',
    data: $('#modalForm').serialize(),
    success: function(data) {
      $('#myModal').find('.modal-title').text("yea");
    },
    error: function(data) {
      $('#myModal').find('.modal-title').text("naw");
    }
  });
});
