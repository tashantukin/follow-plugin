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
  var itemGuid = $('#itemGuid').val();
  var merchantId = $('#storefrontMerchantGuid').val()
  var followerList = [];
  var followingList = [];
  var itemFollowingList = [];
  var followingGroupList = [];
  var itemFollowerList = [];
  var itemList = [];
  var currentUser = $('#subAccountUserGuid').length ? $('#subAccountUserGuid').val() : userId;
  var currentMerchant = $('#storefrontMerchantGuid').length ? $('#storefrontMerchantGuid').val() : $('#merchantGuid').val();
  var pathname = (window.location.pathname + window.location.search).toLowerCase();
  var companies;
  var merchantName;
  var isCompanyFollowAllowed;
  var isUserFollowAllowed;
  var isItemFollowAllowed;
  var isCompany;
  var buyerId;
  

  var token = getCookie('webapitoken');

    function getCookie(name){
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + name + '=');
      if (parts.length === 2) {
          return parts.pop().split(';').shift();
      }
    }

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

  function getOrderInfo(orderId)
  {
        $.ajax({
          url: `/api/v2/users/${userId}/orders/${orderId}`,
          method: 'GET',
          beforeSend: function (xhr)
          {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
          },
          contentType: 'application/json',
         // data: JSON.stringify(files),
          success: function (response){
            // var orders = $.parseJSON(response);
            buyerId = response['ConsumerDetail']['ID'];
            console.log(buyerId);
            var userType;
              getUserCustomFields(buyerId, function (result)
              {
              
                if ((!result) || (result == null) || !('company_status' in result)) {
                  userType = 'user';
                }
                else {
                  $.each(result, function (index, cf)
                  {
                    console.log('in each')
                    if (cf.Name == 'company_status' && cf.Code.startsWith(customFieldPrefix)) {
                      var companyStatus = cf.Values[0];
                      userType = companyStatus == 'true' ? 'company' : 'user'
                      
                    }
                  })
                }
                checkIfFollowAllowed(userType,'orders');
              })

            },
          });
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
function  getUserCustomFields(merchantGuid,callback) {
    var apiUrl = `/api/v2/users/${merchantGuid}`;

    console.log(apiUrl);
    $.ajax({
      url: apiUrl,
      method: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' +  token);
       },
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


  function getItemDetails(itemId, callback)
  {
    var apiUrl = `/api/v2/items/${itemId}`;

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

  function getItemCustomFields(itemGuid, callback)
  {
    var apiUrl = `/api/v2/items/${itemGuid}`;
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


  
  function saveCustomFields(followersList, merchantId, followingList,type, followingListGroup,page)
	{
		var data  = { 'followers-id' : followersList, 'merchant-id' : merchantId, 'user-id' : userId, 'following-id' : followingList, 'user-type' : type, 'following-group-list' : followingListGroup } 
		//console.log(data);
		var apiUrl = packagePath + '/save_followers.php';
		$.ajax({
			url: apiUrl,
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function (response)
      {
        
        if (page == 'orders') {
          getFollowers('orders', buyerId);
         
        } else {
          console.log(response);
          getFollowers('sf', merchantId);
         
        }
        getFollowing('users');

			},
			error: function (jqXHR, status, err)
			{
				// toastr.error('---');
			}
		});
  }
  
  function saveItemCustomFields(itemList, userId, itemFollowers)
	{
		var data  = { 'items-id' : itemList, 'user-id' : userId, 'item-guid' : itemGuid, 'merchant-guid' : currentMerchant, 'item-followers' : itemFollowers}  
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
        getFollowing('items');
       // loadCustomFields(merchantId,'');

			},
			error: function (jqXHR, status, err)
			{
				// toastr.error('---');
			}
		});
  }

  function loadCustomFields(merchantGuid, page)
  {
    getUserCustomFields(merchantGuid, function (result)
    {
      console.log(result); // null if not company

      if (!result) { //for users without followers yet
        console.log('isnull');
        if (page != 'settings') {
         
              var followersDiv = `<input type="hidden" id="followers-list" >`;
              var followersDivItem = `<input type="hidden" id="followers-list" >`;
              
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
        
      } else {
          $.each(result, function (index, cf)
          {
          
            //for followers list
            if (page != 'settings') {

         
              if (cf.Name == 'followers_list' && cf.Code.startsWith(customFieldPrefix)) {
                console.log('cond 3');
                var cfCodeFollower = cf.Code;
                var currentFollowers = cf.Values[0];
                console.log(currentFollowers);
              
                var followersDiv = `<input type="hidden" id="followers-list" >`;
                var followersDivItem = `<input type="hidden" id="followers-list" >`;
                
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
            // else {  //for company status
            //   //add the banner
            //   var banner = `<div class="subscription_gray_message"><i class="icon icon-info"></i>This user is set as <strong>company.</strong></div>`
            //   if (cf.Name == 'company_status' && cf.Code.startsWith(customFieldPrefix)) {
            //     var cfCode = cf.Code;
            //     var companyStatus = cf.Values[0];
            //     if (companyStatus != null) {
            //       // companyStatus == 'true' ?  : '';
            //       if (companyStatus == 'true') {
            //         $('.seller-titlearea').before(banner);
            //         $('#profile-tab span').text('COMPANY PROFILE');
            //         //label changes
            //         $('#input-displayName').parent().find('label').text('COMPANY NAME');
            //         $('#input-firstName').parents('.item-form-group').hide();  //hide first name and last name

            //         // add the new followers tab
            //          var followingHeader = `<li><a href="#following" onclick="Validate('#following-tab', 3, false)" id="following-tab" aria-expanded="true"><span>FOLLOWERS</span></a></li>`;
            //         $('#setting-tab li:last-child').after(followingHeader);
                    
                    

            //         var followingContent = `
            //         <div class="tab-pane" id="following">
                    
            //         <div class="container">
            //         <div class="company-section">
            //             <h4></h4>
            //             <table class="table" id="followers-table">
            //                 <thead>
            //                     <tr>
            //                         <th width="125">#</th>
            //                         <th>Work Email</th>
            //                     </tr>
            //                 </thead>
            //                 <tbody>
                               
            //                 </tbody>
            //             </table>
            //         </div>
            //         </div>
            //         </div>`
            //         $('#payment_acceptance').after(followingContent);

            //         setTimeout(function() {	
            //           var count = $(".seller-tab-area .nav-tabs>li").length;
            //           $(".seller-tab-area .nav-tabs>li").each(function(index) {
            //             var $that = $(this);
            //             var $id = $that.find("a").attr("id");
            //            $that.find("a").attr("onclick",`Validate('#`+$id+`', `+index+`, false)`);
            //           });
            //         }, 500);


            //         //check if the logged in user is sub account

            //         if ($('#subAccountUserGuid').length) {
            //           $('.change-profile').hide();  //hide the change profile image button 
            //           $('.subscription_gray_message').text(`This user is a sub account for the company ${$('#input-displayName').val()}`); //change the banner text

            //           //rename the Profile tab => Company Profile
            //           //$('#profile-tab span').text('COMPANY PROFILE');
            //           //disable all the fields for parent merchant
            //           $('#profile input').attr('disabled', true);
            //           $('#address input').attr('disabled', true);
            //           $('.seller-common-box textarea').attr('disabled', true);
            //           $('.change-profile a').attr('data-target', ''); //image upload
            //           $('#profile #next-tab').hide();  //next button
            //           //add new header
        
            //           var newHeader = `<li><a data-toggle="tab" href="#new-profile" id="new-profile-tab" onclick="Validate('#profile-tab', 0, false)"><span>PROFILE</span></a></li>`;
            //           $('#setting-tab li:nth-child(1)').after(newHeader);

            //           var newProfileContent = `
            //           <div class="tab-pane" id="new-profile">
                      
            //                 <div class="container">

            //                     <div class="seller-common-box">
            //                   </div>

            //                 </div>    
            //           </div>`

            //           $('#payment_acceptance').after(newProfileContent);
                        
            //           var sellerbox = `<div class="item-form-group">
            //           <div class="col-md-6">
            //               <label>FIRST NAME</label>
            //               <input type="text" name="FirstName" class="required" value="tash" id="input-sub-firstName" >
            //           </div>
            //           <div class="col-md-6">
            //               <label>LAST NAME</label>
            //               <input type="text" class="required" name="LastName" value="igi" id="input-sub-lastName">
            //           </div>
            //           </div>


            //         <div class="item-form-group">
            //               <div class="col-md-6">
            //                   <label>NOTIFICATION EMAIL</label>
            //                   <input type="text" class="required emailOnly" id="notification-sub-email" name="Email" value="tash@gmail.com" >
            //               </div>
            //               <div class="col-md-6">
            //                   <label>CONTACT NUMBER</label>
            //                       <input type="text" class="required phoneOnly" name="PhoneNumber" id="input-sub-contactNumber" value="3412312">

            //               </div>
            //           </div>
            //           <div class="clearfix"></div>

            //           </div>  

            //           <div id="sub-settings_save" class="next-tab-area">

            //               <a class="my-btn btn-red" href="javascript:void(0)"  id="next-tab">

            //                   SAVE

            //               </a>

            //           </div>`
                  
            //           $('#new-profile .seller-common-box').append(sellerbox);

                    
            //         }


            //       }

            //     }
            //     console.log(companyStatus);

            //   }
            //   //followers list table
            //   if (cf.Name == 'followers_list' && cf.Code.startsWith(customFieldPrefix)) {
            //     var currentFollowers = cf.Values[0];
            //     var followersDiv = `<input type="hidden" id="followers-list" >`;
            //     $('body').append(followersDiv);
            //     $('#followers-list').val(currentFollowers);
            //     followerList = $('#followers-list').val().split(',');
            //     var activeFollowers = followerList.filter(function(v){return v.length > 5 || v != v});
            //     console.log(`users ${activeFollowers}`);

            //     var i = 1;
            //     $.each(activeFollowers, function (index, userId)
            //     {
                 
            //       getUserDetails(userId, function (user)
            //       {
            //           userRow = `<tr>
            //           <td><span class="grey-col">${i}</span></td>
            //           <td>${user['Email']}</td>
            //           </tr>`
                    
            //           $('#followers-table tbody').append(userRow);
            //         i++;
            //       })
      
            //       // $('#company').append(options); 
            //     })
            //     $('.company-section h4').text(`${activeFollowers.length} Team Members Total`)

            //   }  
            // }
        
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

                sendEDM(itemId, 'create' ,function() {
                    if (typeof(success) === "function") return success(data, textStatus, jqXHR);
                });
              
                // sendDirectMessage(itemId, 'created', function() {
                //   if (typeof(success) === "function") return success(data, textStatus, jqXHR);
                // });
              
            
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
          
            sendEDM(itemId, 'update', function() {
                if (typeof(success) === "function") return success(data, textStatus, jqXHR);
            });
          
          
            // sendDirectMessage(itemId, 'update', function() {
            //   if (typeof(success) === "function") return success(data, textStatus, jqXHR);
            // });
          
         
        };
    }
});

  function sendEDM(itemguid,type, callback)
  {
   // $('head').append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.js"></script>`);
    var data = { 'itemguid': itemguid, type};
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
  
 
  function getFollowing(type,page)
  {
    $('#following-list').val('');
    getUserCustomFields(userId, function (result)
    {   
      //check following users
      $.each(result, function (index, cf)
      {
        if (type == 'items') {
          if (cf.Name == 'following_items' && cf.Code.startsWith(customFieldPrefix)) {
            var followingItems = cf.Values[0];
            console.log(`following items ${followingItems}`)

            if (page == 'settings') {  //retrieve following in user settings
              var item_list = followingItems.split(',');
              item_list = item_list.filter(function (v) { return v.length > 5 || v != v });
                console.log(`items ${item_list}`);

                var i = 1;
                $.each(item_list, function (index, itemId)
                {
                  getItemDetails(itemId, function (item)
                  {
                      userRow = `<div class="following-row">
                      <a href="#" class="following-links">
                          <div class="following-image">
                              <img src="${item['Media'][0]['MediaUrl']}">
                          </div>
                          <div class="following-display-name">
                             ${item['Name']}
                          </div>
                      </a>
                      
                      <div class="following-actions">
                          <a class="following-button" href="#">Following</a>
                      </div>
                  </div>`
                    
                      $('#following_items').prepend(userRow);
                   
                  })
      
                  // $('#company').append(options); 
                })
            } else {
              if (followingItems) {
                $('#item-following-list').val(followingItems);
                itemFollowingList = $('#item-following-list').val().split(',');
                itemFollowingList.includes(itemGuid) ? ($('#follow').attr('status', 'following'), $('#follow').text("Following"), $('#follow').addClass('follow')) : ( $('#follow').attr('status', 'not-following'),$('#follow').text("Follow"),$('#follow').removeClass('follow') );
              } else {
                $('#follow').attr('status', 'not-following')
                $('#follow').text("Follow")
              }
            }

            
          }
          
        } else {
          if (cf.Name == 'following_users' && cf.Code.startsWith(customFieldPrefix)) {
            var currentFollowing = cf.Values[0];
            console.log(`following ${currentFollowing}`)
            if (currentFollowing) {
              
              if (page == 'settings') {  //retrieve following in user settings
                var following_list = currentFollowing.split(',')
                following_list = following_list.filter(function (v) { return v.length > 5 || v != v });
                  console.log(`users ${following_list}`);
  
                  var i = 1;
                  $.each(following_list, function (index, userId)
                  {
                    getUserDetails(userId, function (user)
                    {
                        userRow = `<div class="following-row">
                        <a href="#" class="following-links">
                            <div class="following-image">
                                <img src="${user['Media'][0]['MediaUrl']}">
                            </div>
                            <div class="following-display-name">
                               ${user['DisplayName']}
                            </div>
                        </a>
                        
                        <div class="following-actions">
                            <a class="following-button" href="#">Following</a>
                        </div>
                    </div>`
                      
                        $('#following_users').prepend(userRow);
                      i++;
                    })
        
                    // $('#company').append(options); 
                  })
              }

              else {
                $('#following-list').val(currentFollowing);
                followingList = $('#following-list').val().split(',');
              }
              
            }
          }

          //for following group lists
          if (cf.Name == 'following_group' && cf.Code.startsWith(customFieldPrefix)) {
            var currentFollowingGroup = cf.Values[0];
            console.log(`following ${currentFollowingGroup}`)
            if (currentFollowingGroup ) {
              
              if (page == 'settings') {  //retrieve following in user settings
                var following_list_group = currentFollowingGroup.split(',')
                following_list_group = following_list_group.filter(function (v) { return v.length > 5 || v != v });
                  console.log(`users ${following_list_group}`);
  
                  var i = 1;
                  $.each(following_list_group, function (index, userId)
                  {
                    getUserDetails(userId, function (user)
                    {
                        userRow = `<div class="following-row">
                        <a href="#" class="following-links">
                            <div class="following-image">
                                <img src="${user['Media'][0]['MediaUrl']}">
                            </div>
                            <div class="following-display-name">
                               ${user['DisplayName']}
                            </div>
                        </a>
                        
                        <div class="following-actions">
                            <a class="following-button" href="#">Following</a>
                        </div>
                    </div>`
                      
                        $('#following_group_name').prepend(userRow);
                      i++;
                    })
        
                    // $('#company').append(options); 
                  })
              }

              else {
                $('#following-group-list').val(currentFollowingGroup);
                followingGroupList = $('#following-group-list').val().split(',');
              }
              
            }
          }  

        }
       
      })
    })
  }

  function getFollowers(page, userToFollow)
  {
    $('#followers-list').val('');
    getUserCustomFields(userToFollow, function (result)
    {
     if (result) { 
     //check following users
       $.each(result, function (index, cf)
       {
         if (cf.Name == 'followers_list' && cf.Code.startsWith(customFieldPrefix)) {
           var currentFollowers = cf.Values[0];
           console.log(`followers ${currentFollowers}`)


           if (page == 'settings') {  //retrieve followers in user settings
            var follower_list = currentFollowers.split(',')
            follower_list = follower_list.filter(function (v) { return v.length > 5 || v != v });
              console.log(`users ${follower_list}`);

              var i = 1;
              $.each(follower_list, function (index, userId)
              {
                getUserDetails(userId, function (user)
                {
                  userRow = `<div class="following-row">
                    <div class="following-image">
                    <img src="${user['Media'][0]['MediaUrl']}">
                    </div>
                    <div class="following-display-name">
                    ${user['DisplayName']}
                    </div>
                  </div>`
                  
                    $('#followers .tab-pane').prepend(userRow);
                  i++;
                })
              })
            }
           

           else {
            if (currentFollowers) {
              $('#followers-list').val(currentFollowers);
              followerList = $('#followers-list').val().split(',');
              followerList.includes(userId) ? ($('#follow').attr('status', 'following'), $('#follow').text("Following"),$('#follow').addClass('follow')) : ( $('#follow').attr('status', 'not-following'),$('#follow').text("Follow"),$('#follow').removeClass('follow') );
            } else {
              $('#follow').attr('status', 'not-following')
              $('#follow').text("Follow")
              $('#follow').removeClass('follow');
            }
          } 
         }
       })
     }
    })
  }


  function getItemFollowers(page, itemguid)
  {
    getItemCustomFields(itemguid, function (result)
    {
      if (result) {
        $.each(result, function (index, cf)
        {
          if (cf.Name == 'item_followers' && cf.Code.startsWith(customFieldPrefix)) {
            var currentFollowers = cf.Values[0];
            console.log(`followers ${currentFollowers}`)
            if (currentFollowers) {
              $('#item-followers-list').val(currentFollowers);
              itemFollowerList = $('#item-followers-list').val().split(',');
              $(".item-description .desc-sec-opt").each(function (index)
              {

                if ($(this).attr('data-code') == cf.Code) {
                  $(this).hide();
                }
                
              })
            }
          }
          
        })
      }

    })
  }
  function appendFollowButton(page)
  {
   
    let storeFrontButton = `<div class="following-button-con"><a class="following-button" id="follow" href="#" status="not-following">Follow</a></div>`
    let itemDetailButton = `<div class="following-button-con"><a class="following-button" href="#" id="follow" status="not-following">Follow</a></div>`
    var followdiv = `<div class="ordr-dtls-buyer-infoind"><div class="following-button-con"><a class="following-button" href="#" status="not-following" id="follow">Following</a></div></div>`;
   
    
    var followersDivStoreFront = `<input type="hidden" id="followers-list" >`;
    var followersDivItemDetails = `<input type="hidden" id="followers-list" >`;
    var itemFollowersDiv =`<input type="hidden" id="item-followers-list" >`;

    if (page != 'orders') {
      page == 'item' ? ($('.item-star').append(itemDetailButton), $('body').append(followersDivItemDetails),$('body').append(itemFollowersDiv) ) : ($('.store-rating').before(storeFrontButton), $('body').append(followersDivStoreFront)) ;
      getFollowers('storefront', merchantId);
      getFollowing('users');
    } else {
      $('.buyer-email').parents('.ordr-dtls-buyer-info .ordr-dtls-buyer-infoind:nth-child(2)').before(followdiv);
      $('body').append(followersDivStoreFront);
      getFollowers('orders', buyerId);
      getFollowing('users');

    }
    

  }
  
 let checkIfFollowAllowed = async (type,page) =>
  {
    console.log(`user ${type}`)
     getMarketplaceCustomFields(function (result)
     {
    
      $.each(result, function (index, cf)
      {
        var status;
        if (type == 'company') {
          isCompany = 1;
          if (cf.Name == 'allow_company_follow' && cf.Code.startsWith(customFieldPrefix)) {
            var isCompanyFollowAllowed = cf.Values[0];
            status = isCompanyFollowAllowed == 'true' ? appendFollowButton('user') : '';
            return status;
          }
        }


        if (type == 'user' && page == 'orders') {
          console.log('orders');
           if (cf.Name == 'allow_users_follow' && cf.Code.startsWith(customFieldPrefix)) {
             var isUserFollowAllowed = cf.Values[0];
             console.log('here')
             status = isUserFollowAllowed == 'true' ? appendFollowButton('orders') : '';
             console.log(status);
             return status;
           }
        }


        if (type == 'user' && page != 'orders') {
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
   
   if ($('#follow').length) {
    
   }
   
  
  }
  

  function sendDeleteEDM(itemguid)
  {
    var data = { 'itemguid': itemguid};
    var apiUrl = packagePath + '/send_delete_edm.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
      success: function (response)
      {
        $('.delete-button').click();
        
        //  callback();
            //  toastr.success('Successfully saved.');

        },
        error: function(jqXHR, status, err) {
            //   toastr.error('---');
           // callback();
        }
    });
  }
  
  $(document).ready(function ()
  {
    
    if (pathname.indexOf('user/merchantaccount') >= 0) {

      if (!$('.register-link').length && currentMerchant != userId) { // only for registered users

        var followingDivStoreFront = `<input type="hidden" id="following-list" >`;
        $('body').append(followingDivStoreFront);

        //for following groups
        var followingGroupDivStoreFront = `<input type="hidden" id="following-group-list" >`;
        $('body').append(followingGroupDivStoreFront);

        var userType;
      
        getUserCustomFields(currentMerchant, function (result)
        {

          if ( (!result) || (result == null) ) {
            userType = 'user';
          }
          // userType = !(result) || !("company_status" in result) || (result == null) ?  // no cf means not company
          //   'user'
          //   :
          else {
            $.each(result, function (index, cf)
            {
              console.log('in each')
              if (cf.Name == 'company_status' && cf.Code.startsWith(customFieldPrefix)) {
                var companyStatus = cf.Values[0];
                userType = companyStatus == 'true' ? 'company' : 'user'
                
              }
            })
          }
           
          
          checkIfFollowAllowed(userType);
        })
       
        getFollowing('users');
       
        $(document).on("click", "#follow", function ()
        {
          console.log('follow click');
          var allFollowers;
          var allFollowing;
          var allFollowingGroups;
          var userType_ = isCompany == 1 ? 'company' : 'user';
          if (followerList.length || followingList.length || followingGroupList.length) {
            console.log('if');
            followerList = followerList.filter(function (value) { return value.length > 5 })
            followingList = followingList.filter(function (value) { return value.length > 5 })
            followingGroupList = followingGroupList.filter(function (value) { return value.length > 5 })
            //unfollowing
            console.log(JSON.stringify(followerList));
            allFollowers = $('#follow').attr('status') == 'following' ? followerList.filter(function (value) { return value !== userId; })
              : [...followerList, $("#userGuid").val()];
         
            allFollowing = $('#follow').attr('status') == 'following' ? followingList.filter(function (value) { return value !== merchantId; })
              : [...followingList, merchantId];
            
            allFollowingGroups = $('#follow').attr('status') == 'following' ? followingGroupList.filter(function (value) { return value !== merchantId; })
            : [...followingGroupList, merchantId];
            
          
            saveCustomFields(allFollowers, currentMerchant, allFollowing, userType_, allFollowingGroups,'sf');
            
          } else {
            console.log('else');
            saveCustomFields(currentUser, currentMerchant, merchantId, userType_, merchantId,'sf');
            
          }
         

        });
      }
    }

    if (pathname.indexOf('user/item/detail') >= 0) {

      if ( (!$('.register-link').length) && (currentMerchant != userId)) {

        checkIfFollowAllowed('item');

        var itemFollowingDiv = `<input type="hidden" id="item-following-list" >`;
        $('body').append(itemFollowingDiv);

        getFollowing('items');

        getItemFollowers('items', itemGuid);

        $(document).on("click", "#follow", function ()
        {
          console.log('follow click');
          var allItems;
          var allItemFollowers;

          if (itemFollowerList.length) {
              allItemFollowers =  $('#follow').attr('status') == 'following' ? itemFollowerList.filter(function (value) { return value !== userId; })
              : [...itemFollowerList, userId];
          } else {
            allItemFollowers = userId;
          }

          if (itemFollowingList.length) {
            console.log('if');
            itemFollowingList = itemFollowingList.filter(function (value) { return value.length > 5 })
            console.log(JSON.stringify(itemFollowingList));

            allItems = $('#follow').attr('status') == 'following' ? itemFollowingList.filter(function (value) { return value !== itemGuid; })
              : [...itemFollowingList, itemGuid];
            
            
           
            saveItemCustomFields(allItems, itemGuid, allItemFollowers);
           // $('#follow').attr('status', 'not-following')
            //$('#follow').attr('status', 'not-following')
          } else {
            saveItemCustomFields(itemGuid, userId, allItemFollowers);
          }

        });
      }
    }

    //merchant settings
    if (pathname.indexOf('/user/marketplace/seller-settings') > -1 || pathname.indexOf('/user/marketplace/be-seller') > -1 || pathname.indexOf('/user/marketplace/user-settings') > -1) {
      
      //add new tab for following - followers
      var followingTab = `<li><a href="#following" aria-expanded="true" id ="following-tab"> <span> FOLLOWING </span></a> </li>`
      var followersTab = `<li><a href="#followers" aria-expanded="true" id ="followers-tab"> <span>  FOLLOWERS </span></a> </li>`
     
      $('#setting-tab').append(followingTab, followersTab);

      // add the tab contents
      var groupName;
      getMarketplaceCustomFields(function (result)
      {
        $.each(result, function (index, cf)
        {
          if (cf.Name == 'group_name' && cf.Code.startsWith(customFieldPrefix)) {
            groupName = cf.Values[0];
            $('#group-name').text(groupName);
          }
          
        })
      })

      var followingContents = `<div class="tab-pane fade" id="following">
      <div class="container">
          <div class="following-plug-container">
              <ul class="nav nav-tabs text-center" id="following_group-tab">
                  <li class="active">
                      <a data-toggle="tab" href="#following_group_name" aria-expanded="true">
                          <span id ="group-name">
                           <group name>
                          </span>
                      </a>
                  </li>
                  <li class="">
                      <a data-toggle="tab" href="#following_users" aria-expanded="true">
                          <span>
                              USERS
                          </span>
                      </a>
                  </li>
                  <li class="">
                      <a data-toggle="tab" href="#following_items" aria-expanded="true">
                          <span>
                              ITEMS
                          </span>
                      </a>
                  </li>

              </ul>
              <div class="tab-pane fade active in" id="following_group_name">
                
                  <div class="sellritemlst-btm-pgnav">
                      <ul class="pagination">
                          <li> <a href="#" aria-label="Previous"> <span aria-hidden="true"><i class="glyphicon glyphicon-chevron-left"></i></span> </a> </li>
                          <li class="active"><a href="#">1</a></li>
                          <li><a href="#">2</a></li>
                          <li><a href="#">3</a></li>
                          <li><a href="#">4</a></li>
                          <li><a href="#">5</a></li>
                          <li> <a href="#" aria-label="Next"> <span aria-hidden="true"><i class="glyphicon glyphicon-chevron-right"></i></span> </a> </li>
                      </ul>
                  </div>
              </div>
              <div class="tab-pane fade" id="following_users">
                 
                  <div class="sellritemlst-btm-pgnav">
                      <ul class="pagination">
                          <li> <a href="#" aria-label="Previous"> <span aria-hidden="true"><i class="glyphicon glyphicon-chevron-left"></i></span> </a> </li>
                          <li class="active"><a href="#">1</a></li>
                          <li><a href="#">2</a></li>
                          <li><a href="#">3</a></li>
                          <li><a href="#">4</a></li>
                          <li><a href="#">5</a></li>
                          <li> <a href="#" aria-label="Next"> <span aria-hidden="true"><i class="glyphicon glyphicon-chevron-right"></i></span> </a> </li>
                      </ul>
                  </div>
              </div>
              <div class="tab-pane fade" id="following_items">
                  
                  <div class="sellritemlst-btm-pgnav">
                      <ul class="pagination">
                          <li> <a href="#" aria-label="Previous"> <span aria-hidden="true"><i class="glyphicon glyphicon-chevron-left"></i></span> </a> </li>
                          <li class="active"><a href="#">1</a></li>
                          <li><a href="#">2</a></li>
                          <li><a href="#">3</a></li>
                          <li><a href="#">4</a></li>
                          <li><a href="#">5</a></li>
                          <li> <a href="#" aria-label="Next"> <span aria-hidden="true"><i class="glyphicon glyphicon-chevron-right"></i></span> </a> </li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>
      </div>`

      var followerContents =  `<div class="tab-pane fade" id="followers">
      <div class="container">
          <div class="following-plug-container">

              <div class="tab-pane fade active in">
                 
                  <div class="sellritemlst-btm-pgnav">
                      <ul class="pagination">
                          <li> <a href="#" aria-label="Previous"> <span aria-hidden="true"><i class="glyphicon glyphicon-chevron-left"></i></span> </a> </li>
                          <li class="active"><a href="#">1</a></li>
                          <li><a href="#">2</a></li>
                          <li><a href="#">3</a></li>
                          <li><a href="#">4</a></li>
                          <li><a href="#">5</a></li>
                          <li> <a href="#" aria-label="Next"> <span aria-hidden="true"><i class="glyphicon glyphicon-chevron-right"></i></span> </a> </li>
                      </ul>
                  </div>
              </div>




          </div>
      </div>
      </div>`

      $('.tab-content').append(followingContents, followerContents);

      getFollowing('user', 'settings');
      getFollowing('items', 'settings');
      getFollowers('settings',userId);


      $("#following-tab").click(function(){
      
        $(this).attr("data-toggle", "tab")
   
      });
      
      $("#followers-tab").click(function(){
      
        $(this).attr("data-toggle", "tab")
   
      });

       ////Following Script
      //   $(".following-button").hover(
      //     function () {
      //         $(this).text("Remove").addClass('remove');
      //     },
      //     function () {
      //         $(this).text("Following").removeClass("remove");
      //     }
      // );

      $(".following-button").hover(function() {
        var $this = $(this);
          if($this.text() === "Following"){
            $this.text("Remove");
            $this.addClass('remove')
          }else {
            $this.text("Following");
            $this.removeClass("remove");
          }
        });



    }
    // buyer settings
    // if (pathname.indexOf('/user/marketplace/user-settings') > -1) {
    
    //merchannt order details

    if (pathname.indexOf('user/manage/order/details') >= 0) {

         //for following groups
      var followingGroupDiv = `<input type="hidden" id="following-group-list" >`;
      $('body').append(followingGroupDiv);

      var followingDivStoreFront = `<input type="hidden" id="following-list" >`;
      $('body').append(followingDivStoreFront);


      var userType;

      getOrderInfo($('#orderGuid').val());

      $(document).on("click", "#follow", function ()
        {
          console.log('follow click');
          var allFollowers;
          var allFollowing;
          var allFollowingGroups;
          var userType_ = isCompany == 1 ? 'company' : 'user';
          if (followerList.length || followingList.length || followingGroupList.length) {
            console.log('if');
            followerList = followerList.filter(function (value) { return value.length > 5 })
            followingList = followingList.filter(function (value) { return value.length > 5 })
            followingGroupList = followingGroupList.filter(function (value) { return value.length > 5 })
            //unfollowing
            console.log(JSON.stringify(followerList));
            allFollowers = $('#follow').attr('status') == 'following' ? followerList.filter(function (value) { return value !== userId; })
              : [...followerList, $("#userGuid").val()];
         
            allFollowing = $('#follow').attr('status') == 'following' ? followingList.filter(function (value) { return value !== buyerId; })
              : [...followingList, buyerId];
            
            allFollowingGroups = $('#follow').attr('status') == 'following' ? followingGroupList.filter(function (value) { return value !== buyerId; })
            : [...followingGroupList, buyerId];
            
          
            saveCustomFields(allFollowers, buyerId, allFollowing, userType_, allFollowingGroups,'orders');
            
          } else {
            console.log('else');
            saveCustomFields(currentUser, buyerId, currentUser, userType_, buyerId, 'orders');
            
          }
         

        });



  
    
    }

  
  //item deleted EDM
    if (pathname.indexOf('user/item/list') >= 0) {


      $('.item-remove-popup .btn-area .pull-right .my-btn').clone().appendTo('.item-remove-popup .btn-area .pull-right');
      $('.item-remove-popup .btn-area .pull-right .my-btn').first().addClass('delete-button');
      $('.item-remove-popup .btn-area .pull-right .my-btn').last().addClass('clone-button');
      $('.delete-button').hide();
      $('.clone-button').removeAttr('onclick');


    
      $(document).on("click", ".item-actions li:nth-child(2)", function ()
      {
        
        $('.item-remove-popup .btn-area .pull-right .my-btn').attr('data-guid', $(this).parents('.item-row').attr('data-guid'));
        console.log($(this).parents('.item-row').attr('data-guid'));


      })

      $(document).on("click", ".clone-button", function ()
      {
        
        sendDeleteEDM($(this).attr('data-guid'));

      })

    }
   

    if (pathname.indexOf('user/item/upload') >= 0) {

      $('​#category-list').find("input[type='checkbox']").click(function() {
        //if(this.checked) {

        console.log('click cb');
          waitForElement('#customFields div input', function ()
            {
              console.log('inside wait');
              $("#customFields div").each(function (index)
              {
                if ($(this).find('input').attr('data-name') == 'item_followers') {
                  $(this).hide();
                }
              })
                
                
            })
       // }
    });

     

    }

    
    

  });
})();
