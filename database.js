import mysql from 'mysql2';
import bcrypt from 'bcrypt';

const saltRounds = 10;


//Creates connection to the SQL server
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'users'
}).promise()

//function for adding new users to the database returns true if successful otherwise false
export async function createUser(userName, password){
    let unique = true;
    let userNameLCase = userName.toLowerCase()
    const [usernames] = await pool.query(`select Username 
    from UserLogins`)
    usernames.forEach(e=>{
        if(e.Username == userNameLCase){
            
            unique = false;
        }
    })
    if(unique){
        const hash = bcrypt.hashSync(password, saltRounds);
        await pool.query(`
        INSERT INTO UserLogins (Username, Password) VALUES (?, ?)
        
        `, [userNameLCase, hash]);
        return userNameLCase;
    }else{
        console.log(`error ${userName} already exists`)
        return null;
    }
   
}

export async function getUserIDByUserName(username){
    const [usernameInfo] = await pool.query(`
    select ID  
    from UserLogins
    where Username = ?
    `, [username])
    return usernameInfo[0].ID;
}

export async function createUserInfo( ID,user_name, user_height, user_weight, user_target_calories){
    await pool.query(`
    INSERT INTO UserInfo (User_ID,User_name, User_height, User_weight, User_target_calories, User_preferences ) VALUES ( ?, ?, ?, ?, ?, NULL)
        
        `, [ID, user_name, user_height, user_weight, user_target_calories]);
}

//gets all userID and  passwords (Hashed+salted) from the data base and returns results as an object:
// ID: id int,
// Username: 'username' string,
// Password: 'password' string(hashed),
// LoginTime: 'date' string (yyyy-mm-ddThh:mm:ss.000Z_);
export async function getUsers(){
    const [result] = await pool.query("select * from UserLogins");
    return result;
}

//gets Userinfo based on id from the data base and returns results as an object:
// {
//User_ID: id int,
// User_name: 'name' string,
// User_height: 'height' string,
// User_weight: 'weight' string,
// User_target_calories: 'calories' int,
// User_preferences: 'preferences' string,
// AddedTime: 'date' string (yyyy-mm-ddThh:mm:ss.mmmZ_) (Z= Zulu time)(T=time delimiter);
//}

export async function getUserInfo(id){
    const [result] = await pool.query(`
    select * 
    from UserInfo 
    where User_id = ?
    `, [id]);
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
export async function getfoodsByID(id){
    const [result] = await pool.query(`
    select * 
    from UserFoods 
    where User_ID = ?
    
    `, [id]);
    return result;
}

//creates an entry for the given food with the given parameters in the following format:
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
export async function createFoods(User_ID,foodName, foodCalories, foodProtein, foodCarbs, foodFats, foodImage){
   
     await pool.query(`
     INSERT INTO UserFoods (User_ID, Food_Name, Food_Calories, Food_Protein, Food_Fats, Food_Carbs, Food_Image ) VALUES (?, ?, ? ,?, ?,?,?)
    `, [User_ID,foodName, foodCalories, foodProtein,foodFats , foodCarbs , foodImage[0]]);
}

