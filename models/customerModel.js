const {Schema, model} = require("mongoose");

const customerSchema = new Schema({
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required : true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        // Required only for manual signups. Social-login accounts (google /
        // facebook) have no password, so it stays optional for them.
        required : function () { return this.method === 'menualy' },
        select: false
    },
    method: {
        type: String,
        required : true
    },
},{ timestamps: true })

module.exports = model('customers',customerSchema)
