let validator = {};

validator.name = (name) => {
    if (name.length < 3) {
        return false;
    }
    else {
        return true;
    }
}

validator.contacts = (phone) => {
    if ((phone >= 1000000000) && (phone < 9999999999)) {
        return true;
    }
    else {
        return false;
    }

}

validator.address = (address) => {
    if (address.length < 10) {
        return false;
    }
    else {
        return true;
    }
}

validator.description = (description) => {
    if (description.length < 20) {
        return false;
    }
    else {
        return true;
    }
}

validator.pass = (password) => {
    if ((password.length >= 8) && (password.length <= 12)) {
        return true;
    }
    else {
        return false;
    }
}

validator.email = (emailid) => {
    let emailPattern = new RegExp("(?=.@*)(?=.+.com)");
    if (emailPattern.test(emailid)) {
        return true;
    }
    else {
        return false;
    }

}

validator.shopName = (shop) => {
    if (shop.length < 3) {
        return false;
    }
    else {
        return true;
    }
}



validator.shopCategory = (category) => {
    let categories = process.env.categoryList;
    if (categories.includes(category)) {
        return true;
    }
    else {
        return false;
    }

}

validator.role = (role) => {
    let roles = ['Owner', 'User']
    if (roles.includes(role)) {
        return true;
    }
    else {
        return false;
    }

}

module.exports = validator;
