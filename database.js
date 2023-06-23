//Important terms:
//Hashing:
// Hashing is a one-way process of converting an input (such as a password or any other data) into a fixed-length string of characters. The resulting string, known as the hash value or digest, is unique to the input data. Hash functions are designed to be computationally efficient, producing a hash value quickly.

// Salting:
// Salting involves adding a random string of characters, known as a salt, to the input data before hashing. The salt is unique for each piece of data being hashed. The purpose of salting is to prevent attackers from using precomputed tables, such as rainbow tables, to quickly determine the original input based on the hashed output.

import mysql from "mysql2";
// import bcrypt from 'bcrypt';

const saltRounds = 10;

//Creates connection to the SQL server
const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "PASSWORD",
    database: "users",
  })
  .promise();

//function for adding new users to the SQL database.
//Takes 2 parameters userName and password
//lowercases the username
//if username exist in database
//error is thrown and value of null is returned
//else
//Password is hashed and salted using bcrypt
//SQL query is ran to create username with given userName and password
// returns username if successful otherwise Null
export async function createUser(userName, password) {
  let unique = true;
  let userNameLCase = userName.toLowerCase();
  const [usernames] = await pool.query(`select Username 
    from UserLogins`);
  usernames.forEach((e) => {
    if (e.Username == userNameLCase) {
      unique = false;
    }
  });
  if (unique) {
    const hash = true;
    await pool.query(
      `
        INSERT INTO UserLogins (Username, Password) VALUES (?, ?)
        
        `,
      [userNameLCase, hash]
    );
    return userNameLCase;
  } else {
    console.log(`error ${userName} already exists`);
    return null;
  }
}

//function to get the id of an user based on the username given
export async function getUserIDByUserName(username) {
  const [usernameInfo] = await pool.query(
    `
    select ID  
    from UserLogins
    where Username = ?
    `,
    [username]
  );
  return usernameInfo[0].ID;
}

export async function createUserInfo(
  ID,
  user_name,
  user_height,
  user_weight,
  user_target_calories,
  preferences
) {
  await pool.query(
    `
    INSERT INTO UserInfo (User_ID,User_name, User_height, User_weight, User_target_calories, User_preferences ) VALUES ( ?, ?, ?, ?, ?, ?)
        
        `,
    [ID, user_name, user_height, user_weight, user_target_calories, preferences]
  );
}

//gets all userID and  passwords (Hashed+salted) from the sql data base and returns results as an object:
// ID: id int,
// Username: 'username' string,
// Password: 'password' string(hashed),
// LoginTime: 'date' string (yyyy-mm-ddThh:mm:ss.000Z_);
export async function getUsers() {
  const [result] = await pool.query("select * from UserLogins");
  return result;
}

//gets Userinfo from the SQL database based on id from the data base and returns results as an object:
// {
//User_ID: id int,
// User_name: 'name' string,
// User_height: 'height' string,
// User_weight: 'weight' string,
// User_target_calories: 'calories' int,
// User_preferences: 'preferences' string,
// AddedTime: 'date' string (yyyy-mm-ddThh:mm:ss.mmmZ_) (Z= Zulu time)(T=time delimiter);
//}

export async function getUserInfo(id) {
  const [result] = await pool.query(
    `
    select * 
    from UserInfo 
    where User_id = ?

    `,
    [id]
  );
  return result[0];
}

//Finds foods for the user based on their id and returns an object
//{
//User_ID: id int,
// Food_Name: 'food name' string,
// Food_Calories: calories int,
// Food_Protein: protein int,
// Food_Fats: fats int,
// Food_Carbs: carbs int,
//  Food_Image: 'image' string (link to resource),
// AddedTime: 'date' string (yyyy-mm-ddThh:mm:ss.mmmZ_) (Z= Zulu time)(T=time delimiter);
//}
export async function getfoodsByID(id) {
  const [result] = await pool.query(
    `
    select * 
    from UserFoods 
    where User_ID = ?
    order by AddedTime desc
    `,
    [id]
  );
  return result;
}

export async function getRecipeByID(id) {
  const [result] = await pool.query(
    `
    select * 
    from UserRecipes 
    where User_ID = ?
    order by AddedTime desc

    `,
    [id]
  );
  return result;
}

export async function getfoodsHistoryByID(id) {
  const [result] = await pool.query(
    `
    select * 
    from UserFoods 
    where User_ID = ?
     order by AddedTime desc
    limit  3
   
    `,
    [id]
  );
  return result;
}

//creates an entry in the SQL database for the given food with the given parameters in the following format:
//Finds foods for the user based on their id and returns an object
//{
//User_ID: User_ID int,
// Food_Name: foodName string,
// Food_Calories: foodCalories int,
// Food_Protein: foodProtein int,
// Food_Fats: fats int,
// Food_Carbs: carbs int,
//  Food_Image: 'image' string (link to resource),
// AddedTime: 'date' string (yyyy-mm-ddThh:mm:ss.mmmZ_) (Z= Zulu time)(T=time delimiter);
//}
export async function createFoods(
  User_ID,
  foodName,
  foodCalories,
  foodProtein,
  foodCarbs,
  foodFats,
  foodImage,
  grams
) {
  await pool.query(
    `
     INSERT INTO UserFoods (User_ID, Food_Name, Food_Calories, Food_Protein, Food_Fats, Food_Carbs, Food_Image, food_quantity ) VALUES (?, ?, ? ,?, ?,?,?,?)
    `,
    [
      User_ID,
      foodName,
      foodCalories,
      foodProtein,
      foodFats,
      foodCarbs,
      foodImage[0],
      grams,
    ]
  );
}

export async function createRecipeList(
  User_ID,
  recipeName,
  recipeImage,
  recipeCalories,
  recipeTotalWeight,
  recipeTotalTime,
  recipeYield,
  recipeMealType,
  recipeURL,
  recipeIngredients
) {
  await pool.query(
    `
    INSERT INTO UserRecipes (User_ID,	Recipe_Name,	Recipe_Image,	Recipe_Calories,	Recipe_TotalWeight, Recipe_TotalTime, Recipe_Yield, Recipe_MealType, Recipe_URL, Recipe_Ingredients) VALUES (?, ?, ? ,?, ?,?,?,?,?,?)
   `,
    [
      User_ID,
      recipeName,
      recipeImage,
      recipeCalories,
      recipeTotalWeight,
      recipeTotalTime,
      recipeYield,
      recipeMealType,
      recipeURL,
      recipeIngredients,
    ]
  );
}
//delete food by ID

export async function deleteFoodByID(foodID) {
  try {
    await pool.query(
      `
        DELETE FROM UserFoods WHERE food_entry_ID = ?
        `,
      [foodID]
    );
    return true;
  } catch {
    return false;
  }
}

export async function deleteRecipeByID(foodID) {
  try {
    await pool.query(
      `
        DELETE FROM UserRecipes WHERE RecipeID = ?
        `,
      [foodID]
    );
    return true;
  } catch {
    return false;
  }
}
