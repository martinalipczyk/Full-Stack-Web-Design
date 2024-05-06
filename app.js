//set up the server
const express = require("express");
const db = require("./db/db_connection");
const app = express();
const port = 3000;

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + "/public"));

const get_all_videos = `
        SELECT video_id, name, date, duration, image
        FROM video
`;

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");


//configures express to parse url encoded post request bodies
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
    db.execute(get_all_todo_items, (error, results) => {
        if (error) {
            res.status(500).send(error); // Internal Server Error
        } else {
            // res.send(results);
            res.render('index', { feed: results })
        }
    });
});

const get_video_details = `
    SELECT video_id, name, date, duration, image
    FROM video
    WHERE video_id = ?
`;

app.get("/video/:id", (req, res) => {
    db.execute(get_video_details, [req.params.id], (error, results) => {
        if (error) {
            res.status(500).send(error); // Internal Server Error
        } else {
            // res.send(results);
            res.render('video', {vid: results[0] })
        }
    });
});

//////////////stopped here
const upload_video = `
    INSERT INTO video (todo_description, subject_id, date, notes)
    VALUES(?, ?, ?, ?)
`;

app.post("/", (req, res)=>{
    db.execute(create_todo, [req.body.todo, req.body.subject, req.body.date, req.body.notes], (error, results)=> {
        if(error){
            res.status(500).send(error);
        }
        else{
            res.redirect("/");
        }
    });
});

const delete_todo = `
    DELETE FROM todo_item
    WHERE todo_id = ?    
`

app.get("/todo/:id/delete", (req, res) => {
    db.execute(delete_todo, [req.params.id], (error, results) =>{
        if(error){
            res.status(500).send(error);
        }
        else{
            res.redirect("/")
        };
    });
});


const update_todo = `
    UPDATE todo_item
    SET todo_description = ?,
        subject_id = ?,
        date = ?,
        notes = ?
    WHERE
        todo_id = ?
`

app.post("/todo/:id", (req,res) => {
    db.execute(update_todo, [req.body.todo, req.body.subject, req.body.date, req.body.notes, req.params.id], (error, results) =>{
        if(error){
            res.status(500).send(error);
        }else{
            res.redirect("/");
        }
    })
});


// start the server
app.listen(port, () => {
    console.log(
        `App server listening on ${port}. (Go to http://localhost:${port})`
    );
});

