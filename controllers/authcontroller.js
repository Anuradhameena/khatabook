// const userModel=require("../models/userModel")
// const bcrypt = require("bcrypt")
// const jwt= require("jsonwebtoken")
// const hisaabModel = require("../models/hisaabModel")
// const { isLoggedIn } = require("../middlewares/auth_middlewares")

// module.exports.landingPageController=function(req,res){
//     res.render("index",{loggedIn : false})
// }
// module.exports.registerPageController=function(req,res){
//     res.render("register")
// }
// module.exports.registerController = async function(req,res){
//     let {username,name,email,password}=req.body;
     
// try{
//     let user = await userModel.findOne({email})
// if(user) return res.send("you have already an account")
//     let salt = await bcrypt.genSalt(10)
//      let hash = await bcrypt.hash(password,salt)
//     user= await userModel.create({
//         username,
//         name,
//         email,
//         password:hash
//     })
//     let token = jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET_KEY)
//     res.cookie("token",token)
//     res.send("account created")
    
   
 
// }    
// catch(err){
//     res.send(err.message)
// }
// }
// module.exports.loginController = async function(req,res){
//       let{email,password}=req.body
//       let user = await userModel.findOne({email}).select("+password")
//       if(!user) return res.send("user do not have an account,please create one")

//       let result = await bcrypt.compare(password,user.password)
//      if(result){
//         let token = jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET_KEY)
//         res.cookie("token",token)
//         res.redirect("/profile")
//      }
//      else{
//        return res.send("your details are incorrect")
//      }

// }
// module.exports.logoutController= function(req,res){
//     res.cookie("token","")
//     return res.redirect("/")
// }

// module.exports.profileController= async function(req,res){
  
//   let byDate = Number(req.query.byDate);
//   let { startDate, endDate } = req.query;

//   byDate = byDate ? byDate : -1;
//   startDate=startDate ? startDate : new Date("1970-01-01");
//   endDate=endDate ? endDate : new Date();

//     let user =  await userModel
//    .findOne({email:req.user.email})
//    .populate({
//     path: "hisaab",
//     match: {createdAt:{ $gte: startDate, $lte: endDate}},
//     options: {sort: {createdAt: byDate}},
//    });
//     res.render("profile",{user}); 
// }

const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const hisaabModel = require("../models/hisaabModel");
const { isLoggedIn } = require("../middlewares/auth_middlewares");

module.exports.landingPageController = function(req, res) {
    res.render("index", { loggedIn: false });
};

module.exports.registerPageController = function(req, res) {
    res.render("register");
};

module.exports.registerController = async function(req, res) {
    let { username, name, email, password } = req.body;

    try {
        let user = await userModel.findOne({ email });
        if (user) return res.send("You already have an account.");

        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);
        
        user = await userModel.create({
            username,
            name,
            email,
            password: hash
        });

        let token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY);
        res.cookie("token", token);

        // Redirecting to the profile page with an account creation success message
        res.redirect('/profile?accountCreated=true');
    } catch (err) {
        res.send(err.message);
    }
};

module.exports.loginController = async function(req, res) {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email }).select("+password");
    if (!user) return res.send("User does not have an account. Please create one.");

    let result = await bcrypt.compare(password, user.password);
    if (result) {
        let token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY);
        res.cookie("token", token);
        res.redirect("/profile");
    } else {
        return res.send("Your details are incorrect.");
    }
};

module.exports.logoutController = function(req, res) {
    res.cookie("token", "");
    return res.redirect("/");
};

module.exports.profileController = async function(req, res) {
    let byDate = Number(req.query.byDate);
    let { startDate, endDate } = req.query;

    byDate = byDate ? byDate : -1;
    startDate = startDate ? startDate : new Date("1970-01-01");
    endDate = endDate ? endDate : new Date();

    let user = await userModel
        .findOne({ email: req.user.email })
        .populate({
            path: "hisaab",
            match: { createdAt: { $gte: startDate, $lte: endDate } },
            options: { sort: { createdAt: byDate } },
        });

    // Check for account creation success message
    const accountCreated = req.query.accountCreated === 'true' ? true : false;

    res.render("profile", { user, accountCreated });
};




















// module.exports.profileController=async function(req,res,next){
//     const id=req.user.id;
//     const user=await userModel.findOne({
//         _id:id
//     })
//     const hisaabs = await hisaabModel.find({
//         user:user._id
//     })
//     res.render("profile",{isLoggedIn:true,user,hisaabs})
// }
