/* global appUser, appBusinessUser */

/** Constructor for application user object */
function User() {
  // always initialize all instance properties
  this.userId = 0;
  this.userType = '';
  this.firstName = ''; 
  this.lastName = ''; 
  this.sex = ''; 
  this.phoneNo = ''; 
  this.email = ''; 
  this.organization = ''; 
  this.address = ''; 
  this.city = ''; 
  this.state = ''; 
  this.country = ''; 
  this.category = ''; 
  this.confirms = ''; //in design it is [confirm]
  this.username = ''; 
  this.password = ''; 
  this.designation = ''; 
  this.registrationDate = ''; 
  this.notificationDate = ''; 
}

/*  class methods  */
/** Method for Registration */
User.prototype.register = function() {
    
};
/** Method for Signing In both subscriber and business 
 */
User.prototype.signIn = function() {
    $.ajax({
        // the URL for the request
        url : url+'login.php',
        // the data to send (will be converted to a query string)
        data : { email : this.email, pwd: this.password, usertype: this.userType},
        // whether this is a POST or GET request
        type : 'POST',
        //Do not allow cache
        cache: false,
        // the type of data we expect back
        dataType : 'JSON',
        // code to run if the request succeeds; the response is passed to the function
        success : function(data, status) {
            if(data.status === 0){$('.login-page-wrapper p').text('Login Failed ! '+data.msg).addClass('static-notification-red');}
            else if(data.status ===1 && data.info.length === 0){$('.login-page-wrapper p').text('Login Failed ! Either username or password incorrect').addClass('static-notification-red');}
            else if(data.status ===1 && data.info.length === 1){
                $.each(data.info, function(i, item) {
                    if(appUser.userType==='subscriber'){//if user is a subscriber
                        if(item.confirm==='0'){ $('.login-page-wrapper p').text(item.username.toUpperCase()+'! You have not been confirmed.').addClass('static-notification-green');        }
                        else if(item.confirm==='1'){
                            //Set the current user details
                            appUser.userId = item.sid;//Set userId to be subscriberID
                            appUser.username = item.username;
                            appUser.confirms = item.confirm;
                            $('.login-page-wrapper p').text('Login Successful ! Welocme '+item.username.toUpperCase()).addClass('static-notification-green');
                        }
                    }
                    else if(appUser.userType==='business'){//if user is a subscriber
                        if(item.status==='0'){ $('.login-page-wrapper p').text(item.business.toUpperCase()+' has not been confirmed.').addClass('static-notification-green');        }
                        else if(item.status==='1'){
                            //Set the current user details
                            appUser.userId = item.uid;
                            appUser.username = item.business;
                            
                            appBusinessUser.userId = item.uid;
                            appBusinessUser.businessId = item.bid;
                            appBusinessUser.name = item.business;
                            appBusinessUser.email = item.email;
                            appBusinessUser.description = item.description;
                            appBusinessUser.natureType = item.businesstype;
                            appBusinessUser.telephone = item.telephone;
                            appBusinessUser.website = item.website;
                            appBusinessUser.contactPerson = item.contactperson;
                            appBusinessUser.address = item.address;
                            $('.login-page-wrapper p').text('Login Successful ! Welocme '+item.business.toUpperCase()).addClass('static-notification-green');
                        }
                    }
                    //Disable the login form after successful login
                    $('#login-page .login-username').prop( "disabled", true );$('#login-page .login-password').prop('disabled',true);$('#login-page #select-usertype-login').prop('disabled',true);
                    $('#pageapp-login-li').hide();$('#pageapp-logout-li').show();//show sign out menu
                });
            }
        },
        // code to run if the request fails; the raw request and status codes are passed to the function
        error : function(xhr, status) {
            //alert(xhr);
        },
        // code to run regardless of success or failure
        complete : function(xhr, status) {
            //alert('The request is complete!');
        }
    });
};

/** Method for SignOut */
User.prototype.SignOut = function() {
    //JSON Handler
};
/* End of Class Methods */

