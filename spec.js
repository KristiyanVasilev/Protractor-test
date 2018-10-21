/*jshint esversion: 6 */

var kabooPage = require('./KabooPageObject');
var signUpPage = require('./SignUpPage');

beforeEach(() => {
  //to avoid authentication use https://username:password@qatest.staging.kaboo.com
  kabooPage.navigateToURL('https://qatest.staging.kaboo.com');  
});

afterEach(() => {
  kabooPage.sleep();  
});

describe('Kaboo signup form', function() {
  it('registers new customer', function() {       
    signUpPage.clickOnRegBtn();
    signUpPage.setEmail('Qatest@mail.test');
    signUpPage.setUserName('qaTest123');
    signUpPage.setPassword('Marbella999');
    signUpPage.repeatePassword('Marbella999');
    signUpPage.checkTermsBtn();    
    signUpPage.checkPrivacyBtn();
    signUpPage.clickNextBtn();
    signUpPage.setFirstname('QaTestAccount');
    signUpPage.setLastname('QaTestAccount');
    signUpPage.setBirthDate('01', '01', '1990');
    signUpPage.setAddress('test address 12345');
    signUpPage.setPostalcode('Test postal code');
    signUpPage.setCity('Test City');
    signUpPage.setPhoneNumber('123456789');
    signUpPage.ClickRegisterNowBtn();   
    signUpPage.verifyUserIsRegistered(); 
   });
 });

 describe('Kaboo login form', function() {
  it('login registrated user', function() {     
   kabooPage.setUsername('autouk');
   kabooPage.setPassword('Autotest1');
   kabooPage.login();
   kabooPage.verifyUserIsLogged(); 
});
});





