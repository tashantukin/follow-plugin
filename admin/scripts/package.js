
(function() {
    var scriptSrc = document.currentScript.src;
    var packagePath = scriptSrc.replace('/scripts/package.js', '').trim();
    var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
    var packageId = re.exec(scriptSrc.toLowerCase())[1];
    document.addEventListener('DOMContentLoaded', function () {
    const HOST = window.location.host;
    var customFieldPrefix = packageId.replace(/-/g, "");
    var userId = $('#userGuid').val();
    var data1;      
    // var accessToken = 'Bearer ' + getCookie('webapitoken')
    var pathname = (window.location.pathname + window.location.search).toLowerCase();
    //switch
    var token = commonModule.getCookie('webapitoken');   
    var indexPath = scriptSrc.replace('/scripts/package.js', '/index.php').trim();
    const baseURL = window.location.hostname;
    const protocol = window.location.protocol;

    const emailTemplatePath = `${protocol}//${baseURL}/admin/emailcustomisation/index`;
  

    //run on creation page only
    new Vue({
        el: "#app",
        data() {
            return {
                templates: [],
                buyerTemplates: [],
                sellerTemplates: [],
                itemsTemplates: []
              
            }
        },

        filters: {
            capitalize: function(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            },

        },

        methods: {
            async getAllTemplates(action) {
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

                    vm.buyerTemplates = vm.templates.Records.filter((template) => template.category === 'Buyer')
                    vm.sellerTemplates = vm.templates.Records.filter((template) => template.category === 'Seller')
                    vm.itemsTemplates = vm.templates.Records.filter((template) => template.category === 'Items')
                   

                   console.log(`items ${vm.itemsTemplates}`);
                   // console.log(vm.orderTemplates);
                    // return templates

                } catch (error) {
                    console.log("error", error);
                }
            },
        },
        beforeMount() {
            this.getAllTemplates('GET')
        },


    })

    function savePageContent(el) {
        $('#save').addClass('disabled');

        var cc ='', bcc='';
        //cc 
      if ($('#cc_email').val()) {
          var ccTrim = $('#cc_email').val().trim();
           cc = ccTrim.split();
      }
        
        //bcc
      if ($('#bcc_email').val()) {
          var bccTrim = $('#bcc_email').val().trim();
          bcc = bccTrim.split(); 
            
      }

        data1 = CKEDITOR.instances.editor1.getData();
        console.log(data1);
      

        var data = { 'userId': userId, 'title': $('#title').val(), 'content': data1, 'subject': $('#subject').val(), 'description': $('#description').val(), 'type': $("#email-type option:selected").text(), 'cc' : cc, 'bcc' : bcc};
        var apiUrl = packagePath + '/save_new_content.php';
        $.ajax({
            url: apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(result) {
                console.log(JSON.stringify(result));
                toastr.success('New email template successfully saved.');
                $('#title').val('');
                $('#save').removeClass('disabled');

                if (el.attr('redirect') == 'admin') {
                    window.location.href = emailTemplatePath;
                } else {
                    window.location.href = indexPath;
                }
                //window.location.href = indexPath;
            },
            error: function(jqXHR, status, err) {}
        });
    }

    function saveModifiedPageContent(el) {
        data1 = CKEDITOR.instances.editor1.getData();
        var cc ='', bcc='';
        //cc 
      if ($('#cc_email').val()) {
          var ccTrim = $('#cc_email').val().trim();
           cc = ccTrim.split();
      }
        
        //bcc
      if ($('#bcc_email').val()) {
          var bccTrim = $('#bcc_email').val().trim();
          bcc = bccTrim.split(); 
            
      }

        var data = { 'pageId': $('#pageid').val(), 'userId': userId, 'title': $('#title').val(), 'content': data1, 'subject': $('#subject').val(), 'description': $('#description').val(), 'template-id': $('#pageid').val(), 'type': $("#email-type option:selected").text(), 'cc' : cc, 'bcc' : bcc };
        var apiUrl = packagePath + '/save_modified_content.php';
        $.ajax({
            url: apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(result) {
                console.log(JSON.stringify(result));
                toastr.success('Page Contents successfully updated.');
                $('#title').val('');
                if (el.attr('redirect') == 'admin') {
                    window.location.href = emailTemplatePath;
                } else {
                    window.location.href = indexPath;
                }
                
            },
            error: function(jqXHR, status, err) {}
        });
    }
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
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




        //email template
        $('.paging').css('margin', 'auto');

        // var pathname = (window.location.pathname + window.location.search).toLowerCase();

        // const index1 = '/admin/plugins/' + packageId;
        // const index2 = '/admin/plugins/' + packageId + '/';
        // const index3 = '/admin/plugins/' + packageId + '/index.php';
        // if (pathname == index1 || pathname == index2 || pathname == index3) {
        //     window.location = pagelist + '?tz=' + timezone_offset_minutes;
        // }

        //save the page contents
        $('#save').click(function() {

            //add field validations
            savePageContent($(this));
            // }
        });
        //save modified page contents
        $('#edit').click(function() {

            if ($("#title").val() == "" || data1 == "") {
                console.log('true');
                toastr.error('Please fill in empty fields.');

            } else {
                saveModifiedPageContent($(this));
            }
        });

        //delete the page contents
        $('#popup_btnconfirm').click(function() {

            pagedids = $('.record_id').val();
            deletePage();
            //
        });

        $('#popup_sendMail').click(function() {
            sendMail();

        });


        //cancel button
        $('#popup_btnconfirm_cancel').click(function ()
        {
            
            if ($(this).attr('redirect') == 'admin') {
                window.location.href = emailTemplatePath;
            } else {
                window.location.href = indexPath;
            }

            
        });
        
          

      });

    
    });
    })();
    