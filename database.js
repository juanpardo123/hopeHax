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
        console.log(e);
        console.log(userNameLCase);
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

export async function getUserInfo(){
    const [result] = await pool.query("select * from UserLogins");
    return result;
}

//get food info from SQL database
export async function getfoods(){
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

export async function createFoods(User_ID,foodName, foodCalories, foodProtein, foodCarbs, foodFats){
     await pool.query(`
     INSERT INTO UserFoods (User_ID, Food_Name, Food_Calories, Food_Protein, Food_Fats, Food_Carbs ) VALUES (?, ?, ? ,?, ?,?)
    
    `, [User_ID,foodName, foodCalories, foodProtein, foodCarbs, foodFats]);
}

const result2 = await getfoodsByID(1);

createUser("mikelong", '1234');

console.log(result2);