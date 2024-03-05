const express = require('express');
const router = express();

const session = require('express-session');
const { SESSION_SECRET } = process.env;
router.use(session({ secret:SESSION_SECRET }));

const userController = require('../controllers/userController');

const auth = require('../middleware/auth');

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){   // cb = callback
        cb(null, path.join(__dirname,'../public/images'));

    },
    filename: function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null, name);
    } 
});

const upload = multer({storage:storage});

router.get('/', auth.isLogout,userController.loadLogin);
router.post('/', auth.isLogout,userController.login);
router.get('/register', auth.isLogout,userController.loadRegister);
router.post('/register',upload.single('image'), auth.isLogout,userController.register);
router.get('/home', auth.isLogin,userController.loadHome);
router.get('/logout', auth.isLogin,userController.logout);

module.exports = router;