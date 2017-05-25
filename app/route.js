const express = require('express')
const path = require('path')
const LocalStrategy   = require('passport-local').Strategy;
const app = express();
var morgan = require('morgan');
const exphbs = require('express-handlebars')
var mongoose = require('mongoose');
const bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const config = require('../config/config')
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const salt = bcrypt.genSaltSync(10);
const multer  =   require('multer');
const   fs = require('fs');
const formidable = require("formidable");
const util = require('util');
 //const expressValidator = require('express-validator'); 
//app.use(morgan('dev')); // log every request to the console
// Create a password salt
// initialize passposrt and and session for persistent login sessions


var con = require('./connection');
app.use(session({
secret: "tHiSiSasEcRetStr",
resave: true,
saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

 //app.use(expressValidator); 
// load all the things we need
// body-parser for retrieving form data
//app.use(bodyParser.json()); 

app.use(bodyParser.urlencoded({ extended: true }));
 //app.use(bodyParser({uploadDir:'/path/to/temporary/directory/to/store/uploaded/files'}));
app.use(express.static(__dirname + '/uploads'));



//Validation Url;

//http://blog.ijasoneverett.com/2013/04/form-validation-in-node-js-with-express-validator/

/*app.use(bodyParser.urlencoded({
  extended: false
}))*/


app.use(express.static(path.join('public')));
 app.engine('.hbs', exphbs({
 defaultLayout: 'main',
 extname: '.hbs',
 layoutsDir: path.join('./views/layouts')
 }));

 app.set('view engine', '.hbs');
 app.set('../views', path.join('../views')) ;

 


// development only
app.get('/', (request, response) => {

  response.redirect('/login')
    
 })

  app.get('/dashboard', isLoggedIn,function(request, response){
//console.log(JSON.stringify(data))
  var table='product';
  var table1='users';

    con.query('SELECT COUNT(*) FROM '+table,function(err,rows){
    if(err) throw err;
       //console.log(rows);
           con.query('SELECT COUNT(*) FROM '+table1,function(err1,rows1){
         // console.log(JSON.stringify(rows1[0]['COUNT(*)']));

   
        response.render('dashboard', {
 messages: 'Login Successfully',user:request.session.passport.user,product:rows[0]['COUNT(*)'],users:rows1[0]['COUNT(*)']});
     }); });



//console.log(request.session.passport.user);
 })

///////////////////////////////////////////
////// SHOP PRODUCTadd-prodct
///////////////////////////////////////////

//app.get('/add-product', isLoggedIn,function(request, response){
app.get('/add-product', isLoggedIn,function(request, response){
 response.render('product/add_product', {
 messages:  request.flash('info'),status:request.flash('status')})

 })

//save_product

app.post('/save_product',isLoggedIn,function(request, response){

 var form = new formidable.IncomingForm();
   var uploadDate = Math.floor(1000 + Math.random() * 9000);
    form.parse(request, function (err, fields, files) {

if(fields.name!='' && fields.description!='' && fields.price!='' && files.image.name!=''){

    //console.log(files.image.path);//console.log(files.image.name);//console.log(fields..passport.user);
   var tempPath = files.image.path,

        targetPath = path.resolve('public/uploads/'+uploadDate+files.image.name);
    if (path.extname(files.image.name).toLowerCase() === '.png' || path.extname(files.image.name).toLowerCase() === '.jpg' || path.extname(files.image.name).toLowerCase() === '.jpeg') {
        fs.rename(tempPath, targetPath, function(err) {
            if (err) throw err;
            console.log("Upload completed!");
        });
    } else {
        fs.unlink(tempPath, function () {
            if (err) throw err;
            console.error("Only .png or .jpg files are allowed!");
        });
    }


 var data={name:fields.name,description:fields.description,price:fields.price,image_url: uploadDate+files.image.name,status:1,user_id:request.session.passport.user}

//console.log(JSON.stringify(data))
  var table='product';
     con.query('INSERT INTO '+table+' SET ?', data, function(err,res){
    if(err) throw err;
     if(res.insertId>0 && res.affectedRows>0)
     {   
       request.flash('info', 'Add Product Successfully ');
      request.flash('status',true);
       response.redirect('/add-product');
      //request.flash('msg', 'Successfully Save')
     }
     
     });



}else{
  if(fields.name==''){  request.flash('info', 'Required product name');}
  if(fields.description==''){ request.flash('info', 'Required product description'); }
  if(fields.price==''){ request.flash('info', 'Required product price'); }
  if(files.image.name==''){ request.flash('info', 'Required product image'); }

 request.flash('status',false);
  response.redirect('/add-product');
}



 });
      
 });


app.get('/view-users',isLoggedIn,function(request, response){

    var table='users';
 
 //    con.query('INSERT INTO '+table+' SET ?', data, function(err,res){
   con.query('SELECT * FROM '+table,function(err,rows){
    if(err) throw err;
       //console.log(rows);
             // console.log(request.flash('info'));

       // response.render('product/view_product',{result:JSON.stringify(rows)});
        response.render('user/view_user',{json:rows,info:request.flash('info')});
     });


   });

app.get('/edit-user-:user_id',isLoggedIn,function(request, response){

  //console.log(request.params.user_id);

    var table='users';
 
 //    con.query('INSERT INTO '+table+' SET ?', data, function(err,res){
   con.query('SELECT * FROM '+table+' WHERE user_id='+request.params.user_id,function(err,rows){
    if(err) throw err;
       console.log(request.flash('status'));
       console.log(request.flash('info'));
//console.log(JSON.stringify(rows));

       // response.render('product/view_product',{result:JSON.stringify(rows)});
        response.render('user/add_user',{json:rows,
        messages:request.flash('info'),status:request.flash('status')});
     });


   });

app.post('/update_user',isLoggedIn,function(request, response){


   var uploadDate = Math.floor(1000 + Math.random() * 9000);
 var form = new formidable.IncomingForm();

    form.parse(request, function (err, fields, files) {

console.log(fields);
  if(fields.name!='' && fields.email!='' && fields.status!=''){


  

   //console.log(files.image.path);//console.log(files.image.name);//console.log(fields..passport.user);
   var tempPath = files.image.path,

        targetPath = path.resolve('public/users/'+uploadDate+files.image.name);
        if(files.image.name!=''){


    if (path.extname(files.image.name).toLowerCase() === '.png' || path.extname(files.image.name).toLowerCase() === '.jpg' || path.extname(files.image.name).toLowerCase() === '.jpeg') {
        fs.rename(tempPath, targetPath, function(err) {

            if (err) throw err;

            console.log("Upload completed!");

        });
    } else {
        fs.unlink(tempPath, function () {
            if (err) throw err;
            console.error("Only .png or .jpg files are allowed!");
        });
    }
 var image_url= uploadDate+files.image.name;
  }else{
var image_url= fields.image_url;
  }

var data={name:fields.name,email:fields.email,active:fields.status,image_url: image_url,user_by:request.session.passport.user}

//console.log(JSON.stringify(data))
    var table='users';
     con.query('UPDATE '+table+' SET ? WHERE user_id='+fields.user_id, data, function(err,res){
    //console.log(res);
    if(err)throw err;
     if(res.changedRows>0 && res.affectedRows>0)
     { 
      request.flash('info', 'Update Product Successfully');
       //response.redirect('/edit-product-'+fields.product_id);
       request.flash('status',true);
      response.redirect('/view-users');
     }
     
     });
 }else{

  if(fields.name==''){  request.flash('info', 'Required user name');}
  if(fields.email==''){ request.flash('info', 'Required user email'); }
  if(fields.status==''){ request.flash('info', 'Required user status'); }
  
 // if(files.image.name=='' && fields.image_url==''){ request.flash('info', 'Required user image'); }

  request.flash('status',false);
  response.redirect('/edit-user-'+fields.user_id);
}

    });
 });


app.get('/delete-user-:user_id',isLoggedIn,function(request, response){
 var table='users';
  //    con.query('INSERT INTO '+table+' SET ?', data, function(err,res){
   con.query('DELETE FROM '+table+' WHERE user_id='+request.params.user_id,function(err,rows){
    //console.log(rows);
    if(err) throw err;
     if(rows.affectedRows>0)
     {   
      request.flash('status',true);
      request.flash('info','Successfully Deleted');
      response.redirect('/view-users');
     }
     });
  });

app.get('/view-product',isLoggedIn,function(request, response){

    var table='product';
 
 //    con.query('INSERT INTO '+table+' SET ?', data, function(err,res){
   con.query('SELECT * FROM '+table,function(err,rows){
    if(err) throw err;
      response.render('product/view_product',{json:rows,info:request.flash('info')});
     });
 });

app.get('/edit-product-:product_id',isLoggedIn,function(request, response){

  //console.log(request.params.product_id);

    var table='product';
 
 //    con.query('INSERT INTO '+table+' SET ?', data, function(err,res){
   con.query('SELECT * FROM '+table+' WHERE product_id='+request.params.product_id,function(err,rows){
    if(err) throw err;

        response.render('product/add_product',{json:rows,
       messages:request.flash('info')});
     });


   });

app.post('/update_product',isLoggedIn,function(request, response){


   var uploadDate = Math.floor(1000 + Math.random() * 9000);
  var form = new formidable.IncomingForm();

    form.parse(request, function (err, fields, files) {


if(fields.name!='' && fields.description!='' && fields.price!='' && (files.image.name!='' || fields.image_url!='')){
 sartsa        
             //console.log(files.image.path);//console.log(files.image.name);//console.log(fields..passport.user);
   var tempPath = files.image.path,

        targetPath = path.resolve('public/uploads/'+uploadDate+files.image.name);
        if(files.image.name!=''){


    if (path.extname(files.image.name).toLowerCase() === '.png' || path.extname(files.image.name).toLowerCase() === '.jpg' || path.extname(files.image.name).toLowerCase() === '.jpeg') {
        fs.rename(tempPath, targetPath, function(err) {

            if (err) throw err;

            console.log("Upload completed!");

        });
    } else {
        fs.unlink(tempPath, function () {
            if (err) throw err;
            console.error("Only .png or .jpg files are allowed!");
        });
    }
          var image_url= uploadDate+files.image.name;
  }else{
          var image_url= fields.image_url;
  }

 var data={name:fields.name,description:fields.description,price:fields.price,image_url: image_url,status:1,user_id:request.session.passport.user}

//console.log(JSON.stringify(data))
    var table='product';
     con.query('UPDATE '+table+' SET ? WHERE product_id='+fields.product_id, data, function(err,res){
    //console.log(res);
    if(err)throw err;
     if(res.changedRows>0 && res.affectedRows>0)
     { 
      request.flash('info', 'Update Product Successfully');
       request.flash('status',true);
       //response.redirect('/edit-product-'+fields.product_id);
      response.redirect('/view-product');
     }
     
     });


      }else{

  if(fields.name==''){  request.flash('info', 'Required product name');}
  if(fields.description==''){ request.flash('info', 'Required product description'); }
  if(fields.price==''){ request.flash('info', 'Required product price'); }
  if(files.image.name=='' || fields.image_url==''){ request.flash('info', 'Required product image'); }

 request.flash('status',false);
  response.redirect('/add-product');
}

    });
});


app.get('/delete-product-:product_id',isLoggedIn,function(request, response){

     var table='product';
 
 //    con.query('INSERT INTO '+table+' SET ?', data, function(err,res){
   con.query('DELETE FROM '+table+' WHERE product_id='+request.params.product_id,function(err,rows){
    //console.log(rows);
    if(err) throw err;
     if(rows.affectedRows>0)
     {   
       request.flash('status',true);
      request.flash('info','Successfully Deleted');
      response.redirect('/view-product');
     }
     });

  });

//SELECT `user_id`, `name`, `email`, `password`, `active` FROM `users` WHERE 1

 app.post('/signup', function(request, response)
 { 
  /*   request.assert('name', 'Name is required').notEmpty();           //Validate name
     request.assert('password', 'Password is required').notEmpty();           //Validate name
     request.assert('email', 'A valid email is required').isEmail();  //Validate email
*/

const user = request.body;
//console.log(user);
if(user.name!='' && user.email!='' && user.password!=''){
  if(user.password!=user.cpassword){
   
  response.render('signup',{messages:'Password not match',status :false});
     }else{
     var data={ name:user.name,email:user.email,password:user.password,active:1}
 
   signup_user(user.email,data, function(result){
      
         response.render('signup',{messages:result.messages,status :result.status});
        
    });
  
   }
//console.log('successfully');


}else{
  if(user.name==''){
    //console.log('Name Required');
    request.flash('messages','Name Required');
     }
     if(user.email==''){
    //console.log('email Required');
        request.flash('messages','email Required');
     }
     if(user.password==''){
  //  console.log('password Required');
        request.flash('messages','password Required');
     }
    //console.log('Not Successfully');
    request.flash('status',false);
     var result = request.flash('messages');
    var results = request.flash('status');
     response.render('signup',{messages:result,status : false});
}




})

  app.get('/signup', (request, response) => {
    //console.log(request.flash('info'));
 response.render('signup', {
 messages: request.flash('info') })
 })

app.get('/login', function(request, response){
 //console.log(request.flash('info'));
 response.render('login',{ title:'demo login'})
 })

app.get('/404page', (request, response) => {
 response.render('404')
 })
	// process the login form
/*app.post('/login' ,passport.authenticate('local-login', {
            successRedirect : '/dashboard', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
    }),function(req, res) {
            console.log("hello"+req);

            if (req.body.loginkeeping) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
// req.flash('info', 'Email  OR Password Registered');
      //  console.log(req.flash('info'));
       
        //  res.redirect('/login')
    });*/

app.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {

    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (!user) {
    //  return res.send({ success : false, message : 'authentication failed' });
       
       return res.render('login',{ success : false, messages : info.message});
    }
    // ***********************************************************************
    // "Note that when using a custom callback, it becomes the application's
    // responsibility to establish a session (by calling req.login()) and send
    // a response."
    // Source: http://passportjs.org/docs
    // ***********************************************************************
    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
    //  return res.send({ success : true, message : 'authentication succeeded' });
      return res.render('dashboard',{ success : true, messages : 'authentication succeeded' });
    });      
  })(req, res, next);
});


