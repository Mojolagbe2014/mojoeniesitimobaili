/* global prevEvtHeader, siteRoot, webSerProvPg */

/** Constructor for [Business] object */
function Business () {
  this.businessId = 0;
  this.userId = 0;
  this.name = ''; 
  this.status = 0; 
  this.email = ''; 
  this.description = ''; 
  this.nature = ''; 
  this.address = ''; 
  this.size = 0; 
  this.capacity = 0; 
  this.contactPerson = ''; 
  this.telephone = 0; 
  this.website = ''; 
  this.premium = false; 
  this.expirationDate = ''; 
  this.price = ''; 
  this.webClicks =0; 
  this.specialization = ''; 
  this.designation = ''; 
  this.country = ''; 
  this.state = '';  
  this.mail = '';  
  this.viewCounter = 0;  
}

/** Methods for displaying available venues  
 * @param {int} totalNo Total number of providers to be listed
 * @param {int} offset Offset or starting point for pagination
 */
Business.prototype.showVenues = function(totalNo, offset) {
    // get JSON-formatted Quotes from the server
    $.ajax({
        // the URL for the request
        url : webSerProvPg,
        // the data to send (will be converted to a query string)
        data : {providertype: 'venue', ispremium: this.premium, totalno: totalNo, offset: offset}, //set get variables
        // whether this is a POST or GET request
        type : 'GET',
        //Cache status
        cache: false,
        // the type of data we expect back
        dataType : 'JSON',
        // code to run if the request succeeds; the response is passed to the function
        success : function(data, status) {
            //If the return status is 0 show error message
            if(data.status === 0){ 
                $("#message-dialog .ui-content h1").text("Venue Listing Error");
                $("#message-dialog .ui-content p").text(data.msg);
                showMessageDialog('flow');
                //$("#message-dialog").popup({'transition':'pop','overlayTheme':'b'}).popup("open");
            }
            //If the return value is empty show info message
            if(data.status ===1 && data.info.length === 0){ 
                //showDialog('dialogs/events-by-locations.html');  //show end of events dialog
                $("#message-dialog .ui-content h1").text("No Venues Fetched");
                $("#message-dialog .ui-content p").text("Either there are no more venues or that is the end of available venues. Please click the button below to go back.");
                showMessageDialog('flow');
                //$("#message-dialog").popup({'transition':'pop','overlayTheme':'b', 'positionTo':'window'}).popup("open"); //show end of events dialog
                $('#all-events').attr('data-end',parseInt($('#all-events').attr('data-end'))-1);//fetch the last page number and decrement it
                //$('#pageSecondHeader h4').text(prevEvtHeader);//return the previous header
            }
            //Else show the fetched providers if providers is not empty
            else if(data.status===1 && data.info.length > 0){
                $("#all-events").empty();//Remove present list and load new ones
                $.each(data.info, function(i, item) {
                    if(item.logo===''){logo='images/lists/no_logo.png';}
                    else{logo=siteRoot+'premium/logos/thumbs/'+item.logo;}
                    $('#all-events')
                        .append($('<li class="no-bottom one-half-responsive" data-pid="'+item.bid+'" id="'+item.bid+'">\n\
                            <a href="#fullVenuePopup"  data-transition="flip">\n\
                                <img src="'+logo+'" alt="img" id="e-logo" class="ui-li-icon ui-corner-none">\n\
                                <h2 id="p-business">'+item.business+'</h2>\n\
                                <p style="font-size:12px"><span id="p-location"><span class="fa fa-location-arrow"></span> '+item.location+'</span><br>\n\
                                <span id="p-capacity"><span class="fa fa-building"></span> '+item.capacity+'</span></p>\n\
                                <i style="display:none" class="hidden-providers-details"\n\
                                data-pdescription="'+item.description+'.." data-psize="'+item.size+'" \n\
                                data-paddress="'+item.address+'" data-pcperson="'+item.contactperson+'" \n\
                                data-pwebsite="'+item.website+'" data-pphone="'+item.telephone+'" \n\
                                data-pemail="'+item.email+'">\n\
                                </i>\n\
                            </a><a href="#" data-icon="action"></a>\n\
                        <div class="decoration hide-if-responsive"></div></li>\n\
                        '
                    ));
                });
            }
        },
        // code to run if the request fails; the raw request and status codes are
        // passed to the function
        error : function(xhr, status) {
            $("#message-dialog .ui-content h1").text("Problem Loading");
            $("#message-dialog .ui-content p").text("There is a problem connecting to internet. Please review your internet connection.");
            showMessageDialog('flow');
            //$("#message-dialog").popup().popup("open"); //show end of events dialog
        },
        // code to run regardless of success or failure
        complete : function(xhr, status) {
            /** Create handler for displaying full event details */
            var idHolder, target;
            $(".one-half-responsive").on( "tap", function() {
                idHolder = $(this).attr('data-pid');
                //Process the phone number to remove spaces & multiple nos
                if($("#"+idHolder+"").find(".hidden-providers-details").attr('data-pphone').indexOf(",")!==0){var phoneArray = $("#"+idHolder+"").find(".hidden-providers-details").attr('data-pphone').split(',');}
                if(phoneArray[0].indexOf("234")<=2){phoneArray = phoneArray[0].replace('234', "");}
                target = $("#"+idHolder+"");
                $("#fullVenuePopup #v-title").html(target.find( "#p-business" ).text());
                $("#fullVenuePopup #v-address").text(target.find(".hidden-providers-details").attr('data-paddress'));
                $("#fullVenuePopup #v-capacity").text(target.find("#p-capacity").text());
                $("#fullVenuePopup #v-size").text(target.find(".hidden-providers-details").attr('data-psize'));
                $("#fullVenuePopup #v-cperson").text(target.find(".hidden-providers-details").attr('data-pcperson'));
                $("#fullVenuePopup #v-web").attr('href',target.find(".hidden-providers-details").attr('data-pwebsite'));
                $("#fullVenuePopup #v-description").text(target.find(".hidden-providers-details").attr('data-pdescription'));
                $("#fullVenuePopup #v-mail").attr('href','mailto:'+target.find(".hidden-providers-details").attr('data-pemail'));
                $("#fullVenuePopup #v-call").attr('href','tel:'+phoneArray.replace(" ", "").replace(/[^a-zA-Z 0-9]+/g,""));
                //$("#fullVenuePopup").popup({history:false,'corners':true, 'transition':'pop', 'overlayTheme':'b', 'positionTo':'window'}).popup("open"); //Open the customizable popup dialog
            });
        }
    });
};

