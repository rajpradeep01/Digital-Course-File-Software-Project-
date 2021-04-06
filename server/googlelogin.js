var express = require('express');
var app = express();
var mysql = require('mysql');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const { urlencoded } = require('express');


const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '702568242650-7mth13f0ce7gfdbp3jqkn731dquqi45q.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "digitalcoursefile_db"
  });

  var urlencodedParser = bodyParser.urlencoded({ extended: true });
  app.set('view engine','ejs');
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(require('express-post-redirect'));
  app.use(express.json());
  app.use(cookieParser());

 module.exports = function(app){
   
app.get('/dashboard', checkAuthenticated, function(req,res)
{
    let user = req.user;
    con.connect(function(err){
        con.query(`select * from login where email='${user.email}';`,function(err,results){
            if(results.length==0){res.redirect('/loginpage');}
            else{
                if(results[0].role=="admin"){res.render('admin', {username: results[0].username});}
                else if(results[0].role=="faculty"){res.render('faculty_portal_page', {username: results[0].username});}
                else{res.render('student', {username: results[0].username});}
            }
        });
    });
    
});

app.get('/logout', function(req,res)
{
    res.clearCookie('session-token');
    res.redirect('/loginpage');
});


function checkAuthenticated(req, res, next)
{
    let token_id = req.cookies['session-token'];

    let user = {};
    async function verify() 
    {
        const ticket = await client.verifyIdToken(
        {
            idToken: token_id,
            audience: CLIENT_ID, 
        });
        const payload = ticket.getPayload(); //stores user details
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
    }
    verify()
    .then(function()
    {
        req.user = user;
        next();
    }).
    catch(function(err)
    {
        res.redirect('/loginpage');
    });
}
 }