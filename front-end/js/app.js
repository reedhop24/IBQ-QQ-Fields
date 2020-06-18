$('Document').ready(function() {

  function RenderDriver(arr) {
    this.fields = arr[0]['Fields'];
    this.currUser;
    this.allMembers = [];
    this.rules = {};
    this.getHTML = () => {
        for(const x in this.fields) {
            if(this.setFields(this.fields[x])){
              $('#vehicle-form').append(this.setFields(this.fields[x]));
            }
        }
    };

    this.validateRules = (rule, ruleArr, targVal) => {
        $.modal.defaults = {
            closeExisting: true,    // Close existing modals. Set this to false if you need to stack multiple modal instances.
            escapeClose: false,      // Allows the user to close the modal by pressing `ESC`
            clickClose: false,       // Allows the user to close the modal by clicking the overlay
            closeClass: 'modal-button'
        };
        if(ruleArr.length > 0) {
            for(var j = 0; j < ruleArr.length; j++) {
                if(ruleArr[j] == 'REQUIRED') {
                if(targVal === '') {
                    $('#data-validation').modal();
                    $('#modal-content').empty().append(`<p>Required field: ${rule.replace(/_/g, ' ')}`);
                    $('#modal-button').on('click', function() {
                    $(`#${rule}`).focus();
                    });
                }
                } else if(ruleArr[j].startsWith('VALID')) {
                    var regExp = ruleArr[j].split("'");
                    var reg = new RegExp(regExp[1], 'g');
                    if(!targVal.match(reg)) {
                        var toDisplay = '';
                        for(var i = 0; i < regExp.length; i++) {
                            if(regExp[i].includes('INVALID')) {
                                toDisplay = regExp[i+1];
                            }
                        }
                        $('#data-validation').modal();
                        $('#modal-content').empty().append(`<p>Invalid Entry: ${toDisplay}`);
                        $('#modal-button').on('click', function() {
                            $(`#${rule}`).focus();
                        });
                    };
                }
            }
        }   
    };

    this.validateDate = (month, day, year) => {
        var today = new Date();
        var age = today.getFullYear() - year;
        var m = today.getMonth() - month;
        if (m < 0 || (m === 0 && today.getDate() < day)) {
            age--;
        }
        return age < 105 && age > 15;
    };

    this.setFields = (obj) => {
        var typeArr = obj['Type'].split('(');
        var type = typeArr[0].replace(/[^A-Z]/g, '');
        var header = `<div class="col-md-5"><label>${obj['Description']}</label></div>`;
        var id = obj['Description'].replace(/[^a-zA-Z0-9]/g, '_');

        if(type == 'VARCHAR') {
            var numChar = typeArr[1].replace(/[^0-9]/g, '');
        }
        var htmlProps = {
            varCharElem : `<div class="col-md-7">
                            <ul class="data-list">
                            <li>
                                <input id="${id}" name="Zip" class="form-control input-lg" data-model="Location" maxlength="${numChar}">
                            </li>
                            </ul>
                        </div>`,
            dateElem: `<div class="col-md-7"><ul class="data-list">
                        <li>
                        <input type="text" autocomplete="off" id="5903F50A-CE9D-0370-213E-29820CD4DF32" name="AppBirthDate" class="form-control input-lg hasTFDate" data-model="Customer" 
                        data-widget="TFDate" maxlength="10" tabindex="-1" style="width: 100px; position: absolute; opacity: 0; height: 
                        0px; font-size: 14px; z-index: -9999;">
                            <span class="TFDate" style="display: inline-block;">
                            <span class="TFDate-Inner form-inline" style="display: inline-block;"><span class="TFDate-Cell" style="display: 
                            inline-block;">
                                <input id="${id}_Month" class="TFDate-Month form-control input-lg date-field" maxlength="2" type="tel" placeholder="MM" size="2"></span>
                            <span class="TFDate-Cell" style="display: inline-block;">
                                <input id="${id}_Day" class="TFDate-Day form-control input-lg date-field" maxlength="2" type="tel" placeholder="DD" size="2"></span>
                            <span class="TFDate-Cell" style="display: inline-block;">
                                <input id="${id}_Year" class="TFDate-Year form-control input-lg date-field" maxlength="4" type="tel" placeholder="YYYY" size="4"></span></span></span></li></ul></div>`,
            enumElem: `<div class="col-md-7">
                        <ul class="data-list">
                        <li>
                            <select id="${id}" type="tel" autocomplete="off" id="52D8E93A-B5D1-0ADB-519D-1B484BBEB21C" name="Zip" class="form-control input-lg select2-hidden-accessible" data-model="Location" maxlength="5">`
        }
        this.rules[id] = obj['Rules'];
        switch(type) {
            case 'VARCHAR':
                return `<div class="col-md-8 col-md-offset-2">${header}${htmlProps['varCharElem']}</div>`;
            case 'DATE':
                this.rules[`${id}_Month`] = obj['Rules'];
                this.rules[`${id}_Year`] = obj['Rules'];
                this.rules[`${id}_Day`] = obj['Rules'];
                return `<div class="col-md-8 col-md-offset-2">${header}${htmlProps['dateElem']}</div>`;
            case 'ENUM':
                var selections = typeArr[1].split(',');
                for(var i = 0; i < selections.length; i++) {
                    htmlProps['enumElem'] += `<option value="${selections[i].replace(/[^a-zA-Z]/g, '')}">${selections[i].replace(/[^a-zA-Z]/g, '')}</option>`
                }
                htmlProps['enumElem'] += '<select></li></ul></div>';
                return `<div class="col-md-8 col-md-offset-2">${header}${htmlProps['enumElem']}</div>`;
        }
    }
  }

  var newDriver;
  $.ajax({
      url: 'http://localhost:800/get',
      type: 'GET',
      contentType: 'application/json;charset=utf-8'
  }).done((res) => {
    console.log(res);
      newDriver = new RenderDriver(res['Models']['Driver']);
      newDriver.getHTML();
  });

  $('#vehicle-form').focusout(function(e) {
    var rulesList = newDriver.rules[e.target.id].split(';');
    // Handle birthdate exceptions
    if(e.target.id == 'Birthdate_Month' && e.target.value != '' && !isNaN(e.target.value)) {
      $('#Birthdate_Day').focus();
    } else if(e.target.id == 'Birthdate_Day' && e.target.value != '' && !isNaN(e.target.value)) {
      $('#Birthdate_Year').focus();
    } else if(e.target.id == 'Birthdate_Year' && e.target.value != '' && !isNaN(e.target.value)) {
      if(!newDriver.validateDate($('#Birthdate_Month').val(), $('#Birthdate_Day').val(), e.target.value)) {
        newDriver.validateRules(e.target.id, rulesList, e.target.value);
      }
    } else {
      newDriver.validateRules(e.target.id, rulesList, e.target.value);
    }
  });
});
