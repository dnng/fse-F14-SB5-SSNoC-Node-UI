var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function Status(user_name, status, location, statusTime){
  this.local = {
    name : user_name,
    status : status,
    location : location,
    statusTime : statusTime
  };
}

Status.getAllStatuses = function(callback) {
  request(rest_api.get_all_statuses, {json:true}, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }
    if (res.statusCode === 200) {
      var statuses = body.map(function(item, idx, arr){
        return new Status(item.userName, item.status, item.location, item.createdAt);
      });

      console.log("@@@@@ in Status.getAllStatuses succeed statuses :" + JSON.stringify(statuses));
      callback(null, statuses);
      return;
    }
    if (res.statusCode !== 200) {
      callback(null, null);
      return;
    }
  });
};

Status.saveNewStatus = function(user_name, status, location, callback) {
  console.log("inside save new status method with " + user_name + " " + status + " " + location);
  var options = {
    url : rest_api.post_new_status,
    body : {userName: user_name, status: status, location: location},
    json: true
  };

  request.post(options, function(err, res, body) {
    if (err){
      console.log(err);
      callback(err,null);
      return;
    }
    if (res.statusCode !== 200 && res.statusCode !== 201) {
      console.log(res.body);
      callback(res.body, null);
      return;
    }
    var new_status = new Status(body.userName, body.status, body.location, body.statusTime, undefined);
    callback(null, new_status);
    return;
  });
};

module.exports = Status;
