const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({github:{}},{strict:false});
module.exports=mongoose.model('User', UserSchema);