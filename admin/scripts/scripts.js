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
var groupname;
  
const baseURL = window.location.hostname;
const protocol = window.location.protocol;
const token = getCookie('webapitoken');
const url = window.location.href.toLowerCase();

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
  
function getMarketplaceCustomFields(callback){
  var apiUrl = '/api/v2/marketplaces'
  $.ajax({
      url: apiUrl,
      method: 'GET',
      contentType: 'application/json',
      success: function(result) {
          if (result) {
              callback(result.CustomFields);
          }
      }
  });
}
  
 function appendColumns(){
  waitForElement("#no-more-tables", function ()
  {
  
    var status = `<th data-column="9" tabindex="0" scope="col" role="columnheader" aria-disabled="false" aria-controls="no-more-tables" unselectable="on" aria-sort="none" aria-label="User Type: No sort applied, activate to apply an ascending sort" style="user-select: none;"><div class="tablesorter-header-inner">${groupname}</div></th>`;
    $('#no-more-tables thead tr th:nth-child(8)').after(status);
    $('#no-more-tables thead tr th:nth-child(9)').attr('data-column', '9');
    $("tbody tr:not(.loaded)").each(function ()
    {
        var userguid = $(this).attr('data-guid');
        var newTd = `<td id='company-status'></td>`;
         $('td:nth-child(8)', $(this)).after(newTd);
      
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
  
function saveCustomFields(status, merchantId){
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

      getMarketplaceCustomFields(function (result)
      {
       
        $.each(result, function (index, cf)
        {
          if (cf.Name == 'group_name' && cf.Code.startsWith(customFieldPrefix)) {
            groupname = cf.Values[0];
           appendColumns();
          }
          
    
        })
      
      })

    //  appendColumns();

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

    
    if (url.indexOf("/admin/emailcustomisation") >= 0) {

      //1. Hide the deprecated EDM's on the Orders List
      
      // OptionsShowHide([5, 6, 7]); // we only need the last 3 edms from the list, we will hide the rest
      
      //2. Append vue and axios reference on the page
      $('.page-content').attr('id', 'app');

      $('body').append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.js"></script>`);
      var script = document.createElement('script');
      script.onload = function ()
      {
          new Vue({
              el: "#app",
              data()
              {
                  return {
                      templates: [],
                      sellerTemplates: [],
                      buyerTemplates: [],
                      itemsTemplates: [],
                      editURL: `${protocol}//${baseURL}/admin/plugins/${packageId}/edit_content.php`
                  }
              },
  
              filters: {
                  capitalize: function (str)
                  {
                      return str.charAt(0).toUpperCase() + str.slice(1);
                  },
  
              },
  
              methods: {
                  async getAllTemplates(action)
                  {
                      try {
                          vm = this;
                          const response = await axios({
                              method: action,
                              url: `${protocol}//${baseURL}/api/v2/plugins/${packageId}/custom-tables/Templates`,
                              // data: data,
                              headers: {
                                  'Authorization': `Bearer ${token}`
                              }
                          })
                          const templates = await response
                          vm.templates = templates.data
  
                          vm.sellerTemplates = vm.templates.Records.filter((template) => template.category === 'Seller')
                          vm.buyerTemplates = vm.templates.Records.filter((template) => template.category === 'Buyer')
                          vm.itemsTemplates = vm.templates.Records.filter((template) => template.category === 'Items')
                        
                        
                          // return templates
  
                      } catch (error) {
                          console.log("error", error);
                      }
                  },
              },
              beforeMount()
              {
                  this.getAllTemplates('GET')
              },
  
  
          })


         
          //3. 
      }
      script.src = "https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.js";

      document.head.appendChild(script); //or something of the likes

      var followDiv = `<div class="panel-box panel-style-ab" id="follow-div">
                        <div class="panel-box-title">
                            <h3>Follow Plugin</h3>
                            <div class="pull-right"><a class="panel-toggle" href="javascript:void(0);"><i class="icon icon-toggle"></i></a></div>
                            <div class="clearfix"></div>
                        </div>
                        <div class="panel-box-content">
                            <ul>
                                  
                                 
                            </ul>
                        </div>
                    </div>`;
    $('.page-content .panel-box').last().after(followDiv);


      $('#follow-div .panel-box-content ul').append(`
      <li v-for="template in sellerTemplates">
          <h5> {{template['title']}}</h5>
          <p>{{template['description']}}</p>
          <a class="action-edit-template" :href="editURL + '?pageid=' + template.Id + '&redirect=admin'" :id="template.Id">Edit</a>

         
      </li>`);

      
      $('#follow-div .panel-box-content ul').append(`
      <li v-for="template in buyerTemplates">
          <h5> {{template['title']}}</h5>
          <p>{{template['description']}}</p>
          <a class="action-edit-template" :href="editURL + '?pageid=' + template.Id + '&redirect=admin'" :id="template.Id">Edit</a>

         
      </li>`);

      $('#follow-div .panel-box-content ul').append(`
      <li v-for="template in itemsTemplates">
          <h5> {{template['title']}}</h5>
          <p>{{template['description']}}</p>
          <a class="action-edit-template" :href="editURL + '?pageid=' + template.Id + '&redirect=admin'" :id="template.Id">Edit</a>

         
      </li>`);

  
      
  }



















  });












function getCookie (name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
 

});
})();
