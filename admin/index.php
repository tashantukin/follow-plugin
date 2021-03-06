<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="css/settings.css">
<link rel="stylesheet" href="css/templates.css">
<div class="col-sm-9 main-content">
    <!-- <div class="page-content page-layout">
        <div class="gutter-wrapper">
            <div class="page-topnav" style="height: 5px;">
                <div class="float">

                </div>
            </div>
            <div class="panel-box">

                <div class="login-list-item">
                    <div class="row">
                        <div class="col-md-10 col-sm-10">
                            <h3>Follow a Marketplace
                            

                            </h3>
                            

                        </div>


                    </div>
                </div>
            </div>

            <div class=" panel-box verified-item-form variants-section">
                <form name="verified-item-form" id="verified-item-form" action="#">
                    <div class="form-area">
                        <div class="form-element ">
                            <label>By default, all companies can be followed: </label>
                            <div class="cmn-form-radio">
                                <div class="radio-inline">
                                    <label><input type="radio" id="" name="follow-company" checked="" value="0"
                                            data-name="Company"><span>No</span></label>
                                </div>
                                <div class="radio-inline">
                                    <label><input type="radio" id="" name="follow-company" value="1"
                                            data-name="Company"><span>Yes</span></label>
                                </div>
                            </div>
                        </div>
                        <div class="form-element ">
                            <label>By default, all users can be followed: </label>
                            <div class="cmn-form-radio">
                                <div class="radio-inline">
                                    <label><input type="radio" id="" name="follow-users" checked="" value="0"
                                            data-name="Users"><span>No</span></label>
                                </div>
                                <div class="radio-inline">
                                    <label><input type="radio" id="" name="follow-users" value="1"
                                            data-name="Users"><span>Yes</span></label>
                                </div>
                            </div>
                        </div>

                        <div class="form-element ">
                            <label>By default, items can be followed: </label>
                            <div class="cmn-form-radio">
                                <div class="radio-inline">
                                    <label><input type="radio" id="" name="follow-items" checked="" value="0"
                                            data-name="items"><span>No</span></label>
                                </div>
                                <div class="radio-inline">
                                    <label><input type="radio" id="" name="follow-items" value="1"
                                            data-name="items"><span>Yes</span></label>
                                </div>
                            </div>
                        </div>


                    </div>
                </form>
            </div>
        </div>
    </div> -->

    <div class="page-content" id="followers">
        <div class="gutter-wrapper" >
            <div class="panel-box">
                <div class="page-content-top">
                    <div>
                        <h4>Followers Plug-in</h4>
                        <p>Enable users of your marketplace to follow other users or items. Buyers can follow sellers or
                            products from a merchant???s storefront.</p>
                        <p>In addition, you can add users to a group. This is commonly used to indicate that those
                            sellers are part of a company.</p>
                        <p>From the admin portal, toggle on or off to control whether this group, all users or items as
                            a whole can be followed.</p>
                    </div>
                </div>
                <div class="panel-info-body-white panel-add-group">
                    <div class="form-group">
                        <label for="" class="form-label">Group Name</label>
                        <form class="form-inline form-follower-group">
                            <input type="text" value="" id="group-name" name="group-name"
                                class="required mr-5 form-control style-square input-width-400">
                            <button class="blue-btn v-align-center" type="submit" id="field_add">Save</button>
                        </form>

                    </div>
                </div>

            </div>

            <div class="panel-box">
                <div class="followers-mid-sec list-follower-group">
                    <div class="form-group">
                        <label class="form-label">All <span id="change-group-name">hello</span> can be followed</label>
                        <div class="follower-act">
                            <div class="onoffswitch yn">
                                <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox"
                                    id="all-group-followed" data-name="Company">
                                <label class="onoffswitch-label" for="all-group-followed"> <span
                                        class="onoffswitch-inner"></span> <span class="onoffswitch-switch"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">All Users can be followed</label>
                        <div class="follower-act">
                            <div class="onoffswitch yn">
                                <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox"
                                    id="user-followed" data-name="Users">
                                <label class="onoffswitch-label" for="user-followed"> <span
                                        class="onoffswitch-inner"></span> <span class="onoffswitch-switch"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">All Items can be followed</label>
                        <div class="follower-act">
                            <div class="onoffswitch yn">
                                <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox"
                                    id="item-followed" data-name="items">
                                <label class="onoffswitch-label" for="item-followed"> <span
                                        class="onoffswitch-inner"></span> <span class="onoffswitch-switch"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>

        </div>
        <!-- <div class="clearfix"></div>

        <div>
            <p>Email templates</p>
          </div>
          <div class="private-setting-switch">
            <a href="create_page.php" class="blue-btn">Create New Template</a>
          </div>
        </div>
      </div> -->
  <!-- ORDERS -->

  <!-- <div class="div" id="app">
  <div class="panel-box panel-style-ab" >
        <div class="panel-box-title">
            <h3>Seller</h3>
            <div class="pull-right"><a class="panel-toggle" href="javascript:void(0);"><i class="icon icon-toggle"></i></a></div>
            <div class="clearfix"></div>
        </div>
        <div class="panel-box-content">
            <ul>
                <li v-for="template in sellerTemplates">
                    <h5> {{template['title']}}</h5>
                    <p>{{template['description']}}</p>
                    <a class="action-edit-template" :href="'edit_content.php?pageid=' + template.Id"  :id="template.Id">Edit</a>
                </li>
            </ul>
        </div>
    </div> -->

    <!-- PAYMENTS -->
    <!-- <div class="panel-box panel-style-ab">
        <div class="panel-box-title">
            <h3>Buyer</h3>
            <div class="pull-right"><a class="panel-toggle" href="javascript:void(0);"><i class="icon icon-toggle"></i></a></div>
            <div class="clearfix"></div>
        </div>
        <div class="panel-box-content">
            <ul>
                <li v-for="template in buyerTemplates">
                    <h5> {{template['title']}}</h5>
                    <p>{{template['description']}}</p>
                    <a class="action-edit-template" :href="'edit_content.php?pageid=' + template.Id"  :id="template.Id">Edit</a>
                </li>
            </ul>
        </div>
    </div> -->

 <!-- SHIPPING -->
 <!-- <div class="panel-box panel-style-ab">
        <div class="panel-box-title">
            <h3>Items</h3>
            <div class="pull-right"><a class="panel-toggle" href="javascript:void(0);"><i class="icon icon-toggle"></i></a></div>
            <div class="clearfix"></div>
        </div>
        <div class="panel-box-content">
            <ul>
                <li v-for="template in itemsTemplates">
                    <h5> {{template['title']}}</h5>
                    <p>{{template['description']}}</p>
                    <a class="action-edit-template" :href="'edit_content.php?pageid=' + template.Id"  :id="template.Id">Edit</a>
                </li>
            </ul>
        </div>
    </div>

  </div> -->
    

    </div>
