(function () {
  /* globals $ */
  var scriptSrc = document.currentScript.src;
  var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
  var packageId = re.exec(scriptSrc.toLowerCase())[1];
  var packagePath = scriptSrc.replace("/scripts/scripts.js", "").trim();
  var customFieldPrefix = packageId.replace(/-/g, "");
  const HOST = window.location.host;
  var hostname = window.location.hostname;
  var urls = window.location.href.toLowerCase();
  var userId = $("#userGuid").val();
  var merchantId = $('#storefrontMerchantGuid').val()
  var followerList = [];
  var itemList = [];
  var currentUser = $('#subAccountUserGuid').length ? $('#subAccountUserGuid').val() : userId;
  var currentMerchant = $('#storefrontMerchantGuid').length ? $('#storefrontMerchantGuid').val() : $('#merchantGuid').val();
  var pathname = (window.location.pathname + window.location.search).toLowerCase();
  var companies;
  var merchantName;
  var isCompanyFollowAllowed;
  var isUserFollowAllowed;
  var isItemFollowAllowed;
  

  const distinct = (value, index, self) =>
  {
    return self.indexOf(value) === index
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

  function getItemInfo(itemId, channelId,token) {
    var apiUrl = '/api/v2/items/' + itemId;
    $.ajax({
        url: apiUrl,
        contentType: 'application/json',
        method: 'GET',
      success: function (item)
      {
        var itemLink = `${location.protocol}//${hostname}/user/item/detail/${item.Name.replace(" ", "-")}/${itemId}`
        var edm = `<p>We have an <a href="${itemLink}" target="_blank" style="color: #cc0000">update</a> from <b>${merchantName}</b>.</p>`;
        //send the direct message
        var data = { 'Message': edm };
        $.ajax({
          
          url: `/api/v2/users/${userId}/channels/${channelId}`,
          method: 'POST',
          beforeSend: function (xhr)
          {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
          },
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: function (response)
          {
            console.log(JSON.stringify(response));

          }
        })
          
        }
    });
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
 async function  getUserCustomFields(merchantGuid,callback) {
    var apiUrl = `/api/v2/users/${merchantGuid}`;

    console.log(apiUrl);
    $.ajax({
      url: apiUrl,
      method: "GET",
      contentType: "application/json",
      success: function (result) {
        if (result) {
          callback(result.CustomFields);

        }
      },
    });
  }

  function getUserDetails(userId, callback)
  {
    var apiUrl = `/api/v2/users/${userId}?includes=AccountOwnerID`;

    console.log(apiUrl);
    $.ajax({
      url: apiUrl,
      method: "GET",
      contentType: "application/json",
      success: function (result) {
        if (result) {
          callback(result);

        }
      },
    });
  }

  function saveCustomFields(followersList, merchantId)
	{
		var data  = { 'followers-id' : followersList, 'user-id' : merchantId} 
		//console.log(data);
		var apiUrl = packagePath + '/save_followers.php';
		$.ajax({
			url: apiUrl,
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function (response)
			{

        console.log(response);
        loadCustomFields(merchantId,'');

			},
			error: function (jqXHR, status, err)
			{
				// toastr.error('---');
			}
		});
  }
  
  function saveItemCustomFields(itemList, userId)
	{
		var data  = { 'items-id' : itemList, 'user-id' : userId} 
		//console.log(data);
		var apiUrl = packagePath + '/save_follow_items.php';
		$.ajax({
			url: apiUrl,
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function (response)
			{

        console.log(response);
       // loadCustomFields(merchantId,'');

			},
			error: function (jqXHR, status, err)
			{
				// toastr.error('---');
			}
		});
  }


  function loadCustomFields(merchantGuid, page, isCompanyFollowAllowed, isUsersFollowAllowed,isItemFollowAllowed)
  {
    getUserCustomFields(merchantGuid, function (result)
    {
      console.log(result); // null if not company

      if (!result) { //for users without followers yet
        console.log('isnull');
        if (page != 'settings') {
          if (isUsersFollowAllowed == '1') {
            $('.follow-con-name').show();
            console.log(isUsersFollowAllowed);
               //follow buttton feature
               var followButton = `<input type="button" id="follow" value= "Follow" status="">`;
               var followButtonItem = `<a href="javascript:void(0);" id="follow" status="">Follow<i class="icon inbox-icon" ></i></a>`;
              //  if ($('body').find('#follow').length == 0) {
              //    page == 'item-details' ?
              //      $('.itmdtls-seller-cnct a').after(followButtonItem)
              //      : ''
             
              // }
              var followersDiv = `<input type="hidden" id="followers-list" >`;
              var followersCode = `<input type="hidden" id="followers-cf-code">`;

              var followersDivItem = `<input type="hidden" id="followers-list" >`;
              var followersCodeItem = `<input type="hidden" id="followers-cf-code">`;
          
            page == 'item-details' ?
               
                $('body').append(followersDivItem, followersCodeItem)
                : $('body').append(followersDiv, followersCode)
            
            
              $('#followers-list').val();
              $('#followers-cf-code').val();
               //check if already following 
              
               followerList = $('#followers-list').val().split(',');
            
            waitForElement('#follow', function ()
            {
              console.log(followerList);
              let activeUsers = followerList.filter(function(v){return v.length > 5});
              let activeUsersCount = activeUsers.length;
              followerList.includes(userId) ? ($('#follow').attr('status', 'following'), $('#follow').prop("checked", true)) : ($('#follow').prop("checked", false), $('#follow').attr('status', 'not-following'));
              $('.active-followers').text(`${activeUsersCount} Active Users`);
            });

          } 

        }
        
      } else {
          $.each(result, function (index, cf)
          {
          
            //for followers list
            if (page != 'settings') {

              //check user type (company or not)
              if (cf.Name == 'company_status' && cf.Code.startsWith(customFieldPrefix)) {
                console.log('cond 1');
                var companyStatus = cf.Values[0];
                if (companyStatus == 'true' && isCompanyFollowAllowed == '1') {  //if company and can be followed
                  $('.follow-con-name').show();
                  //follow buttton feature
                  var followButton = `<input type="button" id="follow" value= "Follow" status="">`;
                  var followButtonItem = `<a href="javascript:void(0);" id="follow" status="">Follow<i class="icon inbox-icon" ></i></a>`;
                  if ($('body').find('#follow').length == 0) {
                    page == 'item-details' ?
                      $('.itmdtls-seller-cnct a').after(followButtonItem)
                      : $('.store-merchant-info h4').after(followButton)
                
                  }
                } 

                if (companyStatus != 'true' && isUsersFollowAllowed == '1') {  //if company and can be followed
                  $('.follow-con-name').show();
                  //follow buttton feature
                  var followButton = `<input type="button" id="follow" value= "Follow" status="">`;
                  var followButtonItem = `<a href="javascript:void(0);" id="follow" status="">Follow<i class="icon inbox-icon" ></i></a>`;
                  if ($('body').find('#follow').length == 0) {
                    page == 'item-details' ?
                      $('.itmdtls-seller-cnct a').after(followButtonItem)
                      : $('.store-merchant-info h4').after(followButton)
                
                  }
                  
                } 

              }

          
              if (cf.Name == 'followers_list' && cf.Code.startsWith(customFieldPrefix)) {
                console.log('cond 3');
                var cfCodeFollower = cf.Code;
                var currentFollowers = cf.Values[0];
                console.log(currentFollowers);
              
                var followersDiv = `<input type="hidden" id="followers-list" >`;
                var followersCode = `<input type="hidden" id="followers-cf-code">`;
  
                var followersDivItem = `<input type="hidden" id="followers-list" >`;
                var followersCodeItem = `<input type="hidden" id="followers-cf-code">`;
            
                page == 'item-details' ?
                  $('body').append(followersDivItem, followersCodeItem)
                  : $('body').append(followersDiv, followersCode)
              
              
                $('#followers-list').val(currentFollowers);
                $('#followers-cf-code').val(cfCodeFollower);
              }

           

              //check if already following 
              if ($('#followers-list').length) {
                
                followerList = $('#followers-list').val().split(',');
                console.log('followers ' + followerList);
                let activeUsers = followerList.filter(function (v) { return v.length > 5 });
                let activeUsersCount = activeUsers.length;
                followerList.includes(userId) ? ($('#follow').attr('status', 'following'), $('#follow').prop("checked", true)) : ($('#follow').prop("checked", false), $('#follow').attr('status', 'not-following'));
                $('.active-followers').text(`${activeUsersCount} Active Users`);
              }

            }
            else {  //for company status
              //add the banner
              var banner = `<div class="subscription_gray_message"><i class="icon icon-info"></i>This user is set as <strong>company.</strong></div>`
              if (cf.Name == 'company_status' && cf.Code.startsWith(customFieldPrefix)) {
                var cfCode = cf.Code;
                var companyStatus = cf.Values[0];
                if (companyStatus != null) {
                  // companyStatus == 'true' ?  : '';
                  if (companyStatus == 'true') {
                    $('.seller-titlearea').before(banner);
                    $('#profile-tab span').text('COMPANY PROFILE');
                    //label changes
                    $('#input-displayName').parent().find('label').text('COMPANY NAME');
                    $('#input-firstName').parents('.item-form-group').hide();  //hide first name and last name

                    // add the new followers tab
                     var followingHeader = `<li><a href="#following" onclick="Validate('#following-tab', 3, false)" id="following-tab" aria-expanded="true"><span>FOLLOWERS</span></a></li>`;
                    $('#setting-tab li:last-child').after(followingHeader);
                    
                    

                    var followingContent = `
                    <div class="tab-pane" id="following">
                    
                    <div class="container">
                    <div class="company-section">
                        <h4></h4>
                        <table class="table" id="followers-table">
                            <thead>
                                <tr>
                                    <th width="125">#</th>
                                    <th>Work Email</th>
                                </tr>
                            </thead>
                            <tbody>
                               
                            </tbody>
                        </table>
                    </div>
                    </div>
                    </div>`
                    $('#payment_acceptance').after(followingContent);

                    setTimeout(function() {	
                      var count = $(".seller-tab-area .nav-tabs>li").length;
                      $(".seller-tab-area .nav-tabs>li").each(function(index) {
                        var $that = $(this);
                        var $id = $that.find("a").attr("id");
                       $that.find("a").attr("onclick",`Validate('#`+$id+`', `+index+`, false)`);
                      });
                    }, 500);


                    //check if the logged in user is sub account

                    if ($('#subAccountUserGuid').length) {
                      $('.change-profile').hide();  //hide the change profile image button 
                      $('.subscription_gray_message').text(`This user is a sub account for the company ${$('#input-displayName').val()}`); //change the banner text

                      //rename the Profile tab => Company Profile
                      //$('#profile-tab span').text('COMPANY PROFILE');
                      //disable all the fields for parent merchant
                      $('#profile input').attr('disabled', true);
                      $('#address input').attr('disabled', true);
                      $('.seller-common-box textarea').attr('disabled', true);
                      $('.change-profile a').attr('data-target', ''); //image upload
                      $('#profile #next-tab').hide();  //next button
                      //add new header
        
                      var newHeader = `<li><a data-toggle="tab" href="#new-profile" id="new-profile-tab" onclick="Validate('#profile-tab', 0, false)"><span>PROFILE</span></a></li>`;
                      $('#setting-tab li:nth-child(1)').after(newHeader);

                      var newProfileContent = `
                      <div class="tab-pane" id="new-profile">
                      
                            <div class="container">

                                <div class="seller-common-box">
                              </div>

                            </div>    
                      </div>`

                      $('#payment_acceptance').after(newProfileContent);
                        
                      var sellerbox = `<div class="item-form-group">
                      <div class="col-md-6">
                          <label>FIRST NAME</label>
                          <input type="text" name="FirstName" class="required" value="tash" id="input-sub-firstName" >
                      </div>
                      <div class="col-md-6">
                          <label>LAST NAME</label>
                          <input type="text" class="required" name="LastName" value="igi" id="input-sub-lastName">
                      </div>
                      </div>


                    <div class="item-form-group">
                          <div class="col-md-6">
                              <label>NOTIFICATION EMAIL</label>
                              <input type="text" class="required emailOnly" id="notification-sub-email" name="Email" value="tash@gmail.com" >
                          </div>
                          <div class="col-md-6">
                              <label>CONTACT NUMBER</label>
                                  <input type="text" class="required phoneOnly" name="PhoneNumber" id="input-sub-contactNumber" value="3412312">

                          </div>
                      </div>
                      <div class="clearfix"></div>

                      </div>  

                      <div id="sub-settings_save" class="next-tab-area">

                          <a class="my-btn btn-red" href="javascript:void(0)"  id="next-tab">

                              SAVE

                          </a>

                      </div>`
                  
                      $('#new-profile .seller-common-box').append(sellerbox);

                    
                    }


                  }

                }
                console.log(companyStatus);

              }
              //followers list table
              if (cf.Name == 'followers_list' && cf.Code.startsWith(customFieldPrefix)) {
                var currentFollowers = cf.Values[0];
                var followersDiv = `<input type="hidden" id="followers-list" >`;
                $('body').append(followersDiv);
                $('#followers-list').val(currentFollowers);
                followerList = $('#followers-list').val().split(',');
                var activeFollowers = followerList.filter(function(v){return v.length > 5 || v != v});
                console.log(`users ${activeFollowers}`);

                var i = 1;
                $.each(activeFollowers, function (index, userId)
                {
                 
                  getUserDetails(userId, function (user)
                  {
                      userRow = `<tr>
                      <td><span class="grey-col">${i}</span></td>
                      <td>${user['Email']}</td>
                      </tr>`
                    
                      $('#followers-table tbody').append(userRow);
                    i++;
                  })
      
                  // $('#company').append(options); 
                })
                $('.company-section h4').text(`${activeFollowers.length} Team Members Total`)

              }  
            }
        
          })
        }

    });
    
  }
//adding items
  $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    if (options.type.toLowerCase() === "post" &&
        options.url.toLowerCase().indexOf('/user/item/createitems') >= 0) {
        let success = options.success;
        options.success = function(data, textStatus, jqXHR) {
            // override success handling
            if (data.Success) {
              let itemId = data.Guid;
              
              getUserDetails(userId, function (user)
              {
                merchantName = user.DisplayName;
                
              })

                sendEDM(itemId, function() {
                    if (typeof(success) === "function") return success(data, textStatus, jqXHR);
                });
              
                sendDirectMessage(itemId, 'created', function() {
                  if (typeof(success) === "function") return success(data, textStatus, jqXHR);
                });
              
            
            } else {
                if (typeof(success) === "function") return success(data, textStatus, jqXHR);
            }


        };
    }
  });

//edit items
  $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    if (options.type.toLowerCase() === "post" &&
        options.url.toLowerCase().indexOf('/user/item/updateitems') >= 0) {
        let success = options.success;
        let itemId = $('#itemGuid').val();
      options.success = function (data, textStatus, jqXHR)
      {
        console.log(data);

        getUserDetails(userId, function (user)
        {
          merchantName = user.DisplayName;
          
        })
          
         // if (data.Success) {
          
            sendEDM(itemId, function() {
                if (typeof(success) === "function") return success(data, textStatus, jqXHR);
            });
          
          
            sendDirectMessage(itemId, 'update', function() {
              if (typeof(success) === "function") return success(data, textStatus, jqXHR);
            });
          
         
        };
    }
});

  function sendEDM(itemguid, callback)
  {
   // $('head').append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.js"></script>`);
    var data = { 'itemguid': itemguid};
    var apiUrl = packagePath + '/send_edm.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
          callback();
            //  toastr.success('Successfully saved.');

        },
        error: function(jqXHR, status, err) {
            //   toastr.error('---');
            callback();
        }
    });
  }
  
  function sendDirectMessage(itemId, action, callback) {
    var apiUrl = packagePath + '/get_token.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
     
        contentType: 'application/json',
        // data: JSON.stringify(data),
      success: function (response)
      {
        var token = $.parseJSON(response);
        token = token['token']['access_token'];
        // callback(); 
        getUserCustomFields(userId, function (result)
        {

          if (result) {

            $.each(result, function (index, cf)
            {
              if (cf.Name == 'followers_list' && cf.Code.startsWith(customFieldPrefix)) {
                var followers = cf.Values[0].split(',');
                console.log(followers)
                var allFollowers = followers.filter(distinct);
                console.log(allFollowers);
                $.each(allFollowers, function (index, followerId)
                {
                  $.ajax({
                    url: `/api/v2/users/${userId}/channels?recipientId=${followerId}`,
                    method: 'POST',
                    beforeSend: function (xhr) {
                      xhr.setRequestHeader('Authorization', 'Bearer ' +  token);
                     },
                    contentType: 'application/json',

                    success: function (response)
                    {
                      var channelId = response['ChannelID'];
                      getItemInfo(itemId, channelId, token);

                      
                    }

                    })
                })

              }
              
            })
            
          }

        })
      },
      error: function(jqXHR, status, err) {
          callback();
      }
    });
  }


  function saveSubAccountDetails(userId,fname, lname, contact, email)
  {
    var data = { 'user-guid': userId, 'last-name' : lname, 'first-name' : fname, 'email' :email , 'contact-number': contact };
    var apiUrl = packagePath + '/save_sub_account.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
         // console.log(JSON.parse(response))
          toastr.success('Details successfully saved.');
          window.location = '/user/item/list';

        },
        error: function(jqXHR, status, err) {
            //   toastr.error('---');
           
        }
    });
  }
  
  function appendFollowButton(page)
  {
   
    let storeFrontButton = `<div class="following-button-con"> <a class="following-button follow" href="#">Follow</a></div>`
    let itemDetailButton = `<div class="following-button-con"><a class="following-button" href="#">Follow</a></div>`
    
    var followersDivStoreFront = `<input type="hidden" id="followers-list" >`;
    var followersDivItemDetails = `<input type="hidden" id="followers-list" >`;
   
    page == 'item' ? ($('.item-star').append(itemDetailButton)) ($('body').append(followersDivItemDetails)) : ($('.store-rating').before(storeFrontButton)) ($('body').append(followersDivStoreFront)) ;
  }
  
 let checkIfFollowAllowed = async (type) =>
  {
    console.log(`user ${type}`)
     getMarketplaceCustomFields(function (result)
     {
    
      $.each(result, function (index, cf)
      {
        var status;
        if (type == 'company') {
          if (cf.Name == 'allow_company_follow' && cf.Code.startsWith(customFieldPrefix)) {
            var isCompanyFollowAllowed = cf.Values[0];
            status = isCompanyFollowAllowed == 'true' ? appendFollowButton('user') : '';
            return status;
          }
        }
        if (type == 'user') {
           if (cf.Name == 'allow_users_follow' && cf.Code.startsWith(customFieldPrefix)) {
             var isUserFollowAllowed = cf.Values[0];
             console.log('here')
             status = isUserFollowAllowed == 'true' ? appendFollowButton('user') : '';
             console.log(status);
             return status;
           }
        }
        if (type == 'item') {
            if (cf.Name == 'allow_items_follow' && cf.Code.startsWith(customFieldPrefix)) {
              var isItemFollowAllowed = cf.Values[0];
              status = isItemFollowAllowed == 'true' ? appendFollowButton('item') : '';
              return status;
           }
          
        }
          
      })
    

   });
   
  
  }
  
  $(document).ready(function ()
  {
    
    if (pathname.indexOf('user/merchantaccount') >= 0) {
     
        var userType;
      
        getUserCustomFields(userId, function (result)
        {
          userType = (!result) || !("company_status" in result) || (result == null) ?  // no cf means not company
            'user'
            :
            $.each(result, function (index, cf)
            {
              if (cf.Name == 'company_status' && cf.Code.startsWith(customFieldPrefix)) {
                var companyStatus = cf.Values[0];
                userType = companyStatus == 'true' ? 'company' : 'user'
                
              }

              if (cf.Name == 'followers_list' && cf.Code.startsWith(customFieldPrefix)) {
                currentFollowers = cf.Values[0];
              }
             
            })
          checkIfFollowAllowed(userType);
           
        })
      
     
     $(document).on("click", "#follow", function ()
     {
       console.log('follow click');
       //if ($('#subAccountUserGuid').length) {
         var allFollowers;
       if (followerList.length) {
         console.log('if');
         followerList = followerList.filter(function (value) { return value.length > 5})
         //unfollowing
         console.log(JSON.stringify(followerList));
           allFollowers = $('#follow').attr('status') == 'following'  ? followerList.filter(function (value) { return value !==  $("#userGuid").val(); })
           : [...followerList,  $("#userGuid").val()];
            
           saveCustomFields(allFollowers, currentMerchant);
           $('#follow').attr('status', 'not-following')
       } else {
         console.log('else');
           saveCustomFields(currentUser,currentMerchant);
          
         }
         
     //  }
      
 
      
     });
         
    }

    if (pathname.indexOf('user/item/detail') >= 0) {
     
            var isCompanyFollowAllowed;
            var isUserFollowAllowed;
            var isItemFollowAllowed;
          // if (($('#follow').length) == 0) {
  
        getMarketplaceCustomFields(function(result) {
          $.each(result, function(index, cf) {
            if (cf.Name == 'allow_company_follow' && cf.Code.startsWith(customFieldPrefix)) {
              isCompanyFollowAllowed= cf.Values[0];
            }
            if (cf.Name == 'allow_users_follow' && cf.Code.startsWith(customFieldPrefix)) {
              isUserFollowAllowed = cf.Values[0];
            }
            if (cf.Name == 'allow_items_follow' && cf.Code.startsWith(customFieldPrefix)) {
            isItemFollowAllowed = cf.Values[0];
              
            }
              
          })

          if (isItemFollowAllowed == 1) {

            var buttonfollow = `<div class="cor-new-design" id="switch-con">
            <p class="title-caption">Follow Product</p>
            <div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="follow-item" value="Follow" status="not-following"><label class="onoffswitch-label" for="follow-item" id="field_mand_toggle"> <span class="onoffswitch-inner"></span> <span class="onoffswitch-switch"></span> </label></div>
            </div>`;
          $('.item-info-con').append(buttonfollow);

            getUserCustomFields($('#userGuid').val(), function (result)
            {

              var page = 'item-details';
              if (result) {
                $.each(result, function (index, cf){
                if (cf.Name == "following_items" && cf.Code.startsWith(customFieldPrefix)) {

                  var currentFollowingItems = cf.Values[0];
                  console.log('follow items ' + currentFollowingItems);
  
                  var itemFollowingDiv = `<input type="hidden" id="item-following-list" >`;
  
                  page == 'item-details' ?
                  $('body').append(itemFollowingDiv )
                  : ''
                
                  $('#item-following-list').val(currentFollowingItems);
                 
                  }

                });
                 //items following
                
                waitForElement('#follow-item', function () {
                  if ($('#item-following-list').length) {
                    itemList = $('#item-following-list').val().split(',');
                    itemList.includes($('#itemGuid').val()) ? ($('#follow-item').val('Unfollow'), $('#follow-item').prop("checked", true), $('#follow-item').text('Unfollow'), $('#follow-item').attr('status', 'following')) : ($('#follow-item').prop("checked", false), $('#follow-item').val('Follow'), $('#follow-item').text('Follow'), $('#follow-item').attr('status', 'not-following'));
    
                  }
                });

              }
              
            });



          }
         
  
      });



         
      
      
    }

    // if (pathname.indexOf('/user/marketplace/seller-settings') > -1 || pathname.indexOf('/user/marketplace/be-seller') > -1) {
    if (pathname.indexOf('/user/marketplace/user-settings') > -1 || pathname.indexOf('/user/marketplace/seller-settings') > -1 || pathname.indexOf('/user/marketplace/be-seller') > -1 ) {
     
     
      loadCustomFields(userId, 'settings')

      getUserDetails($('#subAccountUserGuid').val(), function (result)
        {
        $('#input-sub-firstName').val(result.FirstName);
        $('#input-sub-lastName').val(result.LastName);
        $('#notification-sub-email').val(result.Email);
        $('#input-sub-contactNumber').val(result.PhoneNumber  != null ? result.PhoneNumber : '');
        })
      
      $(document).on("click", "#sub-settings_save", function ()
      {
        saveSubAccountDetails($('#subAccountUserGuid').val(), $('#input-sub-firstName').val(), $('#input-sub-lastName').val(), $('#input-sub-contactNumber').val(), $('#notification-sub-email').val());
      })
     
  
      jQuery("#new-profile-tab").click(function(){
      
        $(this).attr("data-toggle", "tab")
   
      });

      jQuery("#following-tab").click(function(){
      
        $(this).attr("data-toggle", "tab")
   
      });

     
}

   

    $(document).on("click", "#follow-item", function ()
    {
      
      //if ($('#subAccountUserGuid').length) {
        var allItems;
        if (itemList.length) {
        //unfollowing
          allItems = $('#follow-item').attr('status') == 'following'  ? itemList.filter(function (value, index, arr) { return value != $('#itemGuid').val(); }) 
          : [...itemList, $('#itemGuid').val()];
           
          console.log(allItems);

          saveItemCustomFields(allItems, userId);
          $('#follow-item').attr('status', 'not-following')
          
        } else {
         
          saveItemCustomFields($('#itemGuid').val(), userId);
         
        }
        
    //  }
    });


  });
})();
