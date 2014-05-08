var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;
var filmsSchema = new Schema({  
  category: { type: String } 
});

module.exports = mongoose.model('categories', filmsSchema);