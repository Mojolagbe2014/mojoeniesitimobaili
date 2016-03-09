/* 
 * Holds all jquery Home Page actions/application action listeners
 */
//var siteRoot = 'http://localhost/';
var siteRoot = "https://www.nigerianseminarsandtrainings.com/";
var url = siteRoot+'nstmobileapp/rest/'; //location of the web services
var currentPage = $("#all-events").attr('data-end'); //Hold the currentPage
var webSerEvtPg = url+'index.php';//Initialize the webservice page for events listing
var webSerProvPg = url+'show-providers.php';//Initialize the webservice page for business listing as venues, training providers, events managers and suppliers
var evtCatToDisp = 0; //Category number holding the category name in db table [categories]; 0 for all categories
var currentSelectedMenu = 'Events'; //Set the initial app's content to load
var prevEvtHeader = "All Upcoming Events";//Event header b4 selecting a category events header
var clientLocation = ""; //Current location  of the visitor
var totalListedItems = 50; //Specifies the number of events per page
var totalQuotes = 15; //Specifies total displayable quote
var footerStatus = 'hide'; //Set the footer to false to disable it 
/** Function that displays internal multi pages as dialog pages 
* @param {int} transition Transition 
*/
var showMessageDialog = function(transition){
    $.mobile.changePage("#message-dialog",{
        allowSamePageTransition: true,
        showLoadMsg : true,
        transition : transition,
        reverse    : false,
        changeHash : true
    });
};
//User control settings from localstorage ==//
if(typeof(Storage)!== "undefined") {//check if localstorage supported
    //Check if totalListedItems is set or not in localstorage
//    if("totalListedItems" in localStorage){totalListedItems = localStorage.totalListedItems;}
//    if("totalQuotes" in localStorage){totalQuotes = localStorage.totalQuotes;}
//    if("footerStatus" in localStorage){footerStatus = localStorage.footerStatus;}
}

