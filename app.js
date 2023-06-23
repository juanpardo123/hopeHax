import bodyParser from "body-parser";
import express from "express";

//imports bcrypt. bcrypt is used to hash and salt user passwords.
// import bcrypt from 'bcrypt';
//import axios. axios in this application is used to handle API requests.
import axios from "axios";

import {
  deleteRecipeByID,
  getfoodsByID,
  createUser,
  createFoods,
  getUsers,
  getUserInfo,
  createUserInfo,
  getUserIDByUserName,
  deleteFoodByID,
  getfoodsHistoryByID,
  createRecipeList,
  getRecipeByID,
} from "./database.js";

export let globalUserID = null;
export let globalUserData = null;
export let globalTheme = null;

const app = express();
const port = 3000;

//allows for body of requests to be read (ex. req.body.foo )
app.use(bodyParser.urlencoded({ extended: true }));

//sets the render engine to be ejs. allows the use of .ejs files
app.set("view engine", "ejs");

//makes the 'public' folder globally accessible
app.use(express.static("public"));

//creates server at specified port
app.listen(port, () => {
  console.log(`listening at ${port}`);
});

//handles get request for default route.
//if user is logged in
// 'index' page is rendered with appropriate User info
//else
//login page is rendered
app.get("/", async (req, res) => {
  if (globalUserID) {
    let foods = await getfoodsByID(globalUserID);
    let foodData = await getfoodsHistoryByID(globalUserID);
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let totalItems = 0;
    let target = globalUserData.User_target_calories;
    foods.forEach((e) => {
      totalCalories += Number(e.Food_Calories);
      totalProtein += Number(e.Food_Protein);
      totalCarbs += Number(e.Food_Carbs);
      totalFats += Number(e.Food_Fats);
      totalItems++;
    });
    let remaining = target - totalCalories;
    // console.log(foodData);
    res.render("index", {
      userData: globalUserData,
      totalCalories: totalCalories,
      totalProtein: totalProtein,
      totalCarbs: totalCarbs,
      totalFats: totalFats,
      totalItems: totalItems,
      target: target,
      remaining: remaining,
      foodData: foodData,
    });
  } else {
    res.render("login");
  }
});

//Handles post request for search.
//  If user is logged in
// the input on the search field is passed to the getItemApi function and if succesful renders 'singleItem'page with respective result and user info.
// else
// login page is rendered
app.post("/search", async (req, res) => {
  if (globalUserID) {
    let search = req.body.name;
    try {
      let result = await getItemApi(search);
      res.render("singleItem", { data: result, userData: globalUserData });
    } catch {
      let suggestions = await getSuggestionsApi(search.substring(0, 3));
      res.render("suggestions", {
        data: suggestions,
        userData: globalUserData,
      });
    }
  } else {
    res.render("login");
  }
});

