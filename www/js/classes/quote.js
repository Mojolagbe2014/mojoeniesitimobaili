/* global siteRoot */
/** Daily Quote class */
function Quote(){
    this.quoteId;
    this.quote;
    this.showDate;
    this.author;
    this.quoteImage;
    this.year;
    this.tags;
    this.status;
}
/** Display quotes either all or today's quote only
 * @param {int} maximum number of quotes to show
 * @param {boolean} isToday whether to show only today's quotes[true] or not[false]
 */
Quote.prototype.show = function(maximum, isToday){
    // get JSON-formatted Quotes from the server
    $.ajax({
        // the URL for the request
        url : url+'show-quote.php',
        // the data to send (will be converted to a query string)
        data : {totalquotes: maximum, istoday: isToday}, //set get variables
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
                $("#message-dialog .ui-content h1").text("Daily Quotes Error");
                $("#message-dialog .ui-content p").text(data.msg);
                showMessageDialog('flow');
                //$("#message-dialog").popup({'transition':'pop','overlayTheme':'b'}).popup("open");
            }
            //Else show the fetched quotes if quotes is not empty
            else if(data.status===1 && data.info.length > 0){
                $.each(data.info, function(i, item) {//Replace the quote contents 
                    $('#quote-'+(i+1)).html('<p data-qid="'+item.qid+'">'+item.quote+'<br><a href="#">'+item.author+'</a></p>');
                });
            }
        },
        // code to run if the request fails; the raw request and status codes are
        // passed to the function
        error : function(xhr, status) {
            $("#message-dialog .ui-content h1").text("Problem Loading Quotes");
            $("#message-dialog .ui-content p").text("There is a problem connecting to internet. Please review your internet connection.");
            showMessageDialog('flow');
            //$("#message-dialog").popup().popup("open"); //show end of events dialog
        },
        // code to run regardless of success or failure
        complete : function(xhr, status) {
        }
    });
};

