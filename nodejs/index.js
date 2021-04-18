const mongoose = require("mongoose");
var express = require('express');
var http = require('http')
var socketio = require('socket.io');
var mongojs = require('mongojs');

const config    = require('./config')

var ObjectID = mongojs.ObjectID;
// mongodb://admin:password@localhost:27017/db
// var db = mongojs("mongodb://mongo:27017/bl");
var app = express();
var server = http.Server(app);
var io = socketio(server);

const socketsModel  = require('./models/sockets');
const usersModel    = require('./models/users');
const followerPostModel    = require('./models/follower_post');

const connection = require("./connection")

require('./log-interceptor')(server);

connection().then((db) => {
  console.log("MongoDb connected");
});

server.listen(3000, () => console.log('listening on *:3000'));

// For POST-Support
let bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const httpPostSearch = () => {
  return new Promise((resolve, reject) => {
    // http.get(url, res => {
    //   res.setEncoding('utf8');
    //   let body = ''; 
    //   res.on('data', chunk => body += chunk);
    //   res.on('end', () => resolve(body));
    // }).on('error', reject);

    const data = JSON.stringify({ type: 0, key_word: '*', offset: 0 })
    var options = {
      host: 'banlist.info',
      port: 80,
      path: '/api/search?_format=json',
      method: 'POST',
      json: true,
      headers: {'Authorization': 'Basic YWRtaW46U29ta2lkMDU4ODQ4Mzkx', 
      'Content-Type': 'application/json',
      'Content-Length': data.length,}
    };
    const reqx = http.request(options, (res) =>{
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));

      let body = ''; 
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        body += chunk
      });

      res.on('end', () => {
        resolve(body)
      }
      );
    }).on('error', reject);

    reqx.write(data)
    reqx.end();
  });
};

app.get('/api/hello', async(req, res) => {
  // db.collection('sockets').insert(res, (err, message) => {
  //   console.log(err)
  //   console.log(message)
  // })
  
  // const body = await httpPostSearch();
  // console.log('body >>> ', body)

  res.send({ express: config.mongo.url });
});

// case login will add uid to socketsModel and logout will clear uid for socketsModel
app.post('/api/login', async(req, res) => {
  try {
    console.log(req.body)
    
    let {unique_id, uid} = req.body
    if(!unique_id || !uid){    
      res.status(404).send({'message': 'ERROR'});
    }else{

      socketsModel.findOneAndUpdate({ uniqueId: unique_id }, { uid }, {
        new: true,
        upsert: true 
      },function( error, result){
        // In this moment, you recive a result object or error
        console.log(result)
      });

      let user = await usersModel.findOne({ uid });
      var followUps = user.followUps.toObject();
      // let fs = await socketsModel.findOne({ uniqueId: unique_id });
      // if ( fs !== null ){
      //   if(fs.socketId){
      //     console.log(fs.socketId)
      //     io.to(fs.socketId).emit('follow_up', JSON.stringify(followUps));
      //   }
      // }

      res.status(200).send({'result': true, 'message': 'OK', 'followUps': JSON.stringify(followUps)});
    }
  } catch (err) {
    res.status(500).send({errors: err});
  }
});

app.post('/api/logout', (req, res) => {
  try {
    console.log(req.body)
    
    let {unique_id, uid} = req.body
    if(!unique_id || !uid){    
      res.status(404).send({'message': 'ERROR'});
    }else{

      socketsModel.findOneAndUpdate({ uniqueId: unique_id, uid }, { uid: '' }, {
        new: true,
        upsert: true 
      },function( error, result){
        // In this moment, you recive a result object or error
        console.log(result)
      });

      res.status(200).send({'message': 'OK'});
    }
  } catch (err) {
    res.status(500).send({errors: err});
  }
});

app.post('/api/update_profile', async(req, res) => {
  try {
    console.log(req.body)
    
    let { uid } = req.body
    if( !uid ){    
      res.status(404).send({ 'result': false });
    }else{
      let fs = await socketsModel.findOne({ uid });
      if ( fs !== null ){
        if(fs.socketId){
          // console.log(fs.socketId)
          io.to(fs.socketId).emit('update_profile', {});
        }
      }

      res.status(200).send({ 'result': true });
    }
  } catch (err) {
    res.status(500).send({ 'result': false, 'message': err});
  }
});

