const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const voitureSchema = new mongoose.Schema({
    matricule:{
        type:String,
        required:true,
       

    },
    categorie: {
      type: String,
      required: true
    },
   /* modele: {
      type: String,
      required: true
    },*/
  
  });
  
  // Définition du schéma du registre
  const userSchema = new mongoose.Schema({
    nom: {
      type: String,
      required: true
    },
   
    email: {
      type: String,
      required: true,
      unique:true,
    },
    num_tel:{
        type:String,
       required:true,
    },
    mot_de_passe: {
      type: String,
      required: true
    },
  
    voiture: {
      type: voitureSchema, 
      required: true
    },
    resetToken: String,
    expireToken:{
        type:Date,
    }
    
  });

  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.mot_de_passe)
    }

userSchema.pre('save', async function save(next) {
 /* if (this.isModified('mot_de_passe')) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(this.mot_de_passe, salt, function (err, hash) {
            if (err) return next(err);
            this.mot_de_passe = hash;
            next();
        });
    });
}else{
    next();
}
  */
  
   try
     {
          /*  if (!this.isModified('mot_de_passe')) 
            return next();*/
        
            const rounds = await bcrypt.genSalt(10);
        
            const hash = await bcrypt.hash(this.mot_de_passe, rounds);
            this.mot_de_passe = hash;
        
            return next();
        } catch (error) {
        return next(error);
       }

    
      /*  if (!this.isModified('mot_de_passe')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt)
*/
  });
 
  const User = mongoose.model('User', userSchema);

  module.exports = User;
 