//handles post request for login.
//Verifies if the username and password combination exist within data base. (password is compared with stored password hash using bcrypt).
//if sucessful
//main page is rendered with appropiate user info.
//else
//user is redirected to default page (login page)
app.post("/login", async (req, res) => {
  let userName = req.body.userName;
  let password = req.body.password;

  let data = await getUsers();
  let successfulLogin = false;
  data.forEach((element) => {
    let passCheck = true;
    let userCheck = userName == element.Username;
    if (passCheck && userCheck) {
      globalUserID = element.ID;
      successfulLogin = true;
    }
  });

  if (successfulLogin) {
    globalUserData = await getUserInfo(globalUserID);
    globalTheme = globalUserData.User_preferences;
    console.log(globalTheme);
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

//handles post request for saving food info.
// Takes the properties of the searched item and saves it into the database along with the appropriate userID. For later reference.
//user is then redirected to main page (Dashboard)
app.post("/save", (req, res) => {
  if (globalUserID) {
    let grams = req.body.grams;

    let foodName = req.body.foodName;
    let foodCalories = calculateCalories(Number(req.body.foodCalories), grams);
    let foodProtein = calculateCalories(Number(req.body.foodProtein), grams);
    let foodFats = calculateCalories(Number(req.body.foodFats), grams);
    let foodCarbs = calculateCalories(Number(req.body.foodCarbs), grams);
    let foodImage = req.body.foodImage;

    createFoods(
      globalUserID,
      foodName,
      foodCalories,
      foodProtein,
      foodCarbs,
      foodFats,
      foodImage,
      grams
    );
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

app.post("/saveRecipe", (req, res) => {
  if (globalUserID) {
    let recipeName = req.body.recipeName;
    let recipeImage = req.body.recipeImage;
    let recipeCalories = req.body.recipeCalories;
    let recipeTotalWeight = req.body.recipeTotalWeight;
    let recipeTotalTime = req.body.recipeTotalTime;
    let recipeYield = req.body.recipeYield;
    let recipeIngredients = req.body.ingredients;
    let recipeMealType = req.body.recipeMealType;
    let RecipeURL = req.body.RecipeURL;

    createRecipeList(
      globalUserID,
      recipeName,
      recipeImage,
      recipeCalories,
      recipeTotalWeight,
      recipeTotalTime,
      recipeYield,
      recipeMealType,
      RecipeURL,
      recipeIngredients
    );
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

//handles get request for "/list" (Food List).
//if user is logged in
//a function that retreives the foods based on the user id is called. page 'userItems is then rendered with appropriate details
//else
//user is redirected to default page (Login page)
app.get("/list", async (req, res) => {
  if (globalUserID) {
    let userFoodList = await getfoodsByID(globalUserID);
    let userRecipes = await getRecipeByID(globalUserID);
    res.render("userItems", {
      foodList: userFoodList,
      userData: globalUserData,
      userRecipes: userRecipes,
    });
  } else {
    res.redirect("/");
  }
});

//handles post request to log out user. globalUserID and globalUserData are initiallized.
app.post("/logOut", (req, res) => {
  globalUserID = null;
  globalUserData = null;
  res.redirect("/");
});

//handles get request for '/profile' (user profile page)
//if user is logged in
//profile page is rendered with appropriate data
//else
// user is redirected to default page (login page)

app.get("/profile", async (req, res) => {
  if (globalUserID) {
    res.render("profile", { userData: globalUserData });
  } else {
    res.redirect("/");
  }
});

//Handles get request for '/create'. renders the signup user page
app.get("/create", (req, res) => {
  res.render("create");
});

//handles post request for creating a new user
app.post("/create", async (req, res) => {
  let username = req.body.userName;
  let password = req.body.password;
  let passwordRepeat = req.body.passwordrepeat;
  let name = req.body.name;
  let height = req.body.height;
  let weight = req.body.weight;
  let target = Number(req.body.target);
  let preferences = req.body.theme;

  if (password == passwordRepeat) {
    let User = await createUser(username, password);
    let newUserID = await getUserIDByUserName(User);
    // console.log('-------------->',newUserID)
    if (newUserID) {
      await createUserInfo(
        newUserID,
        name,
        height,
        weight,
        target,
        preferences
      );
      res.redirect("/");
    } else {
      console.log("user name is not available");
      res.redirect("/create");
    }
  } else {
    //replace with handled error
    console.log("Passwords do not match");
    res.redirect("/create");
  }
});

app.post("/listDelete", async (req, res) => {
  let itemID = req.body.foodID;
  await deleteFoodByID(itemID);
  res.redirect("/list");
});
app.post("/listDeleteRecipe", async (req, res) => {
  let itemID = req.body.recipeID;
  await deleteRecipeByID(itemID);
  res.redirect("/list");
});

//ROUTE HANDLING
app.get("/recipes", async (req, res) => {
  const query = req.query.query; //grabbing query parameter from request
  try {
    const recipes = await getRecipes(query);
    if (recipes.length > 0) {
      res.render("recipes", { recipes: recipes }); //Showing the template on browser with the data
    } else {
      res.render("recipes", { recipes: null });
    }
  } catch (error) {
    ///console.log(error);
    res.status(500).send("ERROR ERROR ERROR");
  }
});
//------------API's---------------

async function getSuggestionsApi(initials) {
  const url = `https://api.edamam.com/auto-complete?app_id=ec4bcbe9&app_key=c4e46792050ed99dfd8d58e9e9101c63&q=${initials}&limit=10
  `;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getSuggestionsApiRecipes(initials) {
  const url = `https://api.edamam.com/auto-complete?app_id=ec4bcbe9&app_key=c4e46792050ed99dfd8d58e9e9101c63&q=${initials}&limit=10
  `;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
//calls api request with search of specified item
//if found successfully
//object with details is returned
//else
//error is thrown

const app_id = "061a2f9a";
const app_key = "6a719576f78b348e623127896290738c";

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

function calculateCalories(item, amount) {
  let newValue = item / 100;
  let total = newValue * amount;
  return total;
}

//RECIPES PAGE
const app_id2 = "f6811248";
const app_key2 = "55aebe44f4785021c5eb4276e7f46710";
async function getRecipes(query) {
  const url2 = `https://api.edamam.com/search?app_id=${app_id2}&app_key=${app_key2}&q=${query}`;
  try {
    const response = await axios.get(url2);
    // console.log(response);
    const data = response.data;
    //console.log(data.hits);
    return data.hits;
  } catch (error) {
    console.error(error);
    return [];
  }
}
//ROUTE HANDLING
app.get("/recipes", async (req, res) => {
  const query = req.query.query; //grabbing query parameter from request
  try {
    const recipes = await getRecipes(query);
    if (recipes.length > 0) {
      res.render("recipes", { recipes: recipes }); //Showing the template on browser with the data
    } else {
      res.render("recipes", { recipes: null });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("ERROR ERROR ERROR");
  }
});

app.post("/recipeItems", async (req, res) => {
  const search2 = req.body.query;
  try {
    let result2 = await getRecipes(search2);
    search2;
    res.render("recipeItems", {
      recipes: result2,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("ERROR ERROR ERROR");
  }
});

app.get("/aboutUs", (req, res) => {
  res.render("about-us");
});

app.get("/blog", (req, res) => {
  res.render("blog");
});

app.locals.userData = globalUserData;
