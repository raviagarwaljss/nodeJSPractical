const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/codewexyDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connection Successful"));


let models = {};

const userSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: [true, 'Required field'],
        },
        Password: {
            type: String,
            required: [true, 'Required field'],
        },
        EmailId: {
            type: String,
            unique: true,
            required: [true, 'Required field'],
        },
        UserId: {
            type: String
        },
        Role: {
            type: String,
            required: [true, 'Required field'],
        },
        Address : {
            type : String,
            required: [true, 'Required field'],
        }
    }
);

models.userModel = new mongoose.model('users', userSchema);

const shopSchema = new mongoose.Schema(
    {
        shopName: {
            type: String,
            unique: true,
            required: [true, 'Required field'],
        },
        shopDescription: {
            type: String,
            required: [true, 'Required field'],
        },
        shopCategory: {
            type: String,
            required: [true, 'Required field'],
        },
        ownerName: {
            type: String,
            required: [true, 'Required field'],
        },
        contacts: {
            type: Number,
            required: [true, 'Required field'],
        },
        shopAddress: {
            type: String,
            required: [true, 'Required field'],
        }
    }
);

models.shopModel = new mongoose.model('shops', shopSchema);



module.exports = models;