/** Methods for displaying available training providers, managers and suppliers  
 * @param {int} totalNo Total number of providers to be listed
 * @param {int} offset Offset or starting point for pagination
 */
Business.prototype.show = function(totalNo, offset) {
    // get JSON-formatted Quotes from the server
    $.ajax({
        // the URL for the request
        url : webSerProvPg,
        // the data to send (will be converted to a query string)
        data : {providertype: this.nature, ispremium: this.premium, totalno: totalNo, offset: offset}, //set get variables
        // whether this is a POST or GET request
        type : 'GET',
        //Cache status
        cache: false,
        // the type of data we expect back
        dataType : 'JSON',
        // code to run if the request succeeds; the response is passed to the function
        success : function(data, status) {
            //If the return status is 0 show error message
            if(data.status === 0){ 
                $("#message-dialog .ui-content h1").text("Provider Listing Error");
                $("#message-dialog .ui-content p").text(data.msg);
                showMessageDialog('flow');
                //$("#message-dialog").popup({'transition':'pop','overlayTheme':'b'}).popup("open");
            }
            //If the return value is empty show info message
            if(data.status ===1 && data.info.length === 0){ 
                //showDialog('dialogs/events-by-locations.html');  //show end of events dialog
                $("#message-dialog .ui-content h1").text("No Providers Fetched");
                $("#message-dialog .ui-content p").text("Either there are no more training providers or that is the end of available training providers. Please click the button below to go back.");
                showMessageDialog('flow');
                //$("#message-dialog").popup({'transition':'pop','overlayTheme':'b', 'positionTo':'window'}).popup("open"); //show end of events dialog
                $('#all-events').attr('data-end',parseInt($('#all-events').attr('data-end'))-1);//fetch the last page number and decrement it
                //$('#pageSecondHeader h4').text(prevEvtHeader);//return the previous header
            }
            //Else show the fetched providers if providers is not empty
            else if(data.status===1 && data.info.length > 0){
                $("#all-events").empty();//Remove present list and load new ones
                $.each(data.info, function(i, item) {
                    if(item.logo===''){logo='images/lists/no_logo.png';}
                    else{logo=siteRoot+'premium/logos/thumbs/'+item.logo;}
                    $('#all-events')
                        .append($('<li class="no-bottom one-half-responsive" data-pid="'+item.bid+'" id="'+item.bid+'">\n\
                            <a href="#fullTrProvPopup" data-transition="flip">\n\
                                <img src="'+logo+'" alt="img" id="e-logo" class="ui-li-icon ui-corner-none">\n\
                                <h2 id="p-business">'+item.business+'</h2>\n\
                                <p style="font-size:12px"><span id="p-location"><span class="fa fa-location-arrow"></span> '+item.location+'</span><br>\n\
                                <span id="p-address"><span class="fa fa-building"></span> '+item.address+'</span></p>\n\
                                <i style="display:none" class="hidden-providers-details"\n\
                                data-pdescription="'+item.description+'.." data-psize="'+item.size+'" \n\
                                data-paddress="'+item.address+'" data-pcperson="'+item.contactperson+'" \n\
                                data-pwebsite="'+item.website+'" data-pphone="'+item.telephone+'" \n\
                                data-pemail="'+item.email+'">\n\
                                </i>\n\
                            </a><a href="#" data-icon="action"></a>\n\
                        <div class="decoration hide-if-responsive"></div></li>\n\
                        '
                    ));
                });
            }
        },
        // code to run if the request fails; the raw request and status codes are
        // passed to the function
        error : function(xhr, status) {
            $("#message-dialog .ui-content h1").text("Problem Loading");
            $("#message-dialog .ui-content p").text("There is a problem connecting to internet. Please review your internet connection.");
            //$("#message-dialog").popup().popup("open"); //show end of events dialog
            showMessageDialog('flow');
        },
        // code to run regardless of success or failure
        complete : function(xhr, status) {
            /** Create handler for displaying full event details */
            var idHolder, target;
            $(".one-half-responsive").on( "tap", function() {
                idHolder = $(this).attr('data-pid');
                //Process the phone number to remove spaces & multiple nos
                if($("#"+idHolder+"").find(".hidden-providers-details").attr('data-pphone').indexOf(",")!==0){var phoneArray = $("#"+idHolder+"").find(".hidden-providers-details").attr('data-pphone').split(',');}
                if(phoneArray[0].indexOf("234")<=2){phoneArray = phoneArray[0].replace('234', "");}
                target = $("#"+idHolder+"");
                $("#fullTrProvPopup #trpr-title").html(target.find( "#p-business" ).text());
                $("#fullTrProvPopup #trpr-address").text(target.find(".hidden-providers-details").attr('data-paddress'));
                $("#fullTrProvPopup #trpr-cperson").text(target.find(".hidden-providers-details").attr('data-pcperson'));
                $("#fullTrProvPopup #trpr-web").attr('href',target.find(".hidden-providers-details").attr('data-pwebsite'));
                $("#fullTrProvPopup #trpr-description").text(target.find(".hidden-providers-details").attr('data-pdescription'));
                $("#fullTrProvPopup #trpr-mail").attr('href','mailto:'+target.find(".hidden-providers-details").attr('data-pemail'));
                $("#fullTrProvPopup #trpr-call").attr('href','tel:'+phoneArray.replace(" ", "").replace(/[^a-zA-Z 0-9]+/g,""));
                //$("#fullTrProvPopup").popup({history:false,'corners':true, 'transition':'pop', 'overlayTheme':'b', 'positionTo':'window'}).popup("open"); //Open the customizable popup dialog
            });
        }
    });
};
