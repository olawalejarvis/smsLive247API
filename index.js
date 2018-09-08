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

class SMSLIVE24API {
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
    this.sessionId = ''
  }

  /**
   * Login to SMS LIVE 24 subaccount
   * @returns {string} returns session ID
   */
  login() {
    const LOGIN_URL = `
    'http://www.smslive247.com/http/index.aspx?
      cmd=login&
      owneremail=${this.ownerEmail}&
      subacct=${this.subAcctUserName}&
      subacctpwd=${this.subAcctPassword}'
    `;
    http.get(LOGIN_URL, (res) => {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          this.sessionId = rawData.split(" ")[1]
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  }

  /**
   * sendMessage - send sms to users
   * Note: You can send sms to multiple numbers, separate each number by comma
   * e.g 08166******,081******,090******
   * Sending sms will only be successful if you have sms credit in your smsLive24 subAccount
   * @param {*} message - message to send
   * @param {*} sendTo - recipient phone number(s)
   * @param {*} sender - sender's name
   */
  sendMessage(message, sendTo, sender) {
    const SEND_MESSAGE_URL = `
      http://www.smslive247.com/http/index.aspx?
        cmd=sendmsg&
        sessionid=${this.sessionId}&
        message=${message}&
        sender=${sender}&
        sendto=${sendTo}&
        msgtype=0
    `;
    http.get(SEND_MESSAGE_URL, (res) => {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const trackingId = rawData.split(" ")[1]
          return {
            status: 200,
            message: 'Your message was sent successfully',
            trackingId
          }
        } catch (e) {
          console.error(e.message);
          return {
            status: 400,
            message: e.message
          }
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
      return {
        status: 500,
        message: e.message
      }
    });
  }
  /**
   * Send Quick Message - send quick message
   * This is similar to sendMessage method except that it requires account credentials
   * Unlike sendMessage method that makes use of user's session Id
   * @param {*} message - message to send
   * @param {*} sendTo - recipient number(s)
   * @param {*} sender - sender name
   */
  sendQuickMessage(message, sendTo, sender) {
    const SEND_QUICK_MESSAGE_URL = `
      http://www.smslive247.com/http/index.aspx?
        cmd=sendquickmsg&
        owneremail=${this.ownerEmail}&
        subacct=${this.subAcctUserName}&
        subacctpwd=${this.subAcctPassword}'
        message=${message}&
        sender=${sender}&
        sendto=${sendTo}&
        msgtype=0
    `;
    http.get(SEND_MESSAGE_URL, (res) => {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const trackingId = rawData.split(" ")[1]
          return {
            status: 200,
            message: 'Your message was sent successfully',
            trackingId
          }
        } catch (e) {
          console.error(e.message);
          return {
            status: 400,
            message: e.message
          }
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
      return {
        status: 500,
        message: e.message
      }
    });
  }
}

export default SMSLIVE24API
