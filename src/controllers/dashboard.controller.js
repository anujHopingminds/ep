const db = require("../models");
const dashboard=db.dashboard;

async function adminSignup(req , res){
res.send('Local')
}

module.exports={adminSignup}