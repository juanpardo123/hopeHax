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
    const [usernames] = await pool.query(`select Username 
    from UserLogins`)
    usernames.forEach(e=>{
        console.log(e);
        console.log(userName);
        if(e.Username == userName){
            
            unique = false;
        }
    })
    if(unique){
        const hash = bcrypt.hashSync(password, saltRounds);
        await pool.query(`
        INSERT INTO UserLogins (Username, Password) VALUES (?, ?)
        
        `, [userName, hash]);
        return true;
    }else{
        console.log(`error ${userName} already exists`)
        return false;
    }
   
}


export async function getfoods(){
    const [result] = await pool.query("select * from UserLogins");
    return result;
}
const result = await getfoods();

export async function getfoodsByID(id){
    const [result] = await pool.query(`
    select * 
    from UserFoods 
    where User_ID = ?
    
    `, [id]);
    return result;
}
const result2 = await getfoodsByID(1);

createUser("mikelong", '1234');

console.log(result2);