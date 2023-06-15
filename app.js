import fs from 'fs';
import http from 'https'
import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import {getfoods, getfoodsByID, createUser} from './database.js'

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
    res.render('index');
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
