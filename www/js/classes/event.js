/* global siteRoot, url, webSerEvtPg, returnHome, prevEvtHeader, prevEvtCatToDisp, clientLocation */

/** Class that holds [Events] object data and behaviors */
function Events() {
  // always initialize all instance properties
  this.eventId = '';
  this.userId = '';
  this.noViews = ''; 
  this.name = ''; 
  this.email = ''; 
  this.country = ''; 
  this.state = ''; 
  this.location='';
  this.phoneNo = ''; 
  this.eventTitle = ''; 
  this.venue = ''; 
  this.description = ''; 
  this.category = 0; 
  this.startDate = ''; 
  this.endDate = ''; 
  this.cost = ''; 
  this.organiser = ''; 
  this.facilitator = ''; 
  this.website = ''; 
  this.postedDate = ''; 
  this.sortDate = ''; 
  this.premium = false;  
  this.makePremium  = '';  
  this.expTable = '';  
  this.activationDate  = '';  
  this.premiumCourses = '';  
  this.tags = '';  
  this.videoUrl  = '';  
  this.videoId = '';  
}

/**   class methods  */
//Method for Add Events 
Events.prototype.add = function() {
    //JSON HANDLER
};
//Method for edit
Events.prototype.edit = function() {
    //JSON HANDLER
};

//Method for update 
Events.prototype.update = function() {
    //JSON HANDLER
};

//Method for Delete 
Events.prototype.del = function() {
    //JSON HANDLER
};

//Method for makePremium 
Events.prototype.makePremium = function() {
    //JSON HANDLER
};


/** Method for displaying events 
 *  @param {int} totalNo Specifies the total events to be listed
 *  @param {int} offset Specifies the starting point of the listing 
 */ 
