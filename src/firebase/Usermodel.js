export const Usermodel = {
    id: "string",
    firstName: "string",
    lastName: "string",
    city: "string",
    adress: "string",
    postalCode: "string",
    phoneNumber: "string",
    credentials: [],
    email: "string",
    password: "string",
    createdAt: Date.now(),
    lastOnline: Date.now(),
    role: roles.user,
};


export const Adminmodel = {
    id: "string",
    firstName: "string",
    lastName: "string",
    city: "string",
    adress: "string",
    postalCode: "string",
    phoneNumber: "string",
    email: "string",
    departement: "string",
    password: "string",
    createdAt: Date.now(),
    lastOnline: Date.now(),
    role: roles.admin,
};

export const roles = {
    admin: "admin",
    user: "user",
}