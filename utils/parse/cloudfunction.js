const _nodemailer = require("nodemailer");
const _formatDate = (date) => `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()}`;

Parse.Cloud.define("linkUser", async (request) => {
  try {
    if (request.params.provider === "google") {
      const { authData } = request.params;
      const _user = new Parse.User();
      _user.set('username', authData.name);
      _user.set('email', authData.email);
      
      let _linkedUser = await _user.linkWith("google", { authData }, { useMasterKey: true });
      if (_linkedUser.getSessionToken() === undefined) {
        const _userForSessionToken = new Parse.User();
        _linkedUser = await _userForSessionToken.linkWith("google", { authData }, { useMasterKey: true });
      }

      if (_linkedUser.get("expiredDate") === 0) {
        _linkedUser.set("expiredDate", (new Date()).valueOf() + 15 * 60 * 1000);  // 15 mins trial
        _linkedUser = await _linkedUser.save(null, { useMasterKey: true });
      }
      
      return { sessionToken: _linkedUser.getSessionToken() };
    }

    throw new Error("Unknown provider");
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
});

Parse.Cloud.define("checkExpired", async (request) => {
  try {
    const _sessionToken = request.params.sessionToken;
    if (!_sessionToken) { throw new Error("SessionToken shall be provided for joining game"); }
  
    ParseUser.enableUnsafeCurrentUser();
    const _user = await ParseUser.become(_sessionToken);
      
    if (!_user) { throw new Error("Please signin"); }
    return { expired: ((new Date()).valueOf() - _user.get("expiredDate") >= 0) };
  } catch (error) {
    console.error(error);
    return { error: error.message };    
  } 
});

Parse.Cloud.define("purchased", async (request) => {
  try {
    const { email = false, startDate = (new Date()).valueOf(), days = 30, userName = false, userId = false, method = "cash", refNumber = 0, item = "", price = 0, currency = "hkd", remarks = "" } = request.params;
    if (!userId && !userName) { throw new Error("Unknown user"); }
    if (!item) { throw new Error("Unknown item"); }

    const _now = new Date(startDate);
    const _endDate = new Date();
    _endDate.setDate(_now.getDate() + days);
    const _expired = _endDate.valueOf();

    const _userDetail = { name: userName, objectId: (new Date()).valueOf().toString(), email };
    if (userId) {
      const userQuery = new Parse.Query(Parse.User);
      let _user = await userQuery.equalTo("objectId", userId).first({ useMasterKey: true });    
      if (!_user) { throw new Error(`No such user - (${userId})`); }
      
      _user.set("expiredDate", _expired);
      _user = await _user.save(null, { useMasterKey: true });

      _userDetail.objectId = _user.id;      
      _userDetail.name = _user.get("email");
      _userDetail.email = _user.get("email");
    }
    
    let _transaction = new Parse.Object("Transaction");
    _transaction.set("userName", _userDetail.name);
    _transaction.set("userId", _userDetail.objectId);
    _transaction.set("refNumber", refNumber);
    _transaction.set("item", item);
    _transaction.set("startDate", startDate);
    _transaction.set("expiredDate", _expired);
    _transaction.set("method", method);
    _transaction.set("price", price);
    _transaction.set("currency", currency);
    _transaction.set("remarks", remarks);
    
    _transaction = await _transaction.save(null, { useMasterKey: true });

    if (_userDetail.email) {
      const _transporter = _nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "southdee2019.paperless@gmail.com",
          pass: "rvhjnjlxajrmrqlg"
        },
      });
  
      const _items = {
        "online-one-month": "一個月M2線上課程",
        "offline-two-weeks": "兩星期M2極速補底課程"
      };
  
      const _mailOptions = {
        "from": 'anonymous@nopaper.life',
        "to": _userDetail.email,
        "replyTo": 'noreply@nopaper.life',
        "subject": "深宵教室收據 - NoPaper.com",
        "text": `深宵教室收據 - 請保留收據,方便日後核對資料。 收據編號: ${_transaction.id}, 使用者編號: ${_userDetail.objectId}, 購買物品: ${(!_items[item]) ? item : _items[item]}, 價格: $${price} ${currency}, 開始日期: ${_formatDate(_now)}, 到期日期: ${_formatDate(_endDate)}, 備註: ${remarks}`,
        "html": `
          <h3 style="width:100%;text-align:center;"><span style="color:hsl(240,90%,65%);">深宵教室</span>&nbsp;收據</h3>
          <br />
          <h5 style="width:100%;text-align:center;">* 請保留收據,方便日後核對資料</h5>
          <br />
          <p>&nbsp;&nbsp;收據編號:&nbsp;${_transaction.id}</p>
          <p>&nbsp;&nbsp;使用者編號:&nbsp;${_userDetail.objectId}</p>
          <p>&nbsp;&nbsp;購買物品:&nbsp;${_items[item]}</p>
          <p>&nbsp;&nbsp;價格:&nbsp;$${price}&nbsp;${currency}</p>
          <p>&nbsp;&nbsp;開始日期:&nbsp;${_formatDate(_now)}</p>
          <p>&nbsp;&nbsp;到期日期:&nbsp;${_formatDate(_endDate)}</p>
          <p>&nbsp;&nbsp;備註:&nbsp;${remarks}</p>
          <br />
          <h6 style="width:100%;text-align:center;">~ CopyRight@NoPaper.life ~</h6>
        `
      };
  
      _transporter.sendMail(_mailOptions, (error, info) => {
        if (error) { console.error(error); }
        else { console.log('Email sent: ' + info.response); }
      });
    }

    return {
      objectId: _transaction.id,
      userName: _transaction.get("userName"),
      refNumber: _transaction.get("refNumber"),
      method: _transaction.get("method"),
      price: _transaction.get("price"),
      currency: _transaction.get("currency"),
      item: _transaction.get("item"),
      startDate: _transaction.get("startDate"),
      expiredDate: _expired,
      remarks: _transaction.get("remarks")
    };
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
});
