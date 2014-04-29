var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var filmsSchema = new Schema({  
  titulo: { type: String },
  categoria:  { type: String },
  director:  { type: String },
  descripcion:  { type: String },
  precio:   { type: Number },
  stock:   { type: Number },
  imagen:  { type: String }   
});

module.exports = mongoose.model('movies', filmsSchema);