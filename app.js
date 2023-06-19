import bodyParser from 'body-parser';
import express from 'express';

//imports bcrypt. bcrypt is used to hash and salt user passwords.
import bcrypt from 'bcrypt';
//import axios. axios in this application is used to handle API requests.
import axios from 'axios';

import {getfoods, getfoodsByID, createUser, createFoods, getUsers, getUserInfo} from './database.js'



export let globalUserID = null;
export let globalUserData = null;


const app = express();
const port = 3000;

const app_id = 'e74cfc4c';
const app_key = 'f2390ae95179e70da980b011ef24d3f1'


//allows for body of requests to be read (ex. req.body.foo )
app.use(bodyParser.urlencoded({extended:true}));

//sets the render engine to be ejs. allows the use of .ejs files
app.set('view engine', 'ejs');

//makes the 'public' folder globally accessible 
app.use( express.static( "public" ) );


//creates server at specified port
app.listen(port,()=>{
    console.log(`listening at ${port}`);
});


//handles get request for default route.
  //if user is logged in
      // 'index' page is rendered with appropriate User info
  //else
      //login page is rendered
app.get('/', (req,res)=>{
  if(globalUserID){
    res.render('index', {userData: globalUserData});
  }else{
    res.render('login');
  }
   
})

//Handles post request for search. 
//  If user is logged in
      // the input on the search field is passed to the getItemApi function and if succesful renders 'singleItem'page with respective result and user info.
// else 
      // login page is rendered
app.post('/search', async (req, res) => {
  if(globalUserID){
    try {
      let search = req.body.name;
      let result = await getItemApi(search);
      res.render('singleItem', {data:result,userData: globalUserData});
    } catch (error) {
      res.render('error');
    }
  }else{
    res.render('login');
  }
    
  });

//handles post request for login. 
//Verifies if the username and password combination exist within data base. (password is compared with stored password hash using bcrypt). 
//if sucessful
    //main page is rendered with appropiate user info. 
//else
    //user is redirected to default page (login page)
  app.post('/login', async (req, res) => {
    let userName = req.body.userName;
    let password = req.body.password;
    
    let data = await getUsers();
    let successfulLogin = false;
    data.forEach(element => {
      let passCheck = bcrypt.compareSync(password, element.Password);
      let userCheck = (userName == element.Username);
      if(passCheck && userCheck){
        globalUserID = element.ID;
        successfulLogin = true;

      }
     
     });

    if(successfulLogin){
      globalUserData = await getUserInfo(globalUserID);
      res.render('index', {userData: globalUserData})
    }
    else{
      res.redirect('/');
    }
    
  })

//handles post request for saving food info.
// Takes the properties of the searched item and saves it into the database along with the appropriate userID. For later reference. 
//user is then redirected to main page (Dashboard)
  app.post('/save', (req,res)=>{
    let foodName = req.body.foodName;
    let foodCalories = Number(req.body.foodCalories);
    let foodProtein = Number(req.body.foodProtein);
    let foodFats = Number(req.body.foodFats);
    let foodCarbs = Number(req.body.foodCarbs);
    let foodImage = req.body.foodImage;
    createFoods(globalUserID,foodName, foodCalories, foodProtein, foodCarbs, foodFats, foodImage);
    res.redirect("/")
  })
  
//calls api request with search of specified item 
//if found successfully 
    //object with details is returned  
//else 
    //error is thrown  
  async function getItemApi(ingredient) {
    const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${app_id}&app_key=${app_key}&ingr=${ingredient}`;
    try {
      const response = await axios.get(url);
      const data = response.data;
      return data.parsed[0].food;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


//handles get request for "/list" (Food List).
//if user is logged in
    //a function that retreives the foods based on the user id is called. page 'userItems is then rendered with appropriate details
//else
    //user is redirected to default page (Login page)
  app.get('/list', async (req,res)=>{
    if(globalUserID){
      let userFoodList = await getfoodsByID(globalUserID);
      res.render('userItems',{foodList:userFoodList,userData: globalUserData });
    } else{
      res.redirect('/');
    }
  
  })

  //handles post request to log out user. globalUserID and globalUserData are initiallized.
  app.post('/logOut', (req,res)=>{
     globalUserID = null;
    globalUserData = null;
    res.redirect('/')
  })

//handles get request for '/profile' (user profile page)
//if user is logged in 
    //profile page is rendered with appropriate data
//else
    // user is redirected to default page (login page)
  
  app.get('/profile', async (req,res)=>{
    if(globalUserID){
      res.render('profile',{userData: globalUserData });
    } else{
      res.redirect('/');
    }
  
  })

//Handles get request for '/create'. renders the signup user page
  app.get('/create',(req,res)=>{
   res.render('create');
  })


  //handles post request for creating a new user
  app.post('/create', (req,res)=>{

  })

app.locals.userData = globalUserData;

