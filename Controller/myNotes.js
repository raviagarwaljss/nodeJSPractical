const express = require("express");
const validator = require("../Utilities/validator");
const models = require("../Model/schema");

exports.welcome = async (req, res) => {
    res.send('welcome to home page')
}

exports.registerUser = async (req, res, next) => {
    try {
        const details = await models.userModel.find({ EmailId: req.body.EmailId }).collation({ locale: 'en', strength: 2 });
        if (details.length > 0) throw `User exists with this email id`;
        const noOfUser = await models.userModel.find({});
        let counter = noOfUser.length + 1;
        if (!validator.name(req.body.Name)) {
            throw `Enter a valid name with at least 3 characters`;
        }
        if (!validator.pass(req.body.Password)) {
            throw `Enter a valid password with at least 8 and not more than 12 characters`;
        }
        if (!validator.email(req.body.EmailId)) {
            throw `Enter a valid email id`;
        }
        if (!validator.role(req.body.Role)) {
            throw `Enter a valid role like Owner||User`;
        }
        if (!validator.address(req.body.Address)) {
            throw `Enter a valid address with at least 10 characters`;
        }
        let userInfo = {
            Name: req.body.Name,
            Password: req.body.Password,
            EmailId: req.body.EmailId,
            Role: req.body.Role,
            Address : req.body.Address,
            UserId: "U-" + counter
        }
        if ((validator.name(req.body.Name))  && (validator.pass(req.body.Password)) && (validator.email(req.body.EmailId)) && (validator.role(req.body.Role))) {
            const userDetails = await models.userModel.insertMany(userInfo);
            res.status(201).send({ status: "success", data: { message: `Successfully registered with user id - ${userInfo.UserId}` } })
        }
    } catch (err) {
        console.log(err)
        res.status(400).send({ status: "error", data: { message: err } })
    }
}

exports.loginUser = async (req, res, next) => {
    try {
        const details = await models.userModel.find({ EmailId: req.body.EmailId, Password: req.body.Password });
        if (details.length == 0) {
            throw `Email or password is incorrect`;
        }
        else {
            res.cookie('EmailId', req.body.EmailId);
            res.status(201).send({ status: "success", data: { message: `${details[0].Name} logged in successfully` } })
        }
    } catch (err) {
        console.log(err)
        res.status(400).send({ status: "error", data: { message: err } })

    }
}

exports.shopListCategory = async (req, res, next) => {
    try {
        let category  = req.params.shopCategory;
        const details = await models.shopModel.find({shopCategory : category}, { _v: 0, _id: 0 }).collation({ locale: 'en', strength: 2 });
        if (details.length>0){
            res.status(200).send({ status: "success", results: details.length, data: { shops: details } })
        }
        else {
            throw `No result found for selected category`;
        }
    } catch (err) {
        console.log(err)
        res.status(400).send({ status: "error", data: { message: err } })
    }
}

exports.shopListNearBy = async (req, res, next) => {
    try {
        let nearByAddress  = req.params.shopNearAdd;
        const details = await models.shopModel.find({shopAddress : { $regex: new RegExp(nearByAddress, 'i')}}, { _v: 0, _id: 0 });
        if (details.length>0){
            res.status(200).send({ status: "success", results: details.length, data: { shops: details } })
        }
        else {
            throw `No match found for given address`;
        }
    } catch (err) {
        console.log(err)
        res.status(400).send({ status: "error", data: { message: err } })
    }
}

