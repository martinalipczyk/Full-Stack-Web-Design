const db = require("./db_connection");

db.execute("SELECT * FROM video", (error, results)=>{
    if(error) throw error;
    console.log(results); 
    
});

db.end();