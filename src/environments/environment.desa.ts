export const environment = {
  production: false,
  envName: 'DESA',
  firebase: {
    apiKey: "AIzaSyBAUINgjqjvyPm0mxoF5qsxjauC5DT7STk",
    authDomain: "adcloslocos-desa.firebaseapp.com",
    projectId: "adcloslocos-desa",
    storageBucket: "adcloslocos-desa.firebasestorage.app",
    messagingSenderId: "206572860520",
    appId: "1:206572860520:web:878a3670d07531992737dd",
    vapidKey:"BHc_3oUhZRZI-V67QHAEUJWK0setp9C6Z2a34FpY-1g7MsnUBBtMPlNNGI5xSHhs_vcsnq3YYxr_o7JQX1G2ivg"
  },

  api: {

    createUserByAdmin:

      'https://us-central1-adcloslocos-desa.cloudfunctions.net/createUserByAdmin'

  },

  mapboxToken: 'pk.eyJ1IjoiZXJsYWRyb24iLCJhIjoiY21yODV4ZWpjMGNjNjJ4c2dodXc4enVyNiJ9.VCEHsbqITRtH3p61KzSY8A',
  useEmulators: false

};