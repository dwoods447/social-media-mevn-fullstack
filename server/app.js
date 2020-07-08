const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config/config');
const cors = require('cors');
const port = config.port;
const host = config.host;
const mongoose = require('mongoose');
const path = require('path')
const multer = require('multer');

app.use(cors());
app.use(bodyParser.json());

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) =>{
        let imagePath = './images';
        cb(null, imagePath);
    },
    filename: (req, file, cb) =>{
        let date = new Date();
        let time = date.getTime();
        let filename = date.toISOString().replace(/:/g, '-')+'_'+time+'_'+ file.originalname;
        cb(null, filename);
    }
});




const fileFilter = (req, file, cb) =>{
    // Set Allowed ext
  const allowedFiletypes = /jpg|png|jpeg/;
  // Check ext
  const extname = allowedFiletypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = allowedFiletypes.test(file.mimetype);
  if(mimetype && extname){
      cb(null, true)
  }else{
      cb(new Error('File type must be an document: .png, .jpg, or .jpeg!'), false);
  }
}


app.use('/', express.static(path.join(__dirname, '../client/dist')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))



/*********** Routes **************/
const auth = require('./routes/authentication.routes');
const user = require('./routes/user.routes');
const post  = require('./routes/post.routes');
app.use(auth);
app.use('/users', user);
app.use('/posts', post)
app.set('port', process.env.PORT || port);
// app.get('/.*/', function(req, res){
//     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// });
mongoose.connect(config.db.connectString, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result)=>{              
    const server = app.listen(port, () => {
            
                console.log("MonGoose connection created!" + result);
                console.log(`Server started on port:${port}`);    
     });

     const io  = require('./socketio').init(server)
        io.on('connection', socket => {
            console.log('Client connected via web sockets');
        });
}).catch(()=>{
        console.log('Error connecting with Mongoose')
});