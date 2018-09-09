# SMSLIVE247API
A Node Interface for SMSLive247 API

You will need to create an account with smslive247.com before you can use this module.
Please check their api documentation [here](http://portal.smslive247.com/developer_api/http.aspx).

# Pre Step
- Create an account on smslive247.com
- Create a subaccount under the original account
Read more [here](http://portal.smslive247.com/developer_api/http.aspx)

## Install
```shell
$ npm install smslive247api --save
```

## Usage Example Using sendMsgQuick cmd
Using sendMsgQuick is probably the fastest way to use SMSLive247 API
```js
const SMSLive24API = require('smslive247api');
const SMSLiveAPI = new SMSLive24API('accountEmail@mail.com', 'subAccountUserName', 'subAccountPassword');

SMSLiveAPI.sendQuickMessage('SMS Body text', '09***', 'SenderName').then((res) => {
  console.log(res)
})
.catch((err) => {
  console.log(err);
})
```
`sendQuickMessage` method accept three parameters 
1. SMS body
2. Receipients phone numbers separated by commas
3. Sender's Name

## Usage Example Using sendMsg cmd
This command requires a user sessionId gotten after login. It is advisable to use this if you're planning to send SMS multiple times.

```js
const SMSLive24API = require('smslive247api');
const SMSLiveAPI = new SMSLive24API('accountEmail@mail.com', 'subAccountUserName', 'subAccountPassword');

SMSLiveAPI.login().then((res) => {
  const sessionId = res.sessionId
  SMS.sendMessage(sessionId, 'TEST MEssage from class', '09****', 'TEST').then((res) => {
    console.log(res)
  })
})
.catch((err) => {
  console.log(err);
})
```
This module exposes a `login` method needed to login into smslive247, this method returns a session Id which you can use for any subsequent request to the server.
`sendMessage` accept 4 parameters
1. sessionId - gotten from login
2. SMS body
3. Receipients phone numbers separated by commas
4. Sender's Name
