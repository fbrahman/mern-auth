const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CohortSchema = new Schema({
    cohort_auth_id:{
        type:String,
        unique:true,
        require:true
    },
    members:[{
        type:Schema.ObjectId,
        ref:'Users'
    }]
});
module.exports=mongoose.model('Cohort', CohortSchema);