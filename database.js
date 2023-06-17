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
        return true;
    }else{
        console.log(`error ${userName} already exists`)
        return false;
    }
   
}

//gets all users, userID and  passwords (Hashed+salted) from the data base
export async function getUsers(){
    const [result] = await pool.query("select * from UserLogins");
    return result;
}

export async function getUserInfo(id){
    const [result] = await pool.query(`
    select * 
    from UserInfo 
    where User_id = ?
    `, [id]);
    return result[0];
}

//get food info from SQL database
export async function getfoods(){
    const [result] = await pool.query("select * from UserLogins");
    return result;
}

export async function getUs(){
    const [result] = await pool.query("select * from UserLogins");
    return result;
}
const result = await getfoods();

//Find foods for the user based on their id
export async function getfoodsByID(id){
    const [result] = await pool.query(`
    select * 
    from UserFoods 
    where User_ID = ?
    
    `, [id]);
    return result;
}

//creates an entry for the given food
export async function createFoods(User_ID,foodName, foodCalories, foodProtein, foodCarbs, foodFats, foodImage){
    console.log('imagen---------------',foodImage[0]);
     await pool.query(`
     INSERT INTO UserFoods (User_ID, Food_Name, Food_Calories, Food_Protein, Food_Fats, Food_Carbs, Food_Image ) VALUES (?, ?, ? ,?, ?,?,?)
    `, [User_ID,foodName, foodCalories, foodProtein,foodFats , foodCarbs , foodImage[0]]);
}


console.log(await getUserInfo(9))


