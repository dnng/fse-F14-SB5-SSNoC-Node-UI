var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var Search = require('../models/SearchRest');

module.exports = function(_, io, participants, passport) {
  return {
	  performSearch: function(req, res) {
		  console.log("Search request: " + req.param("search_string") + " in " + req.param("context") + " by " + req.session.passport.user.user_name);
		  var context = req.body.context;
		  console.log("Context: " + context);
		  		  	   
		  var search_tokens = req.body.search_string.split(/[ ,]+/);
		  console.log("Search tokens: " + search_tokens);

		  Search.strip_stop_words(search_tokens, function(filtered_search_tokens) {
			console.log("search.js::filtered search tokens: " + filtered_search_tokens);
			console.log("search.js::context: " + context);
			
			switch (context) {
			  case 'Messages':
				  console.log("*****List of public messages");
				  Search.getAllMessages(search_tokens);
				  break;
			  case 'Directory':
				  console.log("*****List of Citizens");
				  Search.getAllUsers(search_tokens);
				  break;
			  case 'Chats':
				  console.log("*****List of private messages");
				  Search.getAllChatMessagesBetweenUsers(search_tokens);
				  break;
			  case 'Welcome':
				  console.log("*****Welcome - nothing to search here, go back to where you came from");
				  return res.redirect('/welcome');
				  break;
			  case 'Monitor':
				  console.log("*****Monitor - nothing to search here, go back to where you came from");
				  return res.redirect('/monitor');
				  break;
			  case 'Analysis':
				  console.log("******Analysis - nothing to search here, go back to where you came from");
				  return res.redirect('/analysis');
				  break;
			  case 'Users':
				  console.log("*****Admin - List of Citizens");
				  Search.getAllUsers(search_tokens);
				  break;
			  }
		  });
		  
		  //some boo boo happened. falling back to the cute welcome page
		  return res.redirect('/welcome');	  
    }
  };
};