Events.prototype.show = function(totalNo, offset) {
    // get JSON-formatted Eventss from the server
    $.ajax({
        // the URL for the request
        url : webSerEvtPg,
        // the data to send (will be converted to a query string)
        data : {ispremium: this.premium, totalno : totalNo, offset: offset, category: this.category, clientlocation: clientLocation}, //start : 0, end: 20 
        // whether this is a POST or GET request
        type : 'GET',
        //Do not allow cache
        cache: false,
        // the type of data we expect back
        dataType : 'JSON',
        // code to run if the request succeeds; the response is passed to the function
        success : function(data, status) {
            //If the return status is 0 show error message
            if(data.status === 0){ 
                $("#message-dialog .ui-content h1").text("Event Listing Error");
                $("#message-dialog .ui-content p").text(data.msg);
                showMessageDialog('flow');
                //$("#message-dialog").popup({'transition':'pop','overlayTheme':'b'}).popup("open");
            }
            //If the return value is empty show info message
            if(data.status ===1 && data.info.length === 0){ 
                //showDialog('dialogs/events-by-locations.html');  //show end of events dialog
                $("#message-dialog .ui-content h1").text("No Event Fetched");
                $("#message-dialog .ui-content p").text("Either this is the end of upcoming events or there is currently no events for the chosen category. Please click the buttonb below to go back.");
                showMessageDialog('flow');
                //$("#message-dialog").popup({'transition':'pop','overlayTheme':'b', 'positionTo':'window'}).popup("open"); //show end of events dialog
                $('#all-events').attr('data-end',($('#all-events').attr('data-end')* 1)-1);//fetch the last page number and decrement it
                $('#pageSecondHeader h4').text(prevEvtHeader);//return the previous header
            }
            //Else show the fetched Events
            else if(data.status ===1 && data.info.length > 0){
                $("#all-events").empty();//Remove present events list and load new ones
                $.each(data.info, function(i, item) {
                    if(item.logo===''){logo='images/lists/no_logo.png';}
                    else{logo=siteRoot+'premium/logos/thumbs/'+item.logo;}
                    var startDate = item.start.split(" ") ;//split the date into array
                    var endDate = item.end.split(" ");
                    $('#all-events')
                        .append($('<li class="no-bottom one-half-responsive" data-eid="'+item.eid+'" id="'+item.eid+'" data-event-marker="0">\n\
                            <a href="#fullEventPopup" data-transition="flip">\n\
                                <img src="'+logo+'" alt="img" id="e-logo" class="ui-li-icon ui-corner-none">\n\
                                <h2 id="e-title">'+item.title+'</h2>\n\
                                <p style="font-size:12px"><span id="e-venue"><span class="fa fa-location-arrow"></span> '+item.location+'</span><br>\n\
                                <span id="e-dates"><span class="fa fa-calendar"></span> '+startDate[0]+' '+startDate[1].substr(0, 3)+' - '+endDate[0]+' '+endDate[1].substr(0, 3)+' '+endDate[2]+'</span></p>\n\
                                <i style="display:none" class="hidden-event-details"\n\
                                data-efacilitator="'+item.facilitator+'" data-edescription="'+item.description+'.." \n\
                                data-estate="'+item.state+'" data-ecountry="'+item.country+'" \n\
                                data-evenue="'+item.venue+'" data-ecost="'+item.cost+'" \n\
                                data-ewebsite="'+item.website+'" data-ephone="'+item.phone+'" data-eorganiser="'+item.organiser+'" \n\
                                data-estart="'+item.start+'" data-eend="'+item.start+'" data-email="'+item.mail+'">\n\
                                </i>\n\
                            </a><a href="#" data-icon="action"></a>\n\
                        <div class="decoration hide-if-responsive"></div></li>\n\
                        '
                    ));
                });
                /** Create handler for displaying full event details */
                var idHolder, target;
                $(".one-half-responsive").on( "tap", function() {
                    idHolder = $(this).attr('data-eid');
                    //Process the phone number to remove spaces & multiple nos
                    if($("#"+idHolder+"").find(".hidden-event-details").attr('data-ephone').indexOf(",")!==0){var phoneArray = $("#"+idHolder+"").find(".hidden-event-details").attr('data-ephone').split(',');}
                    if(phoneArray[0].indexOf("234")<=2){phoneArray = phoneArray[0].replace('234', "");}
                    target = $("#"+idHolder+"");
                    $("#fullEventPopup #p-title").html(target.find( "#e-title" ).text());
                    $("#fullEventPopup #p-organiser").text(target.find(".hidden-event-details").attr('data-eorganiser'));
                    $("#fullEventPopup #p-dates").text(target.find("#e-dates").text());
                    $("#fullEventPopup #p-venue").text(target.find(".hidden-event-details").attr('data-evenue'));
                    $("#fullEventPopup #p-fee").text(target.find(".hidden-event-details").attr('data-ecost'));
                    $("#fullEventPopup #p-web").attr('href',target.find(".hidden-event-details").attr('data-ewebsite'));
                    $("#fullEventPopup #p-description").text(target.find(".hidden-event-details").attr('data-edescription'));
                    $("#fullEventPopup #p-mail").attr('href','mailto:'+target.find(".hidden-event-details").attr('data-email'));
                    $("#fullEventPopup #p-call").attr('href','tel:'+phoneArray.replace(" ", "").replace(/[^a-zA-Z 0-9]+/g,""));
                    //$("#fullEventPopup").popup({history:false,'corners':true, 'transition':'slidedown', 'overlayTheme':'b', 'positionTo':'window'}).popup("open"); //Open the customizable popup dialog
                });
            }
        },
        // code to run if the request fails; the raw request and status codes are
        // passed to the function
        error : function(xhr, status) {
            erroMsg = '';
            if(xhr.status===0){ erroMsg = 'There is a problem connecting to internet. Please review your internet connection.'; }
            else if(xhr.status===404){ erroMsg = 'Requested page not found.'; }
            else if(xhr.status===500){ erroMsg = 'Internal Server Error.';}
            else if(status==='parsererror'){ erroMsg = 'Error. Parsing JSON Request failed.'; }
            else if(status==='timeout'){  erroMsg = 'Request Time out.';}
            else { erroMsg = 'Unknow Error.\n'+xhr.responseText;}          
            $("#message-dialog .ui-content h1").text("Problem Loading Events");
            $("#message-dialog .ui-content p").text(erroMsg);
            showMessageDialog('flow');
            //$("#message-dialog").popup().popup("open"); //show end of events dialog
        },
        // code to run regardless of success or failure
        complete : function(xhr, status) {
        }
    });
    
};
/** End of Class Methods */
