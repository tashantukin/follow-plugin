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
  var timezone_offset_minutes = new Date().getTimezoneOffset();
  timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
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
  var noFollowingUsers = `${location.protocol}//${hostname}/user/plugins/${packageId}/images/empty-user.svg`;
  var noFollowingitems = `${location.protocol}//${hostname}/user/plugins/${packageId}/images/empty-item.svg`;
  var noFollowinggroups = `${location.protocol}//${hostname}/user/plugins/${packageId}/images/empty-group-name.svg`;

  var token = getCookie('webapitoken');

    function getCookie(name){
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + name + '=');
      if (parts.length === 2) {
          return parts.pop().split(';').shift();
      }
    }

  
  function paginator(items, current_page, per_page_items, tab) {
    let page = current_page || 1,
    per_page = per_page_items || 20,
    offset = (page - 1) * per_page,

    paginatedItems = items.slice(offset).slice(0, per_page_items),
      total_pages = Math.ceil(items.length / per_page);
    
    $(`#${tab} .pagination`).find('.list').remove();
    $(`#${tab}`).find('.following-row').remove();
    
    if (tab == "followers") {
      $.each(paginatedItems, function (index, userId)
      {
        getUserDetails(userId, function (user)
        {
          userRow = `<div class="following-row" data-guid="${user['ID']}">
            <div class="following-image">
            <img src="${user['Media'][0]['MediaUrl']}">
            </div>
            <div class="following-display-name">
            ${user['DisplayName']}
            </div>
          </div>`
          
            $(`#${tab} .tab-pane .following-row-scroll`).prepend(userRow);
          // i++;
        })
      })
    }

    if (tab == 'following_items') {
      
      $.each(paginatedItems, function (index, itemId)
      {
        getItemDetails(itemId, function (item)
        {
          var itemName = item['Name'].replace(" ", "-").trim();
            userRow = `<div class="following-row" data-guid="${item['ID']}">
            <a href="/user/item/detail/${itemName}/${item['ID']}" class="following-links">
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
          
            $(`#${tab} .following-row-scroll`).prepend(userRow);
         
        })
      })

    }

    if (tab == 'following_users') {
      $.each(paginatedItems, function (index, userId)
      {
        getUserDetails(userId, function (user)
        {
            userRow = `<div class="following-row" data-guid="${user['ID']}"s>
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
          
            $(`#${tab} .following-row-scroll`).prepend(userRow);
        //  i++;
        })

        // $('#company').append(options); 
      })
    }

    if (tab == 'following_group_name') {
      $.each(paginatedItems, function (index, userId)
      {
        getUserDetails(userId, function (user)
        {
            userRow = `<div class="following-row" data-guid="${user['ID']}">
            <a href="#" class="following-links">s
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
          
            $(`#${tab} .following-row-scroll`).prepend(userRow);
         // i++;
        })

      })

    }
   
    var i = 1;
    var pagination_list= "";
    while (i <= total_pages) {
      if (i == 1) {

        pagination_list += `<li class="active list" id="first-page" indx= ${i}><a href="#">${i}</a></li>`; 
      } else {
        pagination_list += `<li indx= ${i} class="list"><a href="#">${i}</a></li>`
      }
      i++;
    }
    console.log(`pages ${pagination_list} `)
    $(`#${tab} .pagination li`).last().before(pagination_list);


    return {
        page: page,
        per_page: per_page,
        pre_page: page - 1 ? page - 1 : null,
        next_page: (total_pages > page) ? page + 1 : null,
        total: items.length,
        total_pages: total_pages,
        data: paginatedItems
    };
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

  function  getMerchantCustomFields(merchantGuid,callback) {
		var apiUrl = packagePath + '/get_merchant_customfields.php';
		var data = { 'userId': merchantGuid };
		$.ajax({
			url: apiUrl,
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function (response)
			{
				//console.log(JSON.stringify(response));
				custom = $.parseJSON(response);
				//console.log($.parseJSON(response));
				if (custom) {
					callback(custom.result.CustomFields);
				}
			}
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
      console.log(type);
      //check following users
      $.each(result, function (index, cf)
      {
        console.log(type);
        if (type == 'items') {
          console.log(type);
          console.log('type items');
          if (cf.Name == 'following_items' && cf.Code.startsWith(customFieldPrefix)) {
            var followingItems = cf.Values[0];
            $('#following-item-list').val(followingItems);
            console.log(`following items ${followingItems}`)

            if (page == 'settings') {  //retrieve following in user settings
              var item_list = followingItems.split(',');
              item_list = item_list.filter(function (v) { return v.length > 5 || v != v });
                console.log(`items ${item_list}`);
              paginator(item_list, 1, 20, 'following_items');
             
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
            $('#following-user-list').val(currentFollowing);
            console.log(`following ${currentFollowing}`)
            if (currentFollowing) {
              
              if (page == 'settings') {  //retrieve following in user settings
                var following_list = currentFollowing.split(',')
                following_list = following_list.filter(function (v) { return v.length > 5 || v != v });
                  console.log(`users ${following_list}`);
  
                 // var i = 1;
                paginator(following_list, 1, 20,'following_users')
              }

              else {
                if ($('#following-list').length) {
                  $('#following-list').val(currentFollowing);
                  followingList = $('#following-list').val().split(',');
                }
              }
              
            }
          }

          //for following group lists
          if (cf.Name == 'following_group' && cf.Code.startsWith(customFieldPrefix)) {
            var currentFollowingGroup = cf.Values[0];
            $('#following-group-list').val(currentFollowingGroup);
            console.log(`following ${currentFollowingGroup}`)
            if (currentFollowingGroup ) {
              
              if (page == 'settings') {  //retrieve following in user settings
                var following_list_group = currentFollowingGroup.split(',')
                following_list_group = following_list_group.filter(function (v) { return v.length > 5 || v != v });
                  console.log(`users ${following_list_group}`);
  
                  //var i = 1;
                paginator(following_list_group, 1, 20, 'following_group_name');
              }

              else {
                if ($('#following-group-list').length) {
                  $('#following-group-list').val(currentFollowingGroup);
                  followingGroupList = $('#following-group-list').val().split(',');
                }
               
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
    getMerchantCustomFields(userToFollow, function (result)
    {
     if (result) { 
     //check following users
       $.each(result, function (index, cf)
       {
         if (cf.Name == 'followers_list' && cf.Code.startsWith(customFieldPrefix)) {
           var currentFollowers = cf.Values[0];
           $('#followers-list').val(currentFollowers);
           console.log(`followers ${currentFollowers}`)


           if (page == 'settings') {  //retrieve followers in user settings
            var follower_list = currentFollowers.split(',')
             follower_list = follower_list.filter(function (v) { return v.length > 5 || v != v });
             
             paginator(follower_list, 1, 20,'followers')
              
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
     // setTimeout(function() {	
      if (result) {
        $.each(result, function (index, cf)
        {
          if (cf.Name == 'item_followers' && cf.Code.startsWith(customFieldPrefix)) {
            var currentFollowers = cf.Values[0];
            console.log(`followers ${currentFollowers}`)
            if (currentFollowers) {
              $('#item-followers-list').val(currentFollowers);


              setTimeout(function() {	
                itemFollowerList = $('#item-followers-list').val().split(',');
            
              $(".item-description .desc-sec-opt").each(function (index)
              {

                if ($(this).attr('data-code') == cf.Code) {
                  $(this).hide();
                }
                
              })
                
            }, 1000);
            }
          }
          
        })
      }

      })
   // }, 500);
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

  function sendViewEDM(itemguid)
  {
    var data = { 'itemguid': itemguid};
    var apiUrl = packagePath + '/send_view_edm.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
      success: function (response)
      {
       

        //  callback();
            //  toastr.success('Successfully saved.');

        },
        error: function(jqXHR, status, err) {
            //   toastr.error('---');
           // callback();
        }
    });
  }

  function sendPurchaseEDM()
  {
    //var data = { 'itemguid': itemguid};
    var apiUrl = packagePath + '/send_purchase_edm.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
      //  data: JSON.stringify(data),
      success: function (response)
      {
       
        //  callback();
            //  toastr.success('Successfully saved.');

      },
        error: function(jqXHR, status, err) {
            //   toastr.error('---');
           // callback();
        }
    });
  }

  function sendLoggedInEDM()
  {
    var data = { 'timezone':  timezone_offset_minutes};
    var apiUrl = packagePath + '/send_login_edm.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
       data: JSON.stringify(data),
      success: function (response)
      {
       
        //  callback();
            //  toastr.success('Successfully saved.');

      },
        error: function(jqXHR, status, err) {
            //   toastr.error('---');
           // callback();
        }
    });
  }

  function unFollow(userId, unFollowedId, allFollowing, type)
  {
    var data  = { 'user-id' : userId, 'unfollowed-user' : unFollowedId, 'following-list' : allFollowing, type}  
		//console.log(data);
		var apiUrl = packagePath + '/unfollow_user.php';
		$.ajax({
			url: apiUrl,
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function (response)
			{

        console.log(response);
       // getFollowing('items');
       // loadCustomFields(merchantId,'');

			},
			error: function (jqXHR, status, err)
			{
				// toastr.error('---');
			}
		});
   
  }

  $(document).ready(function ()
  {
    
    //send edm if the user is logged in 

  
    if ($('#userGuid').length) {

      var isloggedIn = sessionStorage.getItem("isLoggedIn");
      
      if (isloggedIn != '1') {
        console.log('isloggedin');

        sendLoggedInEDM();

        sessionStorage.setItem("isLoggedIn", "1");
      }
    
    }
    // Retrieve
       
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
       
        getFollowing('users','storefront');
       
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

      if ((!$('.register-link').length) && (currentMerchant != userId)) {
        

        //send edm if the buyer view an item
        sendViewEDM(itemGuid);

        checkIfFollowAllowed('item');

        var itemFollowingDiv = `<input type="hidden" id="item-following-list" >`;
        $('body').append(itemFollowingDiv);

        waitForElement('#item-following-list', function ()
        {
          getFollowing('items');

          getItemFollowers('items', itemGuid);
        })


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

      $('body').append(`<input type="hidden" id="followers-list" >`)
      $('body').append(`<input type="hidden" id="following-item-list" >`)
      $('body').append(`<input type="hidden" id="following-user-list" >`)
      $('body').append(`<input type="hidden" id="following-group-list">`)

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
                      <a data-toggle="tab" href="#following_group_name" aria-expanded="true" id="group-tab">
                          <span id ="group-name">
                           <group name>
                          </span>
                      </a>
                  </li>
                  <li class="">
                      <a data-toggle="tab" href="#following_users" aria-expanded="true" id="user-tab">
                          <span>
                              USERS
                          </span>
                      </a>
                  </li>
                  <li class="">
                      <a data-toggle="tab" href="#following_items" aria-expanded="true" id="item-tab">
                          <span>
                              ITEMS
                          </span>
                      </a>
                  </li>

              </ul>
              <div class="tab-pane fade active in" id="following_group_name">
              <div class="following-row-scroll">

              </div>
                  <div class="sellritemlst-btm-pgnav">
                      <ul class="pagination">
                          <li> <a href="#" aria-label="Previous" id="previous"> <span aria-hidden="true"><i class="glyphicon glyphicon-chevron-left"></i></span> </a> </li>
                          
                         
                          <li> <a href="#" aria-label="Next"> <span aria-hidden="true"><i class="glyphicon glyphicon-chevron-right"></i></span> </a> </li>
                      </ul>
                  </div>
              </div>
              <div class="tab-pane fade" id="following_users">
                  <div class="following-row-scroll">
                
                  </div>
                  <div class="sellritemlst-btm-pgnav">
                      <ul class="pagination">
                          <li> <a href="#" aria-label="Previous"id="previous"> <span aria-hidden="true"><i class="glyphicon glyphicon-chevron-left"></i></span> </a> </li>
                         
                          <li> <a href="#" aria-label="Next" id="next"> <span aria-hidden="true"><i class="glyphicon glyphicon-chevron-right"></i></span> </a> </li>
                      </ul>
                  </div>
              </div>
              <div class="tab-pane fade" id="following_items">
              <div class="following-row-scroll">
                
              </div>
                  <div class="sellritemlst-btm-pgnav">
                      <ul class="pagination">
                          <li> <a href="#" aria-label="Previous" id="previous"> <span aria-hidden="true"><i class="glyphicon glyphicon-chevron-left"></i></span> </a> </li>
                         
                          <li> <a href="#" aria-label="Next" id="next"> <span aria-hidden="true"><i class="glyphicon glyphicon-chevron-right"></i></span> </a> </li>
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
              <div class="following-row-scroll">
                
              </div>
                  <div class="sellritemlst-btm-pgnav">
                      <ul class="pagination">
                          <li> <a href="#" aria-label="Previous" id="previous"> <span aria-hidden="true"><i class="glyphicon glyphicon-chevron-left"></i></span> </a> </li>
                         
                          <li> <a href="#" aria-label="Next" id="next"> <span aria-hidden="true"><i class="glyphicon glyphicon-chevron-right"></i></span> </a> </li>
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

    
        $(document).on("mouseover", ".following-button" , function() {
        var $this = $(this);
          if($this.text() === "Following"){
            $this.text("Remove");
            $this.addClass('remove')
          }else if ($this.text() === "Follow") {
            $this.text("Follow");
           
          } else {
            $this.text("Following");
            $this.removeClass('remove')
          }
      });
      

      $(document).on("click", ".pagination li" , function() {
       //$(".pagination li").click(function(){
        console.log('li click');
        
      
         var tab = ($(this).parents('.tab-pane').attr('id'));
       //  $(this).parents('.tab-pane').find('.following-row').remove();
         if (tab == 'followers') {
         
          paginator($('#followers-list').val().split(','), parseInt($(this).attr('indx')), 20, tab)
         }

         if (tab == 'following_items') {
         
           paginator($('#following-item-list').val().split(','), parseInt($(this).attr('indx')), 20, tab)
           
         }
         if (tab == 'following_users') {
          paginator($('#following-user-list').val().split(','), parseInt($(this).attr('indx')), 20,tab)
         }
         if (tab == 'following_group_name') {
          paginator($('#following-group-list').val().split(','), parseInt($(this).attr('indx')), 20, tab)
         }
        
      })

      $(document).on("click", "#following-tab", function ()
      {
        if (!$('#following_group_name .following-row').length) {
          var noFollowingContent = `<div class="following-row">
          <div class="empty-msg">
              <div><img src="${noFollowinggroups}"></div>
              <div class="nothing-to-see-mgs">Nothing to see here.</div>
              </div>
          </div>`;
          $('#following_group_name').append(noFollowingContent);
          $('#following_group_name .pagination').hide();

        }

      })

      $(document).on("click", "#group-tab", function ()
      {
        if (!$('#following_group_name .following-row').length) {
          var noFollowingContent = `<div class="following-row">
          <div class="empty-msg">
              <div><img src="${noFollowinggroups}"></div>
              <div class="nothing-to-see-mgs">Nothing to see here.</div>
              </div>
          </div>`;
          $('#following_group_name').append(noFollowingContent);
          $('#following_group_name .pagination').hide();

        }
      })

      $(document).on("click", "#user-tab", function ()
      {
        if (!$('#following_users .following-row').length) {
          var noFollowingContent = `<div class="following-row">
          <div class="empty-msg">
              <div><img src="${noFollowingUsers}"></div>
              <div class="nothing-to-see-mgs">Nothing to see here.</div>
              </div>
          </div>`;
          $('#following_users').append(noFollowingContent);
          $('#following_users .pagination').hide();
        
        }

        
      })

      $(document).on("click", "#item-tab", function ()
      {
        if (!$('#following_items .following-row').length) {
          var noFollowingContent = `<div class="following-row">
          <div class="empty-msg">
              <div><img src="${noFollowingitems}"></div>
              <div class="nothing-to-see-mgs">Nothing to see here.</div>
              </div>
          </div>`;
          $('#following_items').append(noFollowingContent);
          $('#following_items .pagination').hide();

        }
      })


      //remove button 
      $(document).on("click", ".remove", function ()
      {
        $(this).removeClass('remove').addClass('follow');
        $(this).text('Follow');
        var refId = $(this).parents('.following-row').attr('data-guid');
        var refType = ($(this).parents('.tab-pane').attr('id'));

        if (refType == 'following_users') {
          var followingUsers = $('#following-user-list').val().split(',');
          followingUsers = followingUsers.filter(function (value) { return value !== refId; })
          $('#following-user-list').val(followingUsers);
          unFollow(userId, refId, followingUsers, 'users')
        }

        if (refType == 'following_group_name') {
          var followingUsers = $('#following-group-list').val().split(',');
          followingUsers = followingUsers.filter(function (value) { return value !== refId; })
          unFollow(userId, refId, followingUsers, 'group')
          $('#following-group-list').val(followingUsers)
        }

        if (refType == 'following_items') {
          var followingItems = $('#following-item-list').val().split(',');
          followingItems = followingItems.filter(function (value) { return value !== refId; })
          unFollow(userId, refId, followingItems, 'items')
          $('#following-item-list').val(followingItems);
        }

      
      })


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

    if (pathname.indexOf('user/checkout/success') >= 0) {
      sendPurchaseEDM();
    }

 
  });
})();
