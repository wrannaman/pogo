// on ready, hide the form and get events
$(document).ready(function() {
  var events = [];
  var index;
  var theForm = document.getElementById( 'theForm' );
  $('#formSection').hide();
  $('.final-button').hide();
  $.ajax({
    url: "https://api.pogoseat.com/v0/venue/by-alias/giants/events/upcoming",
    statusCode: {
      404: function() {
        console.log('error 404');
      }
    }
  })
  .done(function( data ) {
    console.log( "data:", data);
    events = data;
    localStorage.setItem('events', JSON.stringify(data));
    setEvents(data);
  });
}); // on ready end


// click handler for button
function buttonLoader(e) {
  //console.log('clicked');
  e.preventDefault();
  e.stopPropagation();
  e.target.classList.add('loading');
  e.target.setAttribute('disabled','disabled');

      $('button').css('background-color', 'transparent');
      var events = JSON.parse(localStorage.getItem('events'));
      var event = events[window.eventDataIndex];
      $('#event-info').text("You selected: "
          + event.event_title
          + " ("
          + event.location_name
          + ")");

  setTimeout(function(){
    $('#gridSectionH2').hide(300, function() {
      $('#gridSection').hide(300, function() {
        $('#formSection').show(300);
      }); // end hide grid section
    }); // end hide grid section h2




        e.target.classList.remove('loading');
        e.target.removeAttribute('disabled');

        $('button').css('background-color', 'transparent');

        window.eventDataIndex = $(e.target)[0].closest('li').id || null;

    // index of selected element from data array.
    window.eventDataIndex = $(e.target)[0].closest('li').id || null;


          $('button').css('background-color', 'transparent');
          var events = JSON.parse(localStorage.getItem('events'));
          var event = events[window.eventDataIndex];
          $('#event-info').text("You selected: "
              + event.event_title
              + " ("
              + event.location_name
              + ")");



      },1500);
    }; // end of click event function


// create nodes for each event.
function setEvents(data) {
  console.log(data.length);
  for (var i=0; i<data.length; i++) {
    if (!data[i].color_pallet.c1) {
      data[i].color_pallet.c1 = 'rgb(247, 124, 51)';
    }

    //create list element, append to grid container
    $( "<li id='" + i + "'>" ).appendTo($('.cbp-ig-grid'));
    // create element, append inside list element
    $("<a href='#doNothing' id='#a'"+i+" style='color:'" + data[i].color_pallet.c1 +"'>").appendTo($('#' + i));
    $('li').on('click', '#doNothing', function(e) {
      e.preventDefault();
      return false;
    })

    if (data[i].away_team_logo) {
      $("<img src=https://cdn.pogoseat.com" + data[i].away_team_logo + ">").appendTo($('#a' + i));
    } else {
      $("<img src=https://cdn.pogoseat.com" + data[i].home_team_logo + ">").appendTo($('#a' + i));
    }

    $("<h3 class='cbp-ig-title changeColor'>" + data[i].event_title + "</h3>").appendTo($('#a' + i));
    $("<p>" + data[i].timeTillLive + " @ " + data[i].location_name+ "</p>").appendTo($('#a' + i));
    $("<span class='cbp-ig-category'> </span>").appendTo($('#a' + i));

    $("<button label='Select' style='color:white;background-color:" + data[i].color_pallet.c1 +"'> Select </button>").appendTo($('#a' + i));
    $('a').on('click', 'button', buttonLoader);

    $('.cbp-ig-title:before').css('background', data[i].color_pallet.c1);

    $("a").hover(function(){
      $('h3').css("color", data[0].color_pallet.c1);
      $('p').css("color", data[0].color_pallet.c1);
    })

  } // end loop

  // $("a").click(function(event){
  //   event.preventDefault();
  //   $('div').removeClass('checkmark');
  //   // index from our data array!
  //   var dataElement = $(this).parent().attr('id');
  // });


}



// for form
new stepsForm( theForm, {
  onSubmit : function( form ) {
    // hide form
    $('.simform-inner').hide();
    //classie.addClass( theForm.querySelector( '.simform-inner' ), 'hide' );
    var events = JSON.parse(localStorage.getItem('events'));
    var event_id = events[window.eventDataIndex].event_id;
    var name = $('#q1').val();
    var email = $('#q3').val();
    var phone = $('#q2').val();
    if (!email) {

      email = " ";
    }
    if (!phone) {
      phone = " ";
    }
    var data = {
      event_id: event_id,
      name: name,
      email: email || " ",
      phone: phone || " "
    }

    // Make POST request
    var url = 'https://join.pogoseat.com/frontend/submission';
    $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: success,
      error: error
    });
    function error(d) {
      alert('error callback');
      $( '.final-message' ).HTML = 'Uh oh, there was an error, please fill out the form again.';
      messageEl.innerHTML =
      classie.addClass( messageEl, 'show' );
    }

    // success callback
    function success(d) {
      alert('success callback');
      var messageEl = theForm.querySelector( '.final-message' );

      if (d.type == 'success' || d.status == 'success') {
        messageEl.innerHTML = 'You will start receiving updates immediately!';
      } else {
        messageEl.innerHTML = 'Uh oh, there was an error, please fill out the form again.';
      }

      classie.addClass( messageEl, 'show' );

      setTimeout(function() {
        location.reload();
      },3000);
    }
  }
});
