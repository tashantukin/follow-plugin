(function() {
var scriptSrc = document.currentScript.src;
var packagePath = scriptSrc.replace('/scripts/scripts.js', '').trim();
var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
var packageId = re.exec(scriptSrc.toLowerCase())[1];
document.addEventListener('DOMContentLoaded', function () {
const HOST = window.location.host;
var customFieldPrefix = packageId.replace(/-/g, "");
var userId = $('#userGuid').val();
var accessToken = 'Bearer ' + getCookie('webapitoken')
var pathname = (window.location.pathname + window.location.search).toLowerCase();
//switch
function waitForElement(elementPath, callBack) {
  window.setTimeout(function () {
    if ($(elementPath).length) {
      callBack(elementPath, $(elementPath));
    } else {
      waitForElement(elementPath, callBack);
    }
  }, 500);
}
 function appendColumns(){
  waitForElement("#no-more-tables", function ()
  {
  
    var status = `<th data-column="22" tabindex="0" scope="col" role="columnheader" aria-disabled="false" aria-controls="no-more-tables" unselectable="on" aria-sort="none" aria-label="User Type: No sort applied, activate to apply an ascending sort" style="user-select: none;"><div class="tablesorter-header-inner">Company</div></th>`;
    $('#no-more-tables thead tr th:nth-child(21)').after(status);
    $('#no-more-tables thead tr th:nth-child(23)').attr('data-column', '23');
    $("tbody tr:not(.loaded)").each(function ()
    {
        var userguid = $(this).attr('data-guid');
        var newTd = `<td id='company-status'></td>`;
         $('td:nth-child(21)', $(this)).after(newTd);
      
      //if ($(this).find('.onoffswitch-checkbox').attr('data-merchant') == "true") {
        $('#company-status', $(this)).append(`<div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id=${userguid} data-id=${userguid}
        data-visible="true"><label class="onoffswitch-label" for=${userguid}><span class="onoffswitch-inner"></span>
        <span class="onoffswitch-switch"></span></label></div>`);
        getUserCustomfields(userguid, $('#company-status .onoffswitch-checkbox', $(this)))
     // }
       
        $(this).addClass('loaded');
    
    });
  })
}
function getUserCustomfields(id, el){
		var data = { 'userguid': id };
		var apiUrl = packagePath + '/get_customfields.php';
		$.ajax({
			url: apiUrl,
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function (result)
            {
        console.log(JSON.parse(result));
        var customfield = result != null || result != "" ? JSON.parse(result) : null;
        if (customfield != null) {
          customfield.status == 'true' ?  el.attr('checked', 'checked'): '';
         
        }
           
			},
			error: function (jqXHR, status, err)
			{
				// toastr.error('Error!');
			}
		});
}  
  
function saveCustomFields(status, merchantId)
	{
		var data  = { 'status' : status, 'user-id' : merchantId } 
		//console.log(data);
		var apiUrl = packagePath + '/save_status.php';
		$.ajax({
			url: apiUrl,
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function (response)
			{

        console.log(response);
        //loadCustomFields(merchantId);

			},
			error: function (jqXHR, status, err)
			{
				// toastr.error('---');
			}
		});
}

  $(document).ready(function ()
  {

    if ($('body').hasClass('user-page')) {
      var axiosCDN = `<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.js"></script>`;
      $('body').append(axiosCDN);

      appendColumns();

      //filter
      $('#search_btn').on('click', function (e)
      {
      appendColumns();
      })

      $(document).on('change', '#company-status .onoffswitch-checkbox', function() {
        console.log('changed');
        saveCustomFields($(this).prop('checked'), $(this).attr('data-id'));
      });

      
    }

  });

function getCookie (name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
 

});
})();
