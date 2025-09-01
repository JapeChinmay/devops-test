import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(":memory:");

//user id is referenced from user table , PK

db.exec(`
    
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT , 
        username TEXT UNIQUE,
        password TEXT
    )
    
    `);

db.exec(`
        
      CREATE TABLE todos (
      
           id INTEGER PRIMARY KEY AUTOINCREMENT ,
           users_id INTEGER,
           task TEXT,
           completed BOOLEAN DEFAULT 0,
           FOREIGN KEY(users_id) REFERENCES users(id)


      )
    
    `);

export default db;
