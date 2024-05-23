//set up the server
const express = require("express");
const db = require("./db/db_connection");
const app = express();
const port = 3000;

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + "/public"));



app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

const get_all_videos = `
        SELECT video_id, name, date, duration, image
        FROM video
`;

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
    INSERT INTO video (name, duration, image, date)
    VALUES(?, ?, ?, ?)
`;

app.post("/", (req, res)=>{
    console.log(req.body.image)
    db.execute(upload_video, [req.body.name, parseInt(Math.random()*60, 10), req.body.image, new Date()], (error, results)=> {
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
    SET name = ?
    WHERE video_id = ?
`

app.get("/video/:id/edit", (req, res) => {
    db.execute(get_video_details, [req.params.id], (error, results) => {
        if (error) {
            res.status(500).send(error); 
        } else {
            db.execute(get_all_videos, (error, results2) => {
                if (error) {
                    res.status(500).send(error);
                } else {
                    console.log(results[0]);
                    console.log(results2)
                    res.render('edit', { vid: results[0], feed: results2 });
                }
            });
        }
    });
});

app.post("/video/:id/edit", (req, res) => {
    db.execute(update_video, [req.body.name, req.params.id], (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.redirect("/");
        }
    });
});


// start the server
app.listen(port, () => {
    console.log(
        `App server listening on ${port}. (Go to http://localhost:${port})`
    );
});

