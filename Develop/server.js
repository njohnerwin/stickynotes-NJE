const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const dbpath = (path.join(__dirname, "/db/db.json"));
let notes = JSON.parse(fs.readFileSync(dbpath, (err, data) => {return data}));
console.log("Notes log");
console.log(notes);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
  return res.json(notes);
});

app.post("/api/notes/", function(req, res) {

  let newNote = req.body;
  if (notes[0]) {newNote.id = notes[0].id + 1;}
  else (newNote.id = 1);
  
  console.log(req.body);

  notes.unshift(req.body);

  let notesUpdate = JSON.stringify(notes);
  
  fs.writeFile(dbpath, notesUpdate, (err) => {
    if (err) throw (err);
    console.log("Notes updated");
  });

  return res.json(newNote);
});

app.delete("/api/notes/:id", function(req, res) {
  const id = req.params.id; 
  console.log("searched ID = " + id);

  for (let i = 0; i < notes.length; i++) {
    console.log("current i = " + i);
    console.log("note id = " + notes[i].id);
    console.log("searching for = " + id);
    if (id == notes[i].id) {
      console.log("Made a match");
      let spliced = notes.splice(i, 1);
      console.log("Deleted: " + spliced);
    }
  }
  
  let notesUpdate = JSON.stringify(notes);

  fs.writeFile(dbpath, notesUpdate, (err) => {
    if (err) throw (err);
    console.log("Notes updated");
  });
});
  
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});