app.post('/api/follow_up', async (req, res) => {
  try {
    console.log(req.body)
    
    let { uid, id_follow_up, unique_id, owner_id } = req.body
    if(!uid || !id_follow_up || !unique_id || !owner_id){    
      return res.status(404).send({'message': 'ERROR'});
    }else{
      let user = await usersModel.findOne({ uid });
      
      if ( user === null ){
        await new usersModel({ uid, followUps: [id_follow_up]}).save()
      }else{
        var followUps = user.followUps.toObject();
        
        var message = 'Follow up'
        if(followUps.includes(id_follow_up)){
          followUps = followUps.filter((v) => {return v != id_follow_up})

          var message = 'Upfollow up'
        }else{
          followUps = [...followUps, id_follow_up]
        }

        let um = await  usersModel.findOneAndUpdate({ uid }, { uid, followUps }, {
          new: true,
          upsert: true 
        });

        if ( um !== null ){
          let fss = await socketsModel.find({ uid });
          if ( fss !== null ){
            fss.map((obj, i) => {
              if(obj.socketId){
                io.to(obj.socketId).emit('follow_up', JSON.stringify(followUps));
              }
            })
          }
        }

        let fp = await onFollowerPost(uid, id_follow_up, unique_id, owner_id);
        console.log('fp : ', fp);

        return res.status(200).send({'result': true, 'message': message});
      }
    }
    
    return res.status(200).send({'result': true, 'message': 'OK'});
  } catch (err) {
    return res.status(500).send({'result': false, errors: err});
  }
});

app.post('/api/follower_post', async (req, res) => {
  try {
    console.log(req.body)
    
    let { posts } = req.body
    if( !posts){    
      return res.status(404).send({'result': false});
    }
    let follower_post =  await Promise.all( posts.map(async(post_id)=>{ return await followerPostModel.findOne({ post_id }); }))
    // console.log('follower_post : ', follower_post)

    let fp = []
    follower_post.map((itm)=>{ 
      if ( itm !== null ){
        fp = [...fp, {"post_id": itm.post_id, 'follower': itm.follower.toObject()} ]
      }
    })
    
    return res.status(200).send({'result': true, 'follower_post': JSON.stringify(fp)});
  } catch (err) {
    console.log(err)
    return res.status(500).send({'result': false, errors: err});
  }
});


// my_apps
app.post('/api/my_apps', async (req, res) => {
  try {
    console.log(req.body)
    
    let { uid } = req.body
    if(!uid){    
      return res.status(404).send({'message': 'ERROR'});
    }else{
      let fs = await socketsModel.findOne({ uid });
      if ( fs !== null ){
        if(fs.socketId){
          io.to(fs.socketId).emit('my_apps', 'for your eyes only');
        }
      }
    }
    
    return res.status(200).send({'message': 'OK'});
  } catch (err) {
    return res.status(500).send({errors: err});
  }
});

// follower_post

async function onFollowerPost(uid, id_follow_up, unique_id, owner_id) {
  try {

    console.log('onFollowerPost > ', uid, id_follow_up, unique_id, owner_id)
    if(!uid || !id_follow_up || !unique_id || !owner_id){    
      return false;
    }else{

      // followerPostModel
      let followerPost = await followerPostModel.findOne({ post_id: id_follow_up });

      var follower =[]
      if ( followerPost === null ){
        await new followerPostModel({ post_id: id_follow_up, follower: [uid]}).save()
      
        follower = [uid]
      }else{
        follower = followerPost.follower.toObject();
        
        if(follower.includes(uid)){
          follower = follower.filter((v) => {return v != uid})

        }else{
          follower = [...follower, uid]
        }

        console.log('follower > ', follower)
        let _followerPostModel = await  followerPostModel.findOneAndUpdate({ post_id: id_follow_up }, { post_id: id_follow_up, follower }, { new: true, upsert: true });
        // if ( _followerPostModel !== null ){
          // follower.map( async (_uid, i) => {
          //    console.log('_uid, i :', _uid, i)
            let fss = await socketsModel.find({ uid:owner_id });
            if ( fss !== null ){
              // case uid have muli devices
              fss.map((obj, i) => {
                if(obj.socketId){
                  io.to(obj.socketId).emit('follower_post', JSON.stringify({'post_id': id_follow_up, 'follower':follower}) );
                }
              })
            }
          // })
        // }
        
      }  

      let fss = await socketsModel.find({ uid:owner_id });
      if ( fss !== null ){
        // case uid have muli devices
        fss.map((obj, i) => {
          if(obj.socketId){
            io.to(obj.socketId).emit('follower_post', JSON.stringify({'post_id': id_follow_up, 'follower':follower}) );
          }
        })
      }

      return true;
    }
    return true;
  } catch(err) {
    console.err(err);

    return false;
  }
}


