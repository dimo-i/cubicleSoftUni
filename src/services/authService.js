const User = require('../models/User');

const bcrypt = require('bcrypt')
const saltRound = 10

exports.register = async ({username, password, repeatPassword}) => {
    //TODO return form validation message
    if(password !== repeatPassword){
        return false;
    }

    let hashedPassword = await bcrypt.hash(password, saltRound);

    let createdUser = User.create({
        username,
        password: hashedPassword,
    });

    // let createdUser = new User ({
    //     username,
    //     password: hashedPassword,
    // })

    // //await// 
    // createdUser.save();

    return createdUser;
}