<!-- </div> -->
<!-- begin footer -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.js"></script>
<script type="text/javascript" src="scripts/package.js"></script>

<script>
    function string_to_slug(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ?? for n, etc
        var from = "??????????????????????????????????????????????/_,:;";
        var to = "aaaaeeeeiiiioooouuuunc------";
        for (var i = 0, l = from.length; i < l; i++)
        {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    $(document).ready(function () {

        $(document).on('submit', '.form-follower-group', function (e) {
            e.preventDefault();

            $group_name = $('.form-follower-group #group-name');
            $group_name.removeClass('error-con');
            if (!$.trim($group_name.val()))
            {
                $group_name.addClass('error-con');
                return;
            }
            var slug = string_to_slug($group_name.val());
            /* $('.list-follower-group').append(`<div class="form-group">
                     <label class="form-label">`+$.trim($group_name.val())+`</label>
                     <div class="follower-act">
                         <div class="onoffswitch yn">
                             <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="`+slug+`" checked="checked">
                             <label class="onoffswitch-label" for="`+slug+`"> <span class="onoffswitch-inner"></span> <span class="onoffswitch-switch"></span> </label>
                         </div>
                     </div>
                 </div>`);
             */
            $('.followers-mid-sec .form-group #change-group-name').text(slug);
            $group_name.val('');
        })


        jQuery('.editbutton').click(function() {
        var page_id = $(this).parents('tr').find('#filename').text();
        console.log(page_id);
        $('.record_id').val(page_id);

        jQuery('#SendCustomMethod').show();
        jQuery('#cover').show();
        });

        jQuery('#popup_sendMail').click(function() {

            jQuery('#SendCustomMethod').hide();
            jQuery('#cover').hide();
        });


        jQuery('#popup_btncancel,.close-popup').click(function() {
            jQuery('#SendCustomMethod').hide();
            jQuery('#cover').hide();
        });
    
    });
</script>
<!-- end footer -->