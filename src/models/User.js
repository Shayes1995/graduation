export class User {
    constructor
    (firstName="", lastName="", city="", adress="", postalCode="", 
        phoneNumber="", email="", password="", confirmPassword=""){
        this.firstName = firstName;
        this.lastName= lastName;
        this.city = city;
        this.adress = adress;
        this.postalCode = postalCode;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }
}