(function ($) {
$(document).ready(function(){ 
    //Create an instance of application user by instatiating User() class
    appUser = new User();
    if(parseInt(appUser.userId)===0){ $('#pageapp-logout-li').hide();$('#pageapp-login-li').show();}//hide signOut menu
    else{$('#pageapp-logout-li').show();$('#pageapp-login-li').hide();}
    
    //Create also business object incase the user is a business
    appBusinessUser = new Business();
    
    //Display Quotes as app opens
    dailyQuote = new Quote();//Instantiate quote class
    dailyQuote.show(totalQuotes, false);//Show daily quote
    
    //Show list of events as app opens
    siteEvents = new Events(); //Create an object of event class
    siteEvents.premium = false; //Make the events to show be premium
    siteEvents.category = evtCatToDisp; // Specify the category to be displayed; 0 for all categories
    siteEvents.show(totalListedItems, (currentPage - 1) * totalListedItems);
    
    // Bind the swipeHandler callback function to the swipe events 
    $("#all-events" ).bind({"swipeleft":swipeLeftHandler,"swiperight":swipeRightHandler });
    $(".events-touch-pad" ).bind({"swipeleft":swipeLeftHandler,"swiperight":swipeRightHandler});
    $('#next-events').on('tap', swipeLeftHandler);$('#prev-events').bind({tap: swipeRightHandler});
    $('.events-touch-pad #refresh-button').bind({tap: refreshContent});
    
    /** Callback function for 'swipe left' events */
    function swipeLeftHandler(){
        currentPage = parseInt($('#all-events').attr('data-end'))+1; //fetch the last page number nd increment it
        $('#all-events').attr('data-end', currentPage); //Update the pagenumber holder [data-end]
        switch(currentSelectedMenu){
            case 'Events':  nextEvents = new Events(); //Create an object of event class
                            nextEvents = new Events(); //Create an object of event class
                            nextEvents.premium = false; //Make the events to show be premium
                            nextEvents.category = evtCatToDisp; // Specify the category to be displayed; 0 for all categories
                            nextEvents.show(totalListedItems, (currentPage - 1) * totalListedItems);
                            break;
            case 'Venues':  nextVenues = new Business();
                            nextVenues.premium = false;
                            nextVenues.showVenues(totalListedItems, (currentPage - 1) * totalListedItems);
                            break;
            case 'Trainings':nextTrProv = new Business();
                            nextTrProv.premium = false;
                            nextTrProv.nature = 'training';
                            nextTrProv.show(totalListedItems, (currentPage - 1) * totalListedItems);
                            break;
            case 'Managers':nextManagers = new Business();
                            nextManagers.premium = false;
                            nextManagers.nature = 'manager';
                            nextManagers.show(totalListedItems, (currentPage - 1) * totalListedItems);
                            break;
            case 'Suppliers':nextSuppliers = new Business();
                            nextSuppliers.premium = false;
                            nextSuppliers.nature = 'supplier';
                            nextSuppliers.show(totalListedItems, (currentPage - 1) * totalListedItems);
                            break;
        }
    }
    /** Callback function for 'swipe right' events */
    function swipeRightHandler(){
        currentPage = parseInt($('#all-events').attr('data-end')); //fetch the last page number
        if(currentPage>1){//Check if at least it is not d home page
            currentPage -=1; //Decrement the page number to go prevous page 
            $('#all-events').attr('data-end', currentPage); //Update the pagenumber holder [data-end]
            
            switch(currentSelectedMenu){
                case 'Events':  prevEvents = new Events(); //Create an object of event class
                                prevEvents.premium = false; //Make the events to show be premium
                                prevEvents.category = evtCatToDisp; // Specify the category to be displayed; 0 for all categories
                                prevEvents.show(totalListedItems, (currentPage - 1) * totalListedItems);
                                break;
                case 'Venues':  prevVenues = new Business();
                                prevVenues.premium = false;
                                prevVenues.showVenues(totalListedItems, (currentPage - 1) * totalListedItems);
                                break;
                case 'Trainings':prevTrProv = new Business();
                                prevTrProv.premium = false;
                                prevTrProv.nature = 'training';
                                prevTrProv.show(totalListedItems, (currentPage - 1) * totalListedItems);
                                break;
                case 'Managers':prevManagers = new Business();
                                prevManagers.premium = false;
                                prevManagers.nature = 'manager';
                                prevManagers.show(totalListedItems, (currentPage - 1) * totalListedItems);
                                break;
                case 'Suppliers':prevSuppliers = new Business();
                                prevSuppliers.premium = false;
                                prevSuppliers.nature = 'supplier';
                                prevSuppliers.show(totalListedItems, (currentPage - 1) * totalListedItems);
                                break;
            }
        }
    }
    /** Callback function for 'refresh' events  */
    function refreshContent(){
        //fetch the last page number
        currentPage = parseInt($('#all-events').attr('data-end'));//if last page no is greater than zero
        if(currentPage<1) {currentPage =1;}//incase of negative or zero value set page number to be 1
        $('#all-events').attr('data-end', currentPage); //Update the pagenumber holder [data-end]
        switch(currentSelectedMenu){
            case 'Events':  currEvents = new Events(); //Create an object of event class
                            currEvents.category = evtCatToDisp; // Specify the category to be displayed; 0 for all categories
                            currEvents.premium = false; //Make the events to show be premium
                            currEvents.show(totalListedItems, (currentPage - 1) * totalListedItems);
                            break;
            case 'Venues':  currVenues = new Business();
                            currVenues.premium = false;
                            currVenues.showVenues(totalListedItems, (currentPage - 1) * totalListedItems);
                            break;
            case 'Trainings':currTrProv = new Business();
                            currTrProv.premium = false;
                            currTrProv.nature = 'training';
                            currTrProv.show(totalListedItems, (currentPage - 1) * totalListedItems);
                            break;
            case 'Managers':currManagers = new Business();
                            currManagers.premium = false;
                            currManagers.nature = 'manager';
                            currManagers.show(totalListedItems, (currentPage - 1) * totalListedItems);
                            break;
            case 'Suppliers':currSuppliers = new Business();
                            currSuppliers.premium = false;
                            currSuppliers.nature = 'supplier';
                            currSuppliers.show(totalListedItems, (currentPage - 1) * totalListedItems);
                            break;
        }
    }
    /** Funtion that reload the app */
    function returnHome(){
        evtCatToDisp=0; clientLocation=""; currentSelectedMenu='Events';
        $("#all-events").attr('data-end','1');//Reset the home page back to 0 offset
        $('#pageSecondHeader h4').text("All Upcoming Events");
        refreshContent();
    }
    /** Function that display separate html documnt as dialog pages
    *  @param {string} page internal existing page to be opened as dialog
    *  @param {string} transition Transition type
    */
    function showDialog(page, transition){
        $.mobile.pageContainer.pagecontainer('change', page,{ 
            allowSamePageTransition: true,
            showLoadMsg : true,
            transition: transition,
            reloadPage: true
           //role: "dialog" 
        });
    }
    
    /** Function that set the footer status */
    function setFooterStatus(){
        switch(footerStatus){//$('select[name=show-footer-flip] option[value='+footerStatus+']').prop('selected',true);
            case 'hide': $('#show-footer span').text('Hide Footer');//else{$('#show-footer span').text('Show Footer');}
                        $('.page-footer-content').show();
                        $('#show-footer-icon').removeClass('fa-toggle-off').addClass('fa-toggle-on');
                        dailyQuote = new Quote();//Instantiate quote class
                        dailyQuote.show(totalQuotes, false);//Show daily quote
                        footerStatus = 'show';//update the footer status
                        break;
            case 'show':  $('#show-footer span').text('Show Footer');
                        $('#show-footer-icon').removeClass('fa-toggle-on').addClass('fa-toggle-off');
                        $('.page-footer-content').hide();
                        footerStatus = 'hide';//update the footer status
                        break;
        }
    }
        
    //=== Load the spinner if an ajaxStart occurs; stop when it is finished ==//
    $(document).on({
        ajaxStart: function() {$.mobile.loading( 'show', {text: "Loading..",textVisible: true,theme: "a"  /*textonly: textonly,  html: html */ }); },
        ajaxStop: function() { $.mobile.loading('hide');}    
    });
    
    //============== Event by categories ====== //
    $('#event-categories').bind({
        tap: function(){showDialog('dialogs/events-categories.html', 'flow');}
    });
    
    //==== Delegate actions on Ajax Loaded Events Categories ==//
    $(document).on('tap','#events-categories-page li a',function(){
        var categoryId = $(this).attr('id').replace('category','');//get the category id
        window.history.back();
        clientLocation="";//reset the client location
        currentSelectedMenu='Events';//if not in events page set it to it
        prevEvtHeader = $('#pageSecondHeader h4').text();
        $("#all-events").attr('data-end','1');//Reset the home page back to 0 offset
        if($(this).text()==="All Categories") {$('#pageSecondHeader h4').text("All Upcoming Events");}
        else{if($(this).text().length<32){$('#pageSecondHeader h4').text($(this).text());}else{$('#pageSecondHeader h4').text($(this).text().substr(0,31)+'..');}}
        evtCatToDisp = categoryId;//Set the gategory to be displayed to the clicked one
        refreshContent();
    });
    //=== Menu All Events Listing click ===//
    $('#event-all-listing').on('tap', returnHome);
    //===== Load events at my location ===//
    $('#event-at-mylocation').bind({
        tap: function(){
            navigator.geolocation.getCurrentPosition(function (pos) {
                var geocoder = new google.maps.Geocoder();
                var lat = pos.coords.latitude;
                var lng = pos.coords.longitude;
                var latlng = new google.maps.LatLng(lat, lng);
                //reverse geocode the coordinates, returning location information.
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    var result = results[0];
                    var state = '';
                    for (var i = 0, len = result.address_components.length; i < len; i++) {
                        var ac = result.address_components[i];
                        if (ac.types.indexOf('administrative_area_level_1') >= 0) {
                            state = ac.short_name;
                        }
                    }
                    clientLocation = state;//set the client location to the value
                    currentSelectedMenu='Events';
                    currentPage = 1;
                    prevEvtHeader = $('#pageSecondHeader h4').text();
                    $('#all-events').attr('data-end', "1");//set the paging to page 1
                    $('#pageSecondHeader h4').text('Event in this Locality ['+state+']');
                    refreshContent(); //reload the events
                });
            });
        }
    });
    
    //===== Event locations Menu Handler===//
    $('#event-at-alocation').bind({tap: function(){ showDialog('dialogs/events-userchosen-location.html', 'turn'); } });
    
    //==== Actions on Ajax Loaded Events Location ==//
    $(document).on('tap','#events-locations-page li a',function(){
        clientLocation = $(this).text();//set the client location to the value
        window.history.back();
        prevEvtHeader = $('#pageSecondHeader h4').text();
        $('#pageSecondHeader h4').text("Events in "+clientLocation);
        currentSelectedMenu='Events';
        $('#all-events').attr('data-end', "1");//set the paging to page 1
        refreshContent(); //reload the events
    });
    $(document).on('tap','#events-locations-page button',function(){
        clientLocation = $('#events-locations-page #user-supp-loc').val();//set the client location to the value
        window.history.back();
        currentSelectedMenu='Events';
        prevEvtHeader = $('#pageSecondHeader h4').text();
        $('#pageSecondHeader h4').text("Events in "+clientLocation);
        $('#all-events').attr('data-end', "1");//set the paging to page 1
        refreshContent(); //reload the events
    });
    
    //===== Open Login Page ====//
    $('#pageapp-login').bind({
        tap: function(){ 
            if(parseInt(appUser.userId)===0){
                showDialog('dialogs/login.html', 'slideup'); 
            }else{
                $("#message-dialog .ui-content h1").text("Already Login");
                $("#message-dialog .ui-content p").text("Your name is "+appUser.username+'. To login as a different user, first logout then login.');
                $("#message-dialog").popup({'transition':'pop','overlayTheme':'b', 'positionTo':'window'}).popup("open");
            }
        } 
    });
    //=== On login button click ==//
    $(document).on('tap','#login-page #login-button', function(){ 
        appUser.email = $('#login-page .login-username').val();//get email
        appUser.password = $('#login-page .login-password').val();//get password
        appUser.userType = $('#login-page #select-usertype-login').val();//get password
        appUser.signIn();//call sign in method
    });
    
    //=== Logout Handler ==//
    $('#pageapp-logout').bind({
        tap: function(){ 
            if(parseInt(appUser.userId)!==0){
                appUser.userId=0;appUser.email,appUser.userType,appUser.username,appUser.password='';//reset appUser object
                $('#pageapp-logout-li').hide();//hide signout menu
                $('#pageapp-login-li').show();//show login menu
                //Then show signed success message
                $("#message-dialog .ui-content h1").text("Signed Out");
                $("#message-dialog .ui-content p").text('You have successfully signed out.');
                $("#message-dialog").popup({'transition':'pop','overlayTheme':'b', 'positionTo':'window'}).popup("open");
            }
        } 
    });
    
    //==== Show Footer handler ===//
    $('#show-footer').bind({tap: setFooterStatus});
    
    //=== Reset App Content ===//
    $('#reset-content-menu').bind({tap:returnHome});
    
    //=== All Venues Handler ===//
    $("#all-venues").bind({
        tap: function(){
            //reset previous pagination values
            evtCatToDisp=0; clientLocation="";currentPage =1; $("#all-events").attr('data-end','1');
            //Set the app to switch to venue settings
            currentSelectedMenu = 'Venues';
            $('#pageSecondHeader h4').text("All Available Venues");
            //create instance of business class
            providers = new Business();
            providers.premium = false;
            providers.showVenues(totalListedItems, (currentPage - 1) * totalListedItems);
        }
    });
    
    //=== All training providers ===//
    $("#all-training-providers").bind({
        tap: function(){
            //reset previous pagination values
            evtCatToDisp=0; clientLocation="";currentPage =1; $("#all-events").attr('data-end','1');
            //Set the app to switch to venue settings
            currentSelectedMenu = 'Trainings';
            $('#pageSecondHeader h4').text("All Training Providers");
            //create instance of business class
            trProviders = new Business();
            trProviders.premium = false;
            trProviders.nature = 'training';
            trProviders.show(totalListedItems, (currentPage - 1) * totalListedItems);
        }
    });
    
    //==== All Managers [Events Managers] ===//
    $('#all-event-managers').bind({
        tap: function(){
            //reset previous pagination values
            evtCatToDisp=0; clientLocation="";currentPage =1; $("#all-events").attr('data-end','1');
            //Set the app to switch to venue settings
            currentSelectedMenu = 'Managers';
            $('#pageSecondHeader h4').text("All Event Managers");
            //create instance of business class
            evtManagers = new Business();
            evtManagers.premium = false;
            evtManagers.nature = 'manager';
            evtManagers.show(totalListedItems, (currentPage - 1) * totalListedItems);
        }
    });
    
    //=== All Equpment Suppliers ===//
    $('#all-equipment-suppliers').bind({
        tap: function(){
            //reset previous pagination values
            evtCatToDisp=0; clientLocation="";currentPage =1; $("#all-events").attr('data-end','1');
            //Set the app to switch to venue settings
            currentSelectedMenu = 'Suppliers';
            $('#pageSecondHeader h4').text("All Equipment Suppliers");
            //create instance of business class
            eqpSuppliers = new Business();
            eqpSuppliers.premium = false;
            eqpSuppliers.nature = 'supplier';
            eqpSuppliers.show(totalListedItems, (currentPage - 1) * totalListedItems);
        }
    });
    
    //=== Contact Menu click Handler ===//
    $('#contact-nst').bind({tap: function(){ showDialog('dialogs/contact-us.html', 'flip'); } });
    
    //=== Signup menu handler ===//
    $('#signup-menu').bind({tap: function(){ showDialog('dialogs/page-soon.html', 'flip'); } });
    
    //=== Footer refresh button
    $('.footer-up').on('tap', function(){returnHome();});
    
});
}(jQuery));