// Mapping objects to easily map sockets and users.
var clients = {};
// var users = [];


// db.on('ready',function() {
//   console.log('database connected');
// });

// This represents a unique chatroom.
// For this example purpose, there is only one chatroom;
var chatId = 1;

io.on('connection', async (socket) => {
  let handshake = socket.handshake;
  console.log(handshake.query.unique_id)

  var uid = handshake.query.uid;
  var unique_id = handshake.query.unique_id;
  var platform = handshake.query.platform;
  // var first_install = handshake.query.first_install;

  console.log(`Socket ${socket.id} connection`)

  console.log(`uid :  ${uid}`)
  console.log('handshake.query >> ', handshake.query)
  // users[unique_id] = socket;

  socket.emit('message', { unique_id: unique_id });

  clients[socket.id] = socket;
  
  let fss = await  socketsModel.findOneAndUpdate({ uniqueId: unique_id }, { uniqueId: unique_id, socketId: socket.id, platform, uid: (uid !== undefined  ? uid : 0) }, {
              new: true,
              upsert: true 
            });

  console.log('connection ', socket.id, unique_id, fss)

  socket.on('disconnect', () => {
    // users = users.splice(users.indexOf(unique_id), 1); 
    // console.log(users)
    console.log(`Socket ${socket.id} disconnected.`);

    // db.collection('sockets').remove( { uniqueId:unique_id }, function (err, message) {
    //   console.log(err)
    //   console.log(message.ok)
    // })

    // socketsModel.remove({ uniqueId:unique_id }, function(err) {
    //   if (!err) {
    //     console.log('notification!');
    //   }else {
    //     console.log(err);
    //   }
    // });

    // `doc` is the document _after_ `update` was applied because of
    // `new: true`
    socketsModel.findOneAndUpdate({ uniqueId: unique_id }, { socketId: ''}, {
      new: true,
      upsert: true 
    },function( error, result){
      // In this moment, you recive a result object or error
      console.log(result)
    });
  });
});

app.get('/todo', (req, res) => {
  console.log('todo')
});

// Event listeners.
// When a user joins the chatroom.
function onUserJoined(userId, socket) {
  try {
    // The userId is null for new users.
    if (!userId) {
      // var user = db.collection('users').insert({}, (err, user) => {
      //   socket.emit('userJoined', user._id);
      //   users[socket.id] = user._id;
      //   _sendExistingMessages(socket);
      // });
    } else {
      users[socket.id] = userId;
      _sendExistingMessages(socket);
    }
  } catch(err) {
    console.err(err);
  }
}

// When a user sends a message in the chatroom.
function onMessageReceived(message, senderSocket) {
  var userId = users[senderSocket.id];
  // Safety check.
  if (!userId) return;

  _sendAndSaveMessage(message, senderSocket);
}

// Helper functions.
// Send the pre-existing messages to the user that just joined.
function _sendExistingMessages(socket) {
  // var messages = db.collection('messages')
  //   .find({ chatId })
  //   .sort({ createdAt: 1 })
  //   .toArray((err, messages) => {
  //     // If there aren't any messages, then return.
  //     if (!messages.length) return;
  //     socket.emit('message', messages.reverse());
  // });
}

// Save the message to the db and send all sockets but the sender.
function _sendAndSaveMessage(message, socket, fromServer) {
  var messageData = {
    text: message.text,
    user: message.user,
    createdAt: new Date(message.createdAt),
    chatId: chatId
  };

  // db.collection('messages').insert(messageData, (err, message) => {
  //   // If the message is from the server, then send to everyone.
  //   var emitter = fromServer ? io : socket.broadcast;
  //   emitter.emit('message', [message]);
  // });
}

// Allow the server to participate in the chatroom through stdin.
var stdin = process.openStdin();
stdin.addListener('data', function(d) {
  _sendAndSaveMessage({
    text: d.toString().trim(),
    createdAt: new Date(),
    user: { _id: 'robot' }
  }, null /* no socket */, true /* send from server */);
});

