const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/my_database')
  .then(() => console.log('Connected!'));


const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    username: String,
    password: String,
    role:Number,

});

const AccountModel = mongoose.model('Account', AccountSchema, 'Account');

// (async () => {
//     await AccountModel.deleteMany({})
//     for (let index = 0; index < 5; index++) {
//         await AccountModel.create({
//             username: `DuyNT${index + 1}`,
//             password: '123456',
//             role:0,
//         })
        
//     }
//     data = await AccountModel.find({})
//     console.log(data);
// })()

module.exports = AccountModel