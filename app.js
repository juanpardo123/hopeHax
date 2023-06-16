import fs from 'fs';
import http from 'https'
import express from 'express';
import bcrypt from 'bcrypt';
import axios from 'axios';
import bodyParser from 'body-parser';
import {getfoods, getfoodsByID, createUser, createFoods, getUsers, getUserInfo} from './database.js'



export let globalUserID = null;
export let globalUserData = null;


const app = express();
const port = 3000;

const app_id = 'e74cfc4c';
const app_key = 'f2390ae95179e70da980b011ef24d3f1'


app.use(bodyParser.urlencoded({extended:true}));


app.set('view engine', 'ejs');

app.use( express.static( "public" ) );



app.listen(port,()=>{
    console.log(`listening at ${port}`);
});

app.get('/', (req,res)=>{
  if(globalUserID){
    console.log(globalUserID);
    console.log(globalUserData);
    res.render('index', {userData: globalUserData});
  }else{
    res.render('login');
  }
   
})

app.post('/search', async (req, res) => {
    try {
      let search = req.body.name;
      console.log(search);
      let result = await getItemApi(search);
      console.log(result);
      res.render('singleItem', {data:result});
    } catch (error) {
      console.error(error);
      res.render('error');
    }
  });

  app.post('/login', async (req, res) => {
    let userName = req.body.userName;
    let password = req.body.password;
    
    let data = await getUsers();
    console.log(data)
    let successfulLogin = false;
    data.forEach(element => {
      console.log(password, element.Password,(password == element.Password), userName, element.Username, (userName == element.Username))
      let passCheck = bcrypt.compareSync(password, element.Password);
      let userCheck = (userName == element.Username);
      if(passCheck && userCheck){
        globalUserID = element.ID;
        successfulLogin = true;

      }
     
     });

    console.log("sucess", successfulLogin)
    if(successfulLogin){
      globalUserData = await getUserInfo(globalUserID);
      res.render('index', {userData: globalUserData})
    }
    else{
      res.redirect('/');
    }
    
  })

  app.post('/save', (req,res)=>{
    let foodName = req.body.foodName;
    let foodCalories = Number(req.body.foodCalories);
    let foodProtein = Number(req.body.foodProtein);
    let foodFats = Number(req.body.foodFats);
    let foodCarbs = Number(req.body.foodCarbs);
    createFoods(1,foodName, foodCalories, foodProtein, foodCarbs, foodFats);
    res.redirect("/")
  })
  
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
//Api implementation

app.locals.userData = globalUserData;

