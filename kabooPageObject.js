var KabooPageObject = function () {    

    //elements to access
    var username = element(by.name('email'));
    var password = element(by.name('pwd'));
    var loginButton = element(by.xpath('//button[@ng-click=\'authenticate(formLogin)\']'));
    var profileIcon = element(by.id('profile')); 
    
    this.sleep = function(){
        browser.sleep(3000);       
    };

    this.navigateToURL =  function (url) {       
        browser.get(url);            
        browser.driver.manage().window().maximize();
        browser.sleep(3000); 
   };

    this.setUsername =  function (user) {        
        username.sendKeys(user);
   };

   this.setPassword =  function (pass) {    
        password.sendKeys(pass);
    };

   this.login =  function () {    
        loginButton.click();
    };

    this.verifyUserIsLogged =  function () {
        var until = protractor.ExpectedConditions;
        browser.wait(until.presenceOf(profileIcon), 10000, 'Profile icon taking too long to appear in the DOM on Login');
        expect(profileIcon.isPresent()).toBe(true);
    };  
};

module.exports = new KabooPageObject();