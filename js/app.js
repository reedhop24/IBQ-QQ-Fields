$('Document').ready(function() {
  var disallowed = {};

  $('#select1').on('change', function() {
    if($('#select1').val() == "Yes") {
      $('#incident-type-field').css("visibility", "visible");

      $('#select2').on('change', function() {
        $('#select3').empty();
        var incidentType = $('#select2').val();
        $.ajax({
          url: 'https://test.ibqagents.com/ACME:webrate/Auto/IncidentsLookup/' + incidentType + '.json',
          type: 'GET',
          contentType: 'application/json;charset=utf-8',
          error: function(err) {
            console.log(err);
          }
        })
        .then(function(response) {
          $('#incident-desc-field').css("visibility", "visible");
          for(var i = 0; i < response['Result'].length; i++) {
            $('#select3').append("<option value=" + response['Result'][i]['Incidents_id'] + ">" + response['Result'][i]['_Display'] + "</option>");
            if(response['Result'][i]['_Disallowed'] == "Yes") {
              disallowed[response['Result'][i]['Incidents_id']] = response['Result'][i]['_Display'];
            }
          }
        });
      });
    
      $('#select3').on('change', function() {
        var incidentDesc = $('#select3').val();
        if(disallowed.hasOwnProperty(incidentDesc)) {
          $.modal.defaults = {
            closeExisting: true,    // Close existing modals. Set this to false if you need to stack multiple modal instances.
            escapeClose: false,      // Allows the user to close the modal by pressing `ESC`
            clickClose: false,       // Allows the user to close the modal by clicking the overlay
            closeClass: 'modal-button'
          };
          $('#auto-modal-driver').modal();
          $('#incident-desc-list').empty();
          $('#incident-desc-list').append("<li>" + disallowed[incidentDesc] + "</li>");
          $('#select3').val('');
        }
      });
      
    }

  });

});