var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};


var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

 var  signup_user = function(email,user,callback)
{
  con.query("SELECT * FROM users WHERE email = ?",email, function(err, rows) {
                if (err)
                  console.log(err);
                   // return done(err);
                if (rows.length) {
                   //request.flash('messages',);
                 //  request.flash('status',false);
                      var d={
                      messages:'That username is already taken.',
                      status:false
                     };
                      callback(d);
                      // return false;
                    //response.render('signup',{messages:result,status : false});
                      
                   } else {
                     var passwordToSave = bcrypt.hashSync(user.password,salt);
                    //console.log('gen pwd'+passwordToSave);
                  var data={ name:user.name,email:user.email,password:passwordToSave,active:1}
                  var table='users';
                    con.query('INSERT INTO '+table+' SET ?', data, function(err,res){
                    if(err) throw err;
                     if(res.insertId>0 && res.affectedRows>0)
                     {
                      
                       var d= {
                      messages:'Successfully Registered.',
                      status:true
                     };
                      callback(d);

                     }
                     
                     });

                }
            });
};
//**************//
 
// passport needs ability to serialize and unserialize users out of session
passport.serializeUser(function (user, done) {

 // console.log('serializeUser'+JSON.stringify(user));
  //console.log('serializeUser'+user.user_id);
    done(null, true,user.user_id);
});
passport.deserializeUser(function (id, done) {
    //console.log('deserializeUser'+id);
         con.query("SELECT * FROM users WHERE user_id = ? ",id, function(err, rows){
            done(err,true, rows[0]);
   // done(null, users[0]);
    });
});


    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            con.query("SELECT * FROM users WHERE email = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";

                    con.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

// passport local strategy for local-login, local refers to this app
passport.use('local-login', new LocalStrategy(function (username, password, done) {
   //console.log('email'+username);
   //console.log('password'+password);

 con.query("SELECT * FROM users WHERE email = ?",username, function(err, rows){
                if (err)
   
                  return done(null,false, {"message": "Oops! Wrong username or password."});
              //console.log(err);
             //console.log('rows'+rows.length);
                if (!rows.length) {
                 //console.log('No user found.');

                return done(null, false, {"message": "User not found."});
                   // return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                {
                  //   console.log('Oops! Wrong password.');
                  return done(null, false, {"message": "Oops! Wrong password."});
                  // return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                }else{
                // all is well, return successful user
                
                //console.log('Done');
                return done(null,true,rows[0]);
            }
            });

       /* if (username === users[0].username && password === users[0].password) {
            return done(null, users[0]);
        } else {
            return done(null, false, {"message": "User not found."});
        }*/
    })
);
 



// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
    {
        return next();
    }else{
      res.redirect('/404page');
    }
 }

 app.get('/logout',function(req,res){    
   
    req.session.destroy(function(err){  
        if(err){  
            console.log(err);  
        }  
        else  
        {  
            res.redirect('/');  
        }  
    });  

});
 

module.exports = app;