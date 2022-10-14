const express = require("express");
const routing = express.Router();
const myNotes = require("../Controller/myNotes")

routing.get("/",myNotes.welcome);
routing.post("/register",myNotes.registerUser);
routing.post("/login",myNotes.loginUser);
routing.get("/shopsCategory/:shopCategory",myNotes.shopListCategory);
routing.get("/shopsNearBy/:shopNearAdd",myNotes.shopListNearBy);
routing.post("/shops/:EmailId",myNotes.addShop);
routing.put("/shops/:EmailId",myNotes.updateShop);
routing.delete("/shops/:EmailId",myNotes.deleteShop);
routing.post("/logout",myNotes.logoutUser);
routing.all("*",myNotes.invalidPath);

module.exports= routing;