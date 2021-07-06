<title>Template Create</title>

<!-- begin header -->
<script src="https://cdn.ckeditor.com/4.11.4/full/ckeditor.js"></script>
<!-- package css-->
<link href="css/settings.css" rel="stylesheet" type="text/css">
<link href="css/templates.css" rel="stylesheet" type="text/css">

<!-- <link href="css/email-template.css" rel="stylesheet" type="text/css"> -->
<!-- <link href="css/style.css" rel="stylesheet" type="text/css"> -->
<style type="text/css">
  #cke_50_label,
  #cke_51_label,
  #cke_52_label,
  #cke_53_label {
    display: inline !important;
    /*show the text label*/
  }
</style>

<!-- end header -->
<div class="page-content email-template-edit-page email-plugin">
  <div class="gutter-wrapper">
    <form>
      <div class="panel-box">
        <div class="page-content-top">
          <div> <i class="icon icon-pages icon-3x"></i> </div>
          <div>
            <span>Add new Email Template to your marketplace</span>
          </div>
          <div class="private-setting-switch">
            <span class="grey-btn btn_delete_act">Cancel</span>
            <a href="#" class="save-btn" id="save">Save</a>
          </div>
        </div>
      </div>

      <div class="row pgcreate-frmsec">
        <div class="col-md-8 pgcreate-frm-l ">
          <div class="panel-box">
            <div class="pgcreate-frmarea form-area box-email-template">
              <div class="row">
                <!-- <div class="col-md-7"> -->
                <div class="col-md-12">
                <div class="row">
                
                <div class="form-group form-group-border col-sm-8">
                      <label class="">Template Title  :</label>
                      <input class="form-control" type="text" name="pg_title" id="title" required="" maxlength="65">
                    </div>

                    <div class="col-sm-4 text-right"><a href="javascript:void(0)" onclick="$('.group-cc-bcc').hasClass('hide') ? $('.group-cc-bcc').removeClass('hide') : $('.group-cc-bcc').addClass('hide');" class="mybtn-default show-hide-bcc-cc-btn">Show Cc / Bcc</a></div>
                  
                </div>
                    
                   
                    <div class="form-group form-group-border">
                      <label>Email Subject  :</label>
                      <input type="text" class="form-control required" name="subject" id="subject" value="">
                    </div>
                    <div class="form-group form-group-border">
                        <label class="">Description  :</label>
                        <input class="form-control" type="text" name="pg_title" id="description" required="" maxlength="100">
                    </div>

                    <div class="group-cc-bcc hide">
                      <div class="form-group form-group-border">
                      <label><span>Cc</span> : </label> 
                      <input type="text" name="cc_email" id="cc_email" data-original-database-value="" class="form-control"></div> 
                      
                      <div class="form-group form-group-border"><label><span>Bcc</span> : </label> <input type="text" name="bcc_email" id="bcc_email" data-original-database-value="" class="form-control">
                  </div>
                  
                  </div>
                      
                    <div class="form-group form-group-border email-type">
                        <label class="">Email Type</label>
                        <div class="parameter-drop-down">
                            <select class="form-group custom-blue" id="email-type">
                                <option value="Seller" selected="">Seller</option>
                                <option value="Buyer">Buyer</option>
                                <option value="Items">Items</option>
                                
                            </select>
                        </div>
                    </div>
                                    
                             
                  </div>
                  <!-- <div class="form-group ">
                    <label class="">Template Title</label>
                    <input class="form-control" type="text" name="pg_title" id="title" required maxlength="65" />

                    <div class="form-group">
                    <label>Email Subject</label>
                    <input type="text" class="form-control required" name="subject" id="subject" value="">
                    </div>

                    <label class="">Description</label>
                    <input class="form-control" type="text" name="pg_title" id="description" required maxlength="100" />

                  </div> -->
                </div>


                <div class="col-md-12">
                  <label class="">Content</label> <br>
                  <textarea class="ckeditor" name="editor1" id="editor1"></textarea required>
                        </div>  
                        <div class="clearfix"></div>
                        </div>
                    </div>

                </div>

                <div class="col-sm-4">
                    <div id="parameter-options" class="panel-box box-email-sidebar" onchange="email_parameter_opt(this)">
                        <div class="cut-out">
                            <div class="panel-box-title">
                                <h3>Email Parameter<i class="blue-info-icon"><a href="https://support.arcadier.com/hc/en-us/articles/360005436973-Email-Dynamic-Perimeter-Definitions" target="_blank"></a></i></h3>
                                <p>Arcadier allows you to customise your emails with the dynamic parameters listed below</p>
                            </div>
                            <div class="parameter-drop-down">
                                <select class="form-group custom-blue">
                                    <!-- <option value="Admin" selected>Admin</option> -->
                                    <option value="Consumer" selected="">Consumer</option>
                                    <option value="General">General</option>
                                    <option value="Items">Items</option>
                                    <option value="Marketplace">Marketplace</option>
                                    <option value="Merchant">Merchant</option>
                                    <option value="Order">Order</option>
                                    <!-- <option value="Pricing">Pricing</option> -->
                                </select>
                            </div>
                        </div>
                        <div class="panel-box-content top-remove">
                            <ul id="admin-options" class="dynamic-vars relative-height display-none" style="height: 555px;">
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ AdminContact }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ AdminEmail }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ AdminFullName }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ AdminName}} "></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ EmailFromDomain }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ SupportEmail}} "></li>
                            </ul>
                            <ul id="consumer-options" class="dynamic-vars relative-height " style="height: 555px;">
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ ConsumerAddress }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ ConsumerContact }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ ConsumerEmail }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ ConsumerFirstName }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ ConsumerLastName }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ ConsumerLoginID }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ DeliveryAddress }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ DeliveryMethod }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ DeliveryMethodName }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ AddressLine1 }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ AddressLine2 }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ AddressState }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ AddressCity }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ AddressCountry }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ AddressPostcode }}"></li>
                            </ul>
                            <ul id="general-options" class="dynamic-vars relative-height display-none" style="height: 555px;">
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ ArcadierURL }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ CurrencyCode }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ ReturnUrl }}"></li>
                            </ul>
                            <ul id="items-options" class="dynamic-vars relative-height display-none" style="height: 555px;">
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ AddOns }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ ImageUrl }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ ItemName }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ ItemPrice }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ ItemPriceUnit }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ ItemPriceUnitPlural }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ ItemSubtotal }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ Variants }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ VariantsDetail }}"></li>
                            </ul>
                            <ul id="marketplace-options" class="dynamic-vars relative-height display-none" style="height: 555px;">
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ Logo }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ MarketDomain }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ MarketName }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ MarketplaceUrl }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ MarketEmail }}"></li>
                            </ul>
                            <ul id="merchant-options" class="dynamic-vars relative-height display-none" style="height: 555px;">
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ SellerDisplayName }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ SellerEmail }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ SellerName }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ SubAccountEmail }}"></li>
                            </ul>
                            <ul id="order-options" class="dynamic-vars relative-height display-none" style="height: 555px;">
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ InvoiceNo }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ OrderHistoryUrl }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ OrderID }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ OrderItem }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ OrderItemsString }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ Paid }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ Quantity }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ Timestamp }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ SubTotal }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ Total }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ GrandTotal }}"></li>
                        
                            </ul>
                            <ul id="pricing-options" class="dynamic-vars relative-height display-none" style="height: 555px;">
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ DeliveryPrice }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ FreightCost }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ ShippingCost }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ SubTotal }}"></li>
                                <li><input class="btn-dynamic-var" onclick="higlightAll(this)" readonly="" value="{{ Total }}"></li>
                            </ul>
                            
                        </div>
                    </div>
                </div>
                <div class="panel-box">

                  <!-- <input type = "button" value= 'try'id="insert-there" >   -->
      </div>

  </div>
 

