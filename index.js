/**
 * This module provides access to the SMS LIVE 247 API
 * http://www.smslive247.com/
 *
 * The API provides access to send messages
 *
 * The author of this code has no formal relationship with http://www.smslive247.com/ and does not
 * claim to have created any of the facilities provided by http://www.smslive247.com
 */

const http = require('http');
const { baseUrl } = require('./constants');

class SMSLIVE247API {
  /**
   * Contructor - this takes in the user's sub account username and password
   * NOTE: This is not your original account username and password
   * NOTE: You need to create a sub account username and password on your SMS LIVE 24 account
   * @param {string} ownerEmail - SMS Live 24 owner account email
   * @param {string} subAcctUserName - SMS Live 24 sub account username
   * @param {string} subAcctPassword - SMS Live 24 sub account password
   */
  constructor(ownerEmail, subAcctUserName, subAcctPassword) {
    this.ownerEmail = ownerEmail
    this.subAcctUserName = subAcctUserName
    this.subAcctPassword = subAcctPassword
  }

  /**
   * Login to SMS LIVE 24 subaccount
   * @returns {string} returns session ID
   */
  login() {
    const LOGIN_URL = `${baseUrl}?cmd=login&owneremail=${this.ownerEmail}&subacct=${this.subAcctUserName}&subacctpwd=${this.subAcctPassword}`;
    return accessSMSLive247(LOGIN_URL, 'LOGIN');
  }

  /**
   * sendMessage - send sms to users
   * Note: You can send sms to multiple numbers, separate each number by comma
   * e.g 08166******,081******,090******
   * Sending sms will only be successful if you have sms credit in your smsLive24 subAccount
   * @param {string} sessionId - user session Id
   * @param {string} message - message to send
   * @param {Array} sendTo - recipient phone number(s) in an array object
   * @param {string} sender - sender's name
   */
  sendMessage(sessionId, message, sendTo, sender) {
    const recipient_numbers = sendTo.join(",");
    const SEND_MESSAGE_URL = `${baseUrl}?cmd=sendmsg&sessionid=${sessionId}&message=${message}&sender=${sender}&sendto=${recipient_numbers}&msgtype=0`;
    return accessSMSLive247(SEND_MESSAGE_URL)
  }
  /**
   * Send Quick Message - send quick message
   * This is similar to sendMessage method except that it requires account credentials
   * Unlike sendMessage method that makes use of user's session Id
   * @param {string} message - message to send
   * @param {Array} sendTo - recipient number(s) in an array object
   * @param {string} sender - sender name
   */
  sendQuickMessage(message, sendTo, sender) {
    const recipient_numbers = sendTo.join(",");
    const SEND_QUICK_MESSAGE_URL = `${baseUrl}?cmd=sendquickmsg&owneremail=${this.ownerEmail}&subacct=${this.subAcctUserName}&subacctpwd=${this.subAcctPassword}&message=${message}&sender=${sender}&sendto=${recipient_numbers}&msgtype=0`;
    return accessSMSLive247(SEND_QUICK_MESSAGE_URL)
  }
}

/**
 * Access SMSLIVE247 api
 * @param {string} API_URL - API URL
 * @returns {object} - return a promise
 */
const accessSMSLive247 = (API_URL, TYPE='') => {
  return new Promise((resolve, reject) => {
    http.get(API_URL, (res) => {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const status = rawData.split(" ")[0].split(":")[0];
          if(status != 'OK') {
            reject({
              data: rawData
            });
          }
          if(TYPE==='LOGIN') {
            const sessionId = rawData.split(" ")[1]
            resolve({
              sessionId,
              data: rawData
            })
          } else {
            resolve({
              data: rawData
            });
          }
        } catch (e) {
          reject({
            data: e.message
          });
        }
      });
    }).on('error', (e) => {
      return {
        data: e.message
      }
    });
  });
}

module.exports = SMSLIVE247API
