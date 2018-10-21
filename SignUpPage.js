 var SignUpPage = function() {  

    //elements to access
    var registerBtn = element(by.id('live-casino'));
    var email = element(by.model('authModel.email'));
    var unameField = element(by.model('authModel.username'));   
    var passwordField = element(by.xpath('//input[@ko-match-not=\'authModel.email,authModel.username\']'));
    var confirmPassword = element(by.xpath('//input[@name=\'passwordRepeat\']'));
    var termsBtn = element(by.xpath("//label[@for=\'consent_6\']"));
    var privacyBtn = element(by.css("body > div > div.s-app__page > ui-view > div > main > div > div > div > div > div > div > div > div > div > form > div.m-auth-registration__form1 > fieldset > div > ko-gdpr > div > div:nth-child(13) > label > svg"));
    var nextBtn = element(by.xpath('//button[@ng-click=\'forceValidateFields(formSignup)\'][1]'));
    var firstname = element(by.name('firstname'));
    var lastname =  element(by.name('lastname'));
    var days =  element(by.id('days'));
    var months =  element(by.id('months'));
    var years =  element(by.id('years'));
    var address =  element(by.name('address'));
    var postcode =  element(by.name('postalCode'));
    var city =  element(by.name('city'));
    var phoneNumber = element(by.name('phoneNumber'));
    var registerNowBtn = element(by.xpath('//button[@ng-show=\'regStep === 2\']'));
    var profileIcon = element(by.id('profile'));

    this.verifyUserIsRegistered =  function () {    
        var until = protractor.ExpectedConditions;
        browser.wait(until.presenceOf(profileIcon), 10000, 'Profile icon taking too long to appear in the DOM on registration');
        expect(profileIcon.isPresent()).toBe(true);              
    };  

    this.ClickRegisterNowBtn = function(){
        registerNowBtn.getLocation()
        .then(function(location) {
            return browser.executeScript('window.scrollTo('+location.x+','+location.y+')');
        });       
        registerNowBtn.click();
    };

    this.setPhoneNumber = function(str){
        phoneNumber.sendKeys(str);
    };

    this.setCity = function(str){
        city.sendKeys(str);
    };

    this.setPostalcode = function(str){
        postcode.sendKeys(str);
    };

    this.setAddress = function(str){
        address.sendKeys(str);
    };

    this.setBirthDate = function(day, month, year){
        days.sendKeys(day);
        months.sendKeys(month);
        years.sendKeys(year);
    };

    this.setLastname = function(str){        
        lastname.sendKeys(str);     
    };  

    this.setFirstname = function(str){        
        firstname.sendKeys(str);     
    };   

    this.checkPrivacyBtn = function(){                     
        privacyBtn.click();                
    };

    this.clickNextBtn = function(){    
        nextBtn.click();              
    };

    this.clickOnRegBtn = function(){          
        registerBtn.click();        
    };

    this.setEmail = function(str){              
        email.sendKeys(str);  
    };

    this.setUserName = function(str){        
        unameField.sendKeys(str);     
    };     

    this.setPassword = function(str){     
        passwordField.sendKeys(str);    
    };     

    this.repeatePassword = function(str){      
        confirmPassword.sendKeys(str);                 
    };     

    this.checkTermsBtn = function(){   
        termsBtn.getLocation()
        .then(function(location) {            
            return browser.executeScript('window.scrollTo('+location.x+','+(location.y - 100)+')');
        });       
        termsBtn.click();
    };
};

module.exports = new SignUpPage();