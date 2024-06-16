const db = require('../config/mongoose');
const Dashboard = require('../models/dashboard');
const User = require('../models/register');

module.exports.alltask = async function(req, res){
    try {
        const data = await Dashboard.find({});
        const user = await User.findOne({email: "saisreesatyassss@gmail.com"});
        
        if (!user) {
            console.log('User not found');
            return res.status(404).render('error', {
                title: "Error",
                message: "User not found"
            });
        }
        
        console.log(`**********user`, user.name);
        return res.render('alltask', {
            title: "Dashboard",
            name: user.name,
            dashboard: data
        });
    } catch (err) {
        console.log('Error', err);
        return res.status(500).render('error', {
            title: "Error",
            message: "An error occurred"
        });
    }
}
