const { response } = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
// const bcrypt = require("bcrypt");

let instance = null;
dotenv.config();

// Create Database Connection
const chatbotConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "chatbot",
});

// To Connect
chatbotConnection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Customer Review Recieved!");
});

class dbChatbotService {
    static getDbServiceInstance() {
        if (!instance) instance = new dbChatbotService();
        return instance;
    }

    async uploadCustomerReview(ratingsArray) {
        const array = [];
        for (let i = 0; i < 5; i++) {
            array.push(ratingsArray[i]);
        }
        return new Promise((resolve, reject) => {
            const query =
                "INSERT INTO stars(qns1,qns2,qns3,qns4,qns5) VALUES(?);";

            chatbotConnection.query(query, [array], (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result);
            });
        });
    }


    async uploadChatbotConvo(userInput, botResponse) {
        try {
            return new Promise((resolve, reject) => {
                const query =
                    "INSERT INTO chat(UserInput,ChatReply) VALUES(?,?);";

                chatbotConnection.query(query, [userInput, botResponse], (err, result) => {
                    console.log("sent");
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
        }
        catch (e) {
            throw e.message;
            console.log(e);
        }
    }

}
module.exports = dbChatbotService;