exports.addShop = async (req, res, next) => {
    try {
        if (req.params.EmailId != req.cookies.EmailId) {
            throw `You are not authorized to add shop`;
        }
        const findRole = await models.userModel.find({ EmailId: req.params.EmailId }).collation({ locale: 'en', strength: 2 });
        if (findRole[0].Role!='Owner') throw `Only owner can add shop details`;

        const details = await models.shopModel.find({ shopName: req.body.shopName }).collation({ locale: 'en', strength: 2 });
        if (details.length > 0) throw `Shop exists with this shop name`;

        if (!validator.shopName(req.body.shopName)) {
            throw `Enter a valid name with at least 3 characters`;
        }
        if (!validator.shopCategory(req.body.shopCategory)) {
            throw `Enter a valid category like Stationary/Bakery/Sports/Shoes/Clothes/Dairy`;
        }
        if (!validator.contacts(req.body.contacts)) {
            throw `Enter a valid phone no. with 10 digits`;
        }

        if (!validator.address(req.body.shopAddress)) {
            throw `Enter a valid address with at least 10 characters`;
        }

        if (!validator.description(req.body.shopDescription)) {
            throw `Enter a valid description with at least 20 characters`;
        }

        let shopInfo = {
            shopName: req.body.shopName,
            shopDescription: req.body.shopDescription,
            shopCategory: req.body.shopCategory,
            contacts: req.body.contacts,
            shopAddress: req.body.shopAddress,
            ownerName : findRole[0].Name
        }
        if ((validator.shopName(req.body.shopName)) && (validator.shopCategory(req.body.shopCategory)) && (validator.contacts(req.body.contacts))  && (validator.address(req.body.shopAddress))  && (validator.description(req.body.shopDescription))) {
            const shopDetails = await models.shopModel.insertMany(shopInfo);
            res.status(201).send({ status: "success", data: { message: `${shopDetails[0].shopName} added successfully` } })
        }
    } catch (err) {
        console.log(err)
        if (err.name === 'ValidationError') {
            res.status(400).send({ status: "error", data: { message: `Something went wrong` } })
        }
        else {
            res.status(400).send({ status: "error", data: { message: err } })
        }


    }
}

exports.updateShop = async (req, res, next) => {
    try {
        if (req.params.EmailId != req.cookies.EmailId) {
            throw `You are not authorized to update shop`;
        }
        const findRole = await models.userModel.find({ EmailId: req.params.EmailId });
        if (findRole[0].Role!='Owner') throw `Only owner can update shop details`;

        const updatedShop = req.body
        if (!validator.shopName(req.body.shopName)) {
            throw `Enter a valid name with at least 3 characters`;
        }
        if (!validator.shopCategory(req.body.shopCategory)) {
            throw `Enter a valid category like Stationary/Bakery/Sports/Shoes/Clothes/Dairy`;
        }
        if (!validator.contacts(req.body.contacts)) {
            throw `Enter a valid phone no. with 10 digits`;
        }

        if (!validator.address(req.body.shopAddress)) {
            throw `Enter a valid address with at least 10 characters`;
        }

        if (!validator.description(req.body.shopDescription)) {
            throw `Enter a valid description with at least 20 characters`;
        }

        let shopsName = req.body.shopName;
        const shopsDetails = await models.shopModel.find({ shopName: shopsName }).collation({ locale: 'en', strength: 2 })
        if (shopsDetails.length == 0) {
            throw `Shop is not present in the list`
        }
        else {
            const updateShop = await models.shopModel.findOneAndUpdate({ shopName: shopsName }, { $set: updatedShop }).collation({ locale: 'en', strength: 2 })
            res.status(201).send({ status: "success", data: { message: `Shop details updated successfully` } })
        }
    } catch (err) {
        console.log(err)
        if (err.name === 'ValidationError') {
            res.status(400).send({ status: "error", data: { message: `Something went wrong` } })
        }
        else {
            res.status(400).send({ status: "error", data: { message: err } })
        }
    }
}

exports.deleteShop = async (req, res, next) => {
    try {
        if (req.params.EmailId != req.cookies.EmailId) {
            throw `You are not authorized to delete shop`;
        }

        const findRole = await models.userModel.find({ EmailId: req.params.EmailId });
        if (findRole[0].Role!='Owner') throw `Only owner can delete shop details`;

        let shopsName = req.body.shopName;
        const shopsDetails = await models.shopModel.find({ shopName: shopsName }).collation({ locale: 'en', strength: 2 })
        if (shopsDetails.length == 0) {
            throw `Shop is not present in the list`
        }
        else {
            const deleteShop = await models.shopModel.deleteOne({ shopName: shopsName }).collation({ locale: 'en', strength: 2 })
            res.status(201).send({ status: "success", data: { message: `Shop deleted successfully` } })
        }
    } catch (err) {
        console.log(err)
        res.status(400).send({ status: "error", data: { message: err } })

    }
}



exports.logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('EmailId');
        res.status(201).send({ status: "success", data: { message: `Logged out successfully` } })
    } catch (err) {
        console.log(err)
        res.status(400).send({ status: "error", data: { message: err } })
    }
}

exports.invalidPath = async (req, res) => {
    res.send('pageNotFound')
}