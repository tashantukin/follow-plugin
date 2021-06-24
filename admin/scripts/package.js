
(function() {
    var scriptSrc = document.currentScript.src;
    var packagePath = scriptSrc.replace('/scripts/package.js', '').trim();
    var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
    var packageId = re.exec(scriptSrc.toLowerCase())[1];
    document.addEventListener('DOMContentLoaded', function () {
    const HOST = window.location.host;
    var customFieldPrefix = packageId.replace(/-/g, "");
    var userId = $('#userGuid').val();
    // var accessToken = 'Bearer ' + getCookie('webapitoken')
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
        
      function saveCustomFields(type, value) {
              var data  = { type, value } 
              var apiUrl = packagePath + '/save_follow_status.php';
              $.ajax({
                  url: apiUrl,
                  method: 'POST',
                  contentType: 'application/json',
                  data: JSON.stringify(data),
                  success: function (response)
                  {
                      console.log('ok kokey');
          
                  },
                  error: function (jqXHR, status, err)
                  {
                      // toastr.error('---');
                  }
              });
      }
      
      $(document).ready(function ()
      {

        getMarketplaceCustomFields(function(result) {
            $.each(result, function(index, cf) {
                    if (cf.Name == 'allow_company_follow' && cf.Code.startsWith(customFieldPrefix)) {
                    code = cf.Code;
                    var followCompanyAllow = cf.Values[0];
                    console.log(followCompanyAllow);
                    followCompanyAllow == 'true' ?   $("#all-group-followed").attr('checked', 'checked') : '';
                    }
              
                    if (cf.Name == 'allow_users_follow' && cf.Code.startsWith(customFieldPrefix)) {
                    code = cf.Code;
                    var followUsersAllow = cf.Values[0];
                    console.log(followUsersAllow)
                    followUsersAllow == 'true' ?   $("#user-followed").attr('checked', 'checked') : '';
                  }
                  if (cf.Name == 'allow_items_follow' && cf.Code.startsWith(customFieldPrefix)) {
                    code = cf.Code;
                    var followItemsAllow = cf.Values[0];
                    console.log(followItemsAllow)
                    followItemsAllow == 'true' ?   $("#item-followed").attr('checked', 'checked') : '';
                    }
                  
                  if (cf.Name == 'group_name' && cf.Code.startsWith(customFieldPrefix)) {
                      code = cf.Code;
                      var groupname = cf.Values[0];
                      console.log(groupname)
                    $('#group-name').val(groupname);
                    $('#change-group-name').text(groupname);
                  }
                
            })
        });
          
          
        $(document).on('change', '.onoffswitch-checkbox', function() {
        
            var allowType = $(this).attr('data-name');
          var allowValue = $(this).prop('checked');
          console.log(allowValue);
          console.log(allowType);
          

        saveCustomFields(allowType, allowValue);
        });

        $(document).on('click', '#field_add', function ()
        {
          if ($('#group-name').val()) {
            var allowType = 'groupname';
            var allowValue = $('#group-name').val();

            saveCustomFields(allowType, allowValue);
          }
        
        });
        
          

      });

    
    });
    })();
    