const { response } = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const moment = require('moment');
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
    console.log('Chatbot connected!');
});

class dbChatbotService {
    static getDbServiceInstance() {
        if (!instance) instance = new dbChatbotService();
        return instance;
    }

    async uploadCustomerReview(userId, ratingsArray, feedback) {
        const array = [];
        Object.values(ratingsArray).forEach((rating) => {
            array.push(rating);
        });
        return new Promise((resolve, reject) => {
            const query =
                'INSERT INTO customer_ratings(userId, qns1, qns2, qns3, qns4, qns5, feedback, createdAt) VALUES(?,?, ?, ?);';

            chatbotConnection.query(query, [userId, array, feedback, moment().format('LLLL')], (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result);
            });
        });
    }

    async uploadChatbotConvo(userId, userInput, botResponse) {
        try {
            return new Promise((resolve, reject) => {
                const query = 'INSERT INTO chat(userId, userInput,chatReply) VALUES(?,?,?);';

                chatbotConnection.query(query, [userId, userInput, botResponse], (err, result) => {
                    console.log('sent');
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
            console.log(e);
        }
    }
}
module.exports = dbChatbotService;
