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
    db.execute(get_all_videos, (error, results) => {
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

const upload_video = `
    INSERT INTO video (name, date, duration, image)
    VALUES(?, ?, ?, ?)
`;

app.post("/", (req, res)=>{
    db.execute(upload_video, [req.body.name, req.body.date, req.body.duration, req.body.image], (error, results)=> {
        if(error){
            res.status(500).send(error);
        }
        else{
            res.redirect("/");
        }
    });
});

const delete_video = `
    DELETE FROM video
    WHERE video_id = ?    
`

app.get("/video/:id/delete", (req, res) => {
    db.execute(delete_video, [req.params.id], (error, results) =>{
        if(error){
            res.status(500).send(error);
        }
        else{
            res.redirect("/")
        };
    });
});


const update_video = `
    UPDATE video 
    SET name = ?,
        date = ?,
        duration = ?,
        image = ?
    WHERE
        video_id = ?
`

app.post("/video/:id", (req,res) => {
    db.execute(update_video, [req.body.name, req.body.date, req.body.date, req.body.duration, req.body.image, req.params.id], (error, results) =>{
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

