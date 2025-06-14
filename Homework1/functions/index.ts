const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.setCustomClaimsOnCreate = functions.auth.user().onCreate((user) => {
  const customClaims = {
    direccion: "Calle Ejemplo 123", // Valor por defecto (puedes personalizarlo)
    fechaNacimiento: "1990-01-01", // Valor por defecto
    edad: 35 // Valor por defecto (puedes calcularlo dinámicamente)
  };

  return admin.auth().setCustomUserClaims(user.uid, customClaims);
});