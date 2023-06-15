import fs from 'fs';
import http from 'https'
import express from 'express';
import bodyParser from 'body-parser';
//import {getfoods, getfoodsByID, createUser} from './database'

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({extended:true}));


app.set('view engine', 'ejs');

app.use( express.static( "public" ) );



app.listen(port,()=>{
    console.log(`listening at ${port}`);
});

app.get('/', (req,res)=>{
    res.render('index');
})

//Api implementation
const app_id = 'e74cfc4c';
const app_key = 'f2390ae95179e70da980b011ef24d3f1'
const ingredient = "apple"
const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${app_id}&app_key=${app_key}&ingr=${ingredient}`;


import axios from 'axios';

axios.get(url)
  .then(response => {
    const data = response.data;
console.log (data.parsed[0].food)
console.log (data.parsed[0].food.nutrients)})