</div>
<div class="clearfix"></div>
</div>
</form>
</div>
</div>
</div>
<div class="clearfix"></div>

<div class="popup  popup-area popup-delete-confirm " id="DeleteCustomMethod">
  <div class="wrapper"> <span class="close-popup"><img src="images/cross-icon.svg"></span>
    <div class="content-area">
      <p>Are you sure you want to cancel this?</p>
    </div>
    <div class="btn-area text-center smaller">
      <input type="button" value="Cancel" class="btn-black-mdx " id="popup_btncancel">
      <input id="popup_btnconfirm_cancel" type="button" value="Okay" class="my-btn btn-blue">
      <div class="clearfix"></div>
    </div>
  </div>
</div>

<div id="cover"></div>

<!-- begin footer -->

<script>
  var editor = CKEDITOR.replace('editor1', {
    // , items: [ 'Preview','Source']                            
    toolbar: [{
        name: 'document',
        groups: ['document', 'doctools'],
        items: ['Preview','Source']
      },
      {
        name: 'clipboard',
        groups: ['clipboard', 'undo'],
        items: ['-', 'Undo', 'Redo']
      },
      {
        name: 'editing',
        groups: ['find', 'selection', 'spellchecker'],
        items: ['-', 'SelectAll', '-']
      },
      '/',
      {
        name: 'basicstyles',
        groups: ['basicstyles', 'cleanup'],
        items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-']
      },
      {
        name: 'paragraph',
        groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
        items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-']
      },
      {
        name: 'links',
        items: ['Link', 'Unlink']
      },
      {
        name: 'insert',
        items: ['Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'imageuploader']
      },
      '/',
      {
        name: 'styles',
        items: ['Format', 'Font', 'FontSize']
      },
      {
        name: 'colors',
        items: ['TextColor', 'BGColor', 'youtube']
      }
    ],
  
  });
  
  

  //insert another toolbar for ckeditor

  //buyer name
  // CKEDITOR.plugins.add('BuyerName', {
  //   init: function(editor) {
  //     var pluginName = 'BuyerName';
  //     editor.ui.addButton('BuyerName', {
  //       label: 'Buyer Name',
  //       command: 'OpenWindow1'
  //       // icon: 'images/cross-icon.svg'
  //     });
  //     var cmd = editor.addCommand('OpenWindow1', {
  //       exec: showMyDialog1
  //     });
  //   }
  // });


  // //merchant name
  // CKEDITOR.plugins.add('MerchantName', {
  //   init: function(editor) {
  //     var pluginName = 'MerchantName';
  //     editor.ui.addButton('MerchantName', {
  //       label: 'Merchant Name',
  //       command: 'OpenWindow2'
  //       // icon: 'images/cross-icon.svg'
  //     });
  //     var cmd = editor.addCommand('OpenWindow2', {
  //       exec: showMyDialog2
  //     });
  //   }
  // });

  // //Invoice id
  // CKEDITOR.plugins.add('InvoiceID', {
  //   init: function(editor) {
  //     var pluginName = 'InvoiceID';
  //     editor.ui.addButton('InvoiceID', {
  //       label: 'Invoice ID',
  //       command: 'OpenWindow3'
  //       // icon: 'images/cross-icon.svg'
  //     });
  //     var cmd = editor.addCommand('OpenWindow3', {
  //       exec: showMyDialog3
  //     });
  //   }
  // });

  // //total Amount
  // CKEDITOR.plugins.add('TotalAmount', {
  //   init: function(editor) {
  //     var pluginName = 'TotalAmount';
  //     editor.ui.addButton('TotalAmount', {
  //       label: 'Total Amount',
  //       command: 'OpenWindow4'
  //       // icon: 'images/cross-icon.svg'
  //     });
  //     var cmd = editor.addCommand('OpenWindow4', {
  //       exec: showMyDialog4
  //     });
  //   }
  // });

  jQuery("#insert-there").click(function() {
    e.insertHtml('<h4 style="color:blue"> {{ Buyer Name }} </h4>');
    })

  function showMyDialog1(e) {
    e.insertHtml('<h4 style="color:blue"> {{ Buyer Name }} </h4>');
  }

  function showMyDialog2(e) {
    e.insertHtml('<h4 style="color:blue"> {{ Merchant Name }} </h4>');
  }

  function showMyDialog3(e) {
    e.insertHtml('<h4 style="color:blue"> {{ Invoice ID }} </h4>');
  }

  function showMyDialog4(e) {
    e.insertHtml('<h4 style="color:blue"> {{ Total Amount }} </h4>');
  }


  CKEDITOR.config.allowedContent = true;


  data2 = CKEDITOR.instances.editor1.getData();
  html = CKEDITOR.instances.editor1.getSnapshot();
  dom = document.createElement("DIV");
  dom.innerHTML = html;
  plain_text = (dom.textContent || dom.innerText);
  var res1 = plain_text.charAt(plain_text.length - 1);

  meta = $('#metadescs1');
  meta.text(plain_text);


  function GetContents1() {


    data2 = CKEDITOR.instances.editor1.getData();
    html = CKEDITOR.instances.editor1.getSnapshot();
    dom = document.createElement("DIV");
    dom.innerHTML = html;
    plain_text = (dom.textContent || dom.innerText);

    meta = $('#metadescs1');
    meta.text(plain_text);

  }


  CKEDITOR.config.removePlugins = 'elementspath';
  CKEDITOR.config.height = '600px';


  //TEST FUNCTION
  function getCharFromPos(editor) {
    var sWord = '';
    var endPos = setCursorPos(editor);
    var sText = editor.document.$.body.innerText;

    while (endPos > 0) {
      var ch = sText.charAt(endPos);
      if (ch == ' ')
        break;

      sWord += ch;
      endPos--;
    }

    return sText.substring(endPos, 1 + cursorPos.z);
  }

  function setCursorPos(editor) {
    if (!editor)
      return;

    var objRange = editor.document.$.selection.createRange();
    var sOldRange = objRange.text;
    var sTempStr = '%$#'

    //insert the sTempStr where the cursor is at
    objRange.text = sOldRange + sTempStr;
    objRange.moveStart('character', (0 - sOldRange.length - sTempStr.length));

    //save off the new string with sTempStr 
    var sNewText = editor.document.$.body.innerText;
    console.log('editor ' + sNewText);
    //set the actual text value back to how it was
    objRange.text = sOldRange;

    // locate sTempStr  and get its position
    for (var i = 0; i <= sNewText.length; i++) {
      var sTemp = sNewText.substring(i, i + sTempStr.length);
      if (sTemp == sTempStr) {
        var curPos = (i - sOldRange.length);
        return curPos - 1;
      }
    }
    return 0;
  }
</script>

<script type="text/javascript">
  jQuery(document).ready(function() {

    window.setTimeout(function ()
		{
			relativeHeight();
            console.log("wewe");
		}, 500);
        
        $(window).resize(function() {
            relativeHeight();

        });
    

    jQuery(".mobi-header .navbar-toggle").click(function(e) {
      e.preventDefault();
      jQuery("body").toggleClass("sidebar-toggled");
    });
    jQuery(".navbar-back").click(function() {
      jQuery(".mobi-header .navbar-toggle").trigger('click');
    });

    /*nice scroll */
    jQuery(".sidebar").niceScroll({
      cursorcolor: "#000",
      cursorwidth: "6px",
      cursorborderradius: "5px",
      cursorborder: "1px solid transparent",
      touchbehavior: true,
      preventmultitouchscrolling: false,
      enablekeyboard: true
    });

    jQuery(".sidebar .section-links li > a").click(function() {
      jQuery(".sidebar .section-links li").removeClass('active');
      jQuery(this).parents('li').addClass('active');
    });


    jQuery('.pgcrt-link-cstmseo').click(function() {
      jQuery('.pgcrt-meta-seosec').addClass('hide');
      jQuery('.pgcrt-meta-seoeditsec').removeClass('hide');
    });


    jQuery('.pgcrtseo-canclelink').click(function() {
      jQuery('.pgcrt-meta-seosec').removeClass('hide');
      jQuery('.pgcrt-meta-seoeditsec').addClass('hide');
    });

    jQuery('.btn_delete_act').click(function() {
      jQuery('#DeleteCustomMethod').show();
      jQuery('#cover').show();
    });

    jQuery('#popup_btnconfirm').click(function() {
      jQuery('#DeleteCustomMethod').hide();
      jQuery('#cover').hide();
    });

    jQuery('#popup_btnconfirm_cancel').click(function() {
      // jQuery('#DeleteCustomMethod').hide();
      // jQuery('#cover').hide();
    });

    jQuery('#popup_btncancel,.close-popup').click(function() {
      jQuery('#DeleteCustomMethod').hide();
      jQuery('#cover').hide();
    });



    //pre fill the meta title with the page title and replace the spaces with (-)
    $("#title").keyup(function() {
      title = $('#title').val();
      $("#metatitle").val($('#title').val());

      str = title.replace(/\s+/g, '-').toLowerCase();
      $("#metaurl").val(str);

    });

  });
    function relativeHeight() {
        var relativeH = $(".in-relatition").height();
        var cutOut = $(".cut-out").height();
        $(".relative-height").css("height", relativeH - cutOut + 15);
    }

    function higlightAll(els){
        var $this = $(els);
        console.log($this.val());
        $this.focus();
        $this.select();
        document.execCommand('copy');
        // $this.after("Copied to clipboard");

    }


   function email_parameter_opt(object) {
        var selectId = $(object).attr("id");

        // if ($(obj).attr("id") === selectId) {
                if ($("#" + selectId + " " + ".parameter-drop-down select option:selected").text() === "Admin") {
                    $('#admin-options').show();
                    $('#consumer-options').hide();
                    $('#general-options').hide();
                    $('#items-options').hide();
                    $('#marketplace-options').hide();
                    $('#merchant-options').hide();
                    $('#order-options').hide();
                    $('#pricing-options').hide();
                };

                if ($("#" + selectId + " " + ".parameter-drop-down select option:selected").text() === "Consumer") {
                    $('#admin-options').hide();
                    $('#consumer-options').show();
                    $('#general-options').hide();
                    $('#items-options').hide();
                    $('#marketplace-options').hide();
                    $('#merchant-options').hide();
                    $('#order-options').hide();
                    $('#pricing-options').hide();
                };

                if ($("#" + selectId + " " + ".parameter-drop-down select option:selected").text() === "General") {
                    $('#admin-options').hide();
                    $('#consumer-options').hide();
                    $('#general-options').show();
                    $('#items-options').hide();
                    $('#marketplace-options').hide();
                    $('#merchant-options').hide();
                    $('#order-options').hide();
                    $('#pricing-options').hide();
                };

                if ($("#" + selectId + " " + ".parameter-drop-down select option:selected").text() === "Items") {
                    $('#admin-options').hide();
                    $('#consumer-options').hide();
                    $('#general-options').hide();
                    $('#items-options').show();
                    $('#marketplace-options').hide();
                    $('#merchant-options').hide();
                    $('#order-options').hide();
                    $('#pricing-options').hide();
                };

                if ($("#" + selectId + " " + ".parameter-drop-down select option:selected").text() === "Marketplace") {
                    $('#admin-options').hide();
                    $('#consumer-options').hide();
                    $('#general-options').hide();
                    $('#items-options').hide();
                    $('#marketplace-options').show();
                    $('#merchant-options').hide();
                    $('#order-options').hide();
                    $('#pricing-options').hide();
                };

                if ($("#" + selectId + " " + ".parameter-drop-down select option:selected").text() === "Merchant") {
                    $('#admin-options').hide();
                    $('#consumer-options').hide();
                    $('#general-options').hide();
                    $('#items-options').hide();
                    $('#marketplace-options').hide();
                    $('#merchant-options').show();
                    $('#order-options').hide();
                    $('#pricing-options').hide();
                };

                if ($("#" + selectId + " " + ".parameter-drop-down select option:selected").text() === "Order") {
                    $('#admin-options').hide();
                    $('#consumer-options').hide();
                    $('#general-options').hide();
                    $('#items-options').hide();
                    $('#marketplace-options').hide();
                    $('#merchant-options').hide();
                    $('#order-options').show();
                    $('#pricing-options').hide();
                };

                if ($("#" + selectId + " " + ".parameter-drop-down select option:selected").text() === "Pricing") {
                    $('#admin-options').hide();
                    $('#consumer-options').hide();
                    $('#general-options').hide();
                    $('#items-options').hide();
                    $('#marketplace-options').hide();
                    $('#merchant-options').hide();
                    $('#order-options').hide();
                    $('#pricing-options').show();
                };



    }
              
            

    function maxLength(el) {
      if (!('maxLength' in el)) {
        var max = el.attributes.maxLength.value;
        el.onkeypress = function() {
          if (this.value.length >= max) {
            ;
            return false;
          } //

        };
      }
    }


 
</script>
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.js"></script>
<script type="text/javascript" src="scripts/package.js"></script>

<!-- end footer -->