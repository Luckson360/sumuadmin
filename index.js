const connection = require("./model");
const artists = require("./model/artist.model.js");
const singles = require("./model/single.model.js");
const mongoose = require("mongoose");
const express = require("express");
const application = express();
const methodOverride = require("method-override")
const path = require("path");
//const io = require("socket.io")(3000);
//const jquery = require("jquery")
//const popper = require("popper.js")
//const bootstrap = require("bootstrap")
const crypto = require("crypto")
const bodyparser = require('body-parser');
const multer = require("multer")
const GridFsStorage = require("multer-gridfs-storage")
const Grid = require("gridfs-stream")
const expresshandlerbars = require('express-handlebars');
const artistcontroller = require("./controllers/artistlist.js");
const addartistcontroller = require("./controllers/add-artist.js");
const artistModel = mongoose.model("artist");
const singleModel = mongoose.model("single");
const genreModel = mongoose.model("genre");
const albumModel = mongoose.model("album")
const albumtrackModel = mongoose.model("albumTrack")



application.use(bodyparser.urlencoded({
	extended: true
}));
application.use(methodOverride("_method"))

const mongoURI = "mongodb+srv://luckson:pa$$3orD@cluster0.3fghbe9.mongodb.net/SAHARA";
const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
  if (!error)
    console.log("ait")
  else
    console.log("no")
});

application.use(express.static(__dirname + "/public"));
/*const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true }, (error) =>{
	if(!error)
	{
		console.log('success');
	}
	else
	{
		console.log('not c0nnexted');
	}
});*/


application.use("/course", artistcontroller);
application.use("/music", addartistcontroller);

const PORT = process.env.port || 5000

application.listen(PORT, (error) =>{
	console.log("server started on port 4000 admn");
});
var single;
var albumTitle;
var artist = {
	artistName: this.name,
	singles: [single],
	albums: [albumTitle]
}
//the views 
/*application.set("views", path.join(__dirname, "/views/"));

application.engine("hbs", expresshandlerbars({
	extname : "hbs",
	defaultLayout : "mainlayouts",
	layoutsDir : __dirname + "/views/layouts"
}));*/

application.set("view engine", "ejs");


let gfs;
conn.once("open", () => {
  //init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
})

//the storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) =>{
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if(err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({storage});


//THIS IS THE API FOR THE SEARCH BOX ITS PARTIAL NOW THOE SO YOU KONW WHATS UP
application.get("/", (req,res) =>{
  //have the front page print only up to 20 cds singles and albums those tha
  //are perfoming well and hvly and the top ten genres on the site 
  //****//
  //we filter by Release Date $gt present date
  artistModel.find({}, (err,artist) =>{
    if(!err){
      res.render("adminUpload", {artists: artist})
    }
    else{
      console.log(err)
    }
  })
})
//END THE API
//the router for the cover art 
application.post("/upload/coverArt", upload.single("coverArt"), (req, res) =>{
    const {file} = req
    /*const stream = gfs.createReadStream(file.filename);
  storage.fromStream(stream, req, file)
    .then(() => res.send('File uploaded'))
    .catch(() => res.status(500).send('error'));*/
  console.log(req.body)
      var artist = new artistModel();
      var album = new albumModel();
    var albumtrack = new albumtrackModel()
      /*artistModel.findOne({government: req.body.albumArtist}, (err,artist) =>{
      if(!err){
        if(artist.estimatedDocumentCount != 0){
          console.log("artist is registered")
        }else{
          console.log("artist is New")
        artist._id = new mongoose.Types.ObjectId();
        artist.artistName = req.body.albumArtist;
        artist.save((err, artistAdded) =>{
          if(!err)
            console.log("New artist added successfully")
          else
            console.log("There was and error adding artist")
        })
        }
      }
      else{
        console.log("there was an error with the artist")
      }
    })*/

    var album = new albumModel();
  console.log(req.body);
  album._id = new mongoose.Types.ObjectId();
  album.albumArtist = req.body.albumArtist;
  album.albumTitle = req.body.albumTitle;
  album.government = req.body.government.toString();
  album.albumTracklist = req.body.albumTracklist;
  album.coverArt = file.filename;
  album.albumname = Math.ceil(Math.random() * 100000);
  album.releaseDate = req.body.releaseDate;
  album.albumType = req.body.albumType;
  album.genre = req.body.genre;
  album.isFeatured = false;
  album.recordLabel = req.body.recordLabel
  album.copyright = req.body.copyright
  album.save((err, album) =>{
    if(!err){
      //res.redirect("albumupload")
      console.log("Album added successfully");
    }else{
      console.log("There was an error adding album")
    }
  });
})
//END ROUTE



//THE API FOR UPLOADING THE AUDIO< AND ALBUM TRACK
application.post("/upload/audio", upload.single("audio"), (req, res) =>{
  res.json({file: req.file});
  console.log(req.file)
      var artist = new artistModel();
      var album = new albumModel();
    var albumtrack = new albumtrackModel()
      albumModel.findOne({government: req.body.goovernment}, (err,album) =>{
      if(!err){
        console.log("found it")    
  console.log(req.body);
  albumtrack._id = new mongoose.Types.ObjectId();
  albumtrack.artists = album.albumArtist;
  albumtrack.singleTitle = req.body.siingleTitle;
  albumtrack.government = album.government;
  albumtrack.audio = req.file.filename;
  albumtrack.coverArt = album.coverArt
  albumtrack.albumname = Math.ceil(Math.random() * 100000);
  albumtrack.releaseDate = album.releaseDate;
  albumtrack.albumType = album.albumType;
  albumtrack.albumTitle = album.albumTitle;
  albumtrack.genre = album.genre;
  albumtrack.isFeatured = album.isFeatured;
  albumtrack.save((err, album) =>{
    if(!err){
      //res.redirect("albumupload")
      albumModel.updateOne({government: req.body.goovernment}, {$push: {albumSingles: albumtrack.id}}, (err,album) =>{
        if(!err){
          console.log("Album track added successfully")
        }
        else{
          console.log("There was an error updating Album")
        }
      })
    }else{
      console.log("There was an error adding album")
    }
  })
        }
      else{
        console.log("not found")
      }
    })
})

//the route to read the imagefiles
application.get("/image/:filename", (req, res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    //check if file 
    if(!file || file.length === 0) {
      return res.status(404).json({
        err:"no files exist"
      })
    }
    //read
    //check if image
    if(file.contentType === "image/jpeg" || file.contentType === "image/png"){
      console.log("right");
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }else{
      console.log("is an audio file");
    }
  })
})


