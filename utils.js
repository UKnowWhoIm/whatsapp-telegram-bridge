function parseContacts(vCard){
    try{
        const nameRegex = /FN:(.+)/
        const phoneRegex = /TEL;waid=(\d+):/;
        let firstName = vCard.match(nameRegex)[1];
        let phoneNo = vCard.match(phoneRegex)[1];

        return{
            "firstName": firstName,
            "phoneNo": phoneNo
        }
    }
    catch(err){
        console.log(err);
        return null;
    }
}

module.exports = {
    "parseContacts": parseContacts
}