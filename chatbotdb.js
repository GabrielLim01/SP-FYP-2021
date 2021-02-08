const { response } = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
// const bcrypt = require("bcrypt");

let instance = null;
dotenv.config();

// Create Database Connection
const chatbotConnection = mysql.createConnection({
    host: 'fyp-database.c01lfveairsf.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '12345678',
    database: 'financial_literacy',
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

    async uploadCustomerReview(ratingsArray, feedback) {
        const array = [];
        for (let i = 0; i < 5; i++) {
            array.push(ratingsArray[i]);
        }
        return new Promise((resolve, reject) => {
            const query =
                "INSERT INTO stars(qns1,qns2,qns3,qns4,qns5, feedback) VALUES(?, ?);";

            chatbotConnection.query(query, [array, feedback], (err, result) => {
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