//the following api will give the editing router
application.get("/edit/music", (req,res) =>{
  //query through the thang
  //var albumtrack = new albumtrackModel()
  albumtrackModel.find({}, (err,album) =>{
    if(!err){
      console.log(album)
      res.render("editrelease", {albums: album})
    }
    else{
      console.log(err)
    }
  })
})
//

//the route for deleting the song
//end route

//the route for making a feature
application.post("/feature/:government", (req,res) =>{
  //find it in the collection 
  console.log("this will mean then that the single has been proccessed and will be on the front page for 7 days")
  albumtrackModel.findOneAndUpdate({government: req.params.government}, {isFeatured: true},(err,single) =>{
    if(!err){
      console.log(single)
      res.redirect("/edit/music")
    }
    else{
      console.log(err)
    }
  })
  //then the updating part with it too 
  //updates like song title, the meta data
  //the contributors
})
//END API FOR THE FEATURE SINGLE
//end route

//the route for unfeaturing the song
application.post("/unfeature/u/:government", (req,res) =>{
  //find it in the collection 
  console.log("this will mean then that the single will be removed fromthe front page")
  albumtrackModel.findOneAndUpdate({government: req.params.government}, {isFeatured: false},(err,single) =>{
    if(!err){
      console.log(single)
      res.redirect("/edit/music")
    }
    else{
      console.log(err)
    }
  })
  //then the updating part with it too 
  //updates like song title, the meta data
  //the contributors
})
//END API FOR UNFEATURE SINGLE
//end route

//the API for deleting the single
application.delete("/delete/:government", (req,res) => {
  //find the track
  let dObj = {}

  albumtrackModel.findOne({government: req.params.government}, (err, track) => {
    if(!err) {
    gfs.remove({filename: track.audio, root: "uploads"} , (err, gridStore) => {
      if (!err) {
        console.log(gridStore)
      } else {
        console.log(err)
      }
    })

    gfs.remove({filename: track.coverArt, root: "uploads"} , (err, gridStore) => {
      if (!err) {
        console.log(gridStore)
        res.redirect("/edit/music")
      } else {
        console.log(err)
      }
    })
    } else {
      console.log (err)
    }
  })
  //delete the whole obj
  albumtrackModel.findOneAndDelete({government: req.params.government}, (err, deletedTrack) => {
    if(err) {
      console.log(err)
    } else {
      console.log(deletedTrack)
    }
  })

  albumModel.findOneAndDelete({government: req.params.government}, (err, deletedAlbum) => {
    if(err) {
      console.log(err)
    } else {
      console.log(deletedAlbum)
    }
  })
})






