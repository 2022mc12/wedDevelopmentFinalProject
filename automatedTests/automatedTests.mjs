import { By, Key, Builder } from 'selenium-webdriver';
// Refer to README for a list of references for the selenium testing code

let driver = await new Builder().forBrowser("chrome").build();

// addTaken Page 

// tests if the View Tracker Link is working on the /addTaken page
await driver.get("http://linserv1.cims.nyu.edu:20108/addTaken");
let Link = await driver.findElement(By.name("LinkToMyTracker"));
await Link.click();
let currentURL = await driver.getCurrentUrl()
console.log("Tests the View Tracker Link on the /addTaken page")
console.log(currentURL === "http://linserv1.cims.nyu.edu:20108/my-tracker");


// tests if the Delete Courses Link is working on the /addTaken page
await driver.get("http://linserv1.cims.nyu.edu:20108/addTaken");
Link = await driver.findElement(By.name("LinkToDeleteTaken"));
await Link.click();
currentURL = await driver.getCurrentUrl()
console.log("Tests the Delete Courses Link on the /addTaken page")
console.log(currentURL === "http://linserv1.cims.nyu.edu:20108/deleteTaken");

// tests the addCourse page to see if it redirects
await driver.get("http://linserv1.cims.nyu.edu:20108/addTaken");
let input = await driver.findElement(By.name("addCourse"));
input.sendKeys("CSCI-UA 201");
let submitButton = await driver.findElement(By.name("submitButton"));
await submitButton.click();
currentURL = await driver.getCurrentUrl()
console.log("Tests the add course functionality on the /addTaken page and if it redirects")
console.log(currentURL === 'http://linserv1.cims.nyu.edu:20108/addTaken')






// deleteTaken Page

//tests if the View Tracker Link is working on the /deleteTaken page
await driver.get("http://linserv1.cims.nyu.edu:20108/deleteTaken");
Link = await driver.findElement(By.name("LinkToMyTracker"));
await Link.click();
currentURL = await driver.getCurrentUrl()
console.log("Tests the View Tracker Link on the /deleteTaken page")
console.log(currentURL === "http://linserv1.cims.nyu.edu:20108/my-tracker");

// tests if the Add Courses Link is working on the /deleteTaken page
await driver.get("http://linserv1.cims.nyu.edu:20108/deleteTaken");
Link = await driver.findElement(By.name("LinkToAddTaken"));
await Link.click();
currentURL = await driver.getCurrentUrl()
console.log("Tests the Add Courses Link on the /deleteTaken page")
console.log(currentURL === "http://linserv1.cims.nyu.edu:20108/addTaken");




// createUser page

// tests if the createUser Page is about to create users
await driver.get("http://linserv1.cims.nyu.edu:20108/createUser");
input = await driver.findElement(By.name("username"));
input.sendKeys("112233");
input = await driver.findElement(By.name("password"));
input.sendKeys("112233")
submitButton = await driver.findElement(By.name("submitButton"));
await submitButton.click();
currentURL = await driver.getCurrentUrl()
console.log("Tests if the /createUser Page is about to create users")
console.log(currentURL === "http://linserv1.cims.nyu.edu:20108/login") // if creation of account is successful, it will redirect to the login page




//login page

// tests if the Create User Link is working on the login page 
await driver.get("http://linserv1.cims.nyu.edu:20108/login");
Link = await driver.findElement(By.name("LinkToCreateUser"));
await Link.click();
currentURL = await driver.getCurrentUrl()
console.log("Tests the Create User Link on the /login page")
console.log(currentURL === "http://linserv1.cims.nyu.edu:20108/createUser");

// tests if the created user account is able to be used for login
await driver.get("http://linserv1.cims.nyu.edu:20108/login");
input = await driver.findElement(By.name("username"));
input.sendKeys("112233");
input = await driver.findElement(By.name("password"));
input.sendKeys("112233")
submitButton = await driver.findElement(By.name("submitButton"));
await submitButton.click();
currentURL = await driver.getCurrentUrl()
console.log("Tests if registered user is able to login on the /login page")
console.log(currentURL === "http://linserv1.cims.nyu.edu:20108/my-tracker") // if login is successful, it will redirect to the my-tracker page





// my-tracker page

// tests if the Add Courses Link is working on the /my-tracker page
await driver.get("http://linserv1.cims.nyu.edu:20108/my-tracker");
Link = await driver.findElement(By.name("LinkToAddTaken"))
await Link.click();
currentURL = await driver.getCurrentUrl()
console.log("Tests the Add Courses Link on the /my-tracker page")
console.log(currentURL === "http://linserv1.cims.nyu.edu:20108/addTaken");

// tests if the Delete Courses Link is working on the my-tracker page
await driver.get("http://linserv1.cims.nyu.edu:20108/my-tracker");
Link = await driver.findElement(By.name("LinkToDeleteTaken"));
await Link.click();
currentURL = await driver.getCurrentUrl()
console.log("Tests the Delete Courses Link on the /my-tracker page")
console.log(currentURL === "http://linserv1.cims.nyu.edu:20108/deleteTaken");

// tests if the Logout Link is working on the my-tracker page
await driver.get("http://linserv1.cims.nyu.edu:20108/my-tracker");
Link = await driver.findElement(By.name("LinkToLogOut"));
await Link.click();
currentURL = await driver.getCurrentUrl()
console.log("Tests the Logout Link on the /my-tracker page")
console.log(currentURL === "http://linserv1.cims.nyu.edu:20108/login");





