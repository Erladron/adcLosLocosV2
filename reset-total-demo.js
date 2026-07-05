const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

const serviceAccount = require('./firebase-key.json');

// Inicialización modular correcta sin 'admin' global
const app = initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth(app);
const db = getFirestore(app);

const usuariosDemo = [
  {
    email: 'juanjur9@gmail.com',
    password: '123456',
    displayName: 'Administrador',
    firestoreData: {
      nombre: 'Administrador del Sistema',
      email: 'juanjur9@gmail.com',
      tipo: 'administrador', 
      estado: 'active',      
      dni: '12345678A',
      telefono: '600112233',
      profesion: 'Controlador de sistemas',
      publicarTelefono: true,
      // 📷 Foto realista de hombre joven/adulto profesional
      foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&h=250&q=80', 
      createdAt: Timestamp.now()
    }
  },
  {
    email: 'juanjur9+1@gmail.com',
    password: '123456',
    displayName: 'Pepe Martínez (Aspirante)',
    firestoreData: {
      nombre: 'Pepe Martínez',
      email: 'juanjur9+1@gmail.com',
      tipo: 'invitado',      
      estado: 'pending_data', 
      dni: '',
      telefono: '',
      invitadoPor: 'admin-uid-placeholder', 
      invitadoPorNombre: 'Juan Jesús',
      fechaInvitacion: Timestamp.now(),
      // 📷 Foto realista de chico joven aspirante
      foto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&h=250&q=80', 
      createdAt: Timestamp.now()
    }
  },
  {
    email: 'juanjur9+2@gmail.com',
    password: '123456',
    displayName: 'Carlos Jiménez (Socio 2)',
    firestoreData: {
      nombre: 'Carlos Jiménez',
      email: 'juanjur9+2@gmail.com',
      tipo: 'socio',         
      estado: 'active',      
      dni: '44556677C',
      telefono: '622334455',
      numeroSocio: 2,
      profesion: 'Hostelero',
      publicarTelefono: true,
      // 📷 Foto realista de hombre mediana edad sonriente
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&h=250&q=80', 
      createdAt: Timestamp.now()
    }
  },
  {
    email: 'juanjur9+4@gmail.com',
    password: '123456',
    displayName: 'María López (Socio 3)',
    firestoreData: {
      nombre: 'María López',
      email: 'juanjur9+4@gmail.com',
      tipo: 'socio',         
      estado: 'active',      
      dni: '99887766D',
      telefono: '633445566',
      numeroSocio: 3,
      profesion: 'Médico',
      publicarTelefono: false, 
      // 📷 Foto realista de mujer profesional sonriente
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&h=250&q=80', 
      createdAt: Timestamp.now()
    },
  },
  {
    email: 'juanjur9+5@gmail.com',
    password: '123456',
    displayName: 'Juan Jesús (Directiva)',
    firestoreData: {
      nombre: 'Juan Jesús',
      email: 'juanjur9+5@gmail.com',
      tipo: 'directiva',     
      estado: 'active',      
      dni: '12345678A',
      telefono: '600112233',
      numeroSocio: 1,
      profesion: 'Ingeniero de Software',
      publicarTelefono: true,
      // 📷 Otra foto de perfil masculina para diferenciar directiva de admin
      foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&h=250&q=80', 
      createdAt: Timestamp.now()
    }
  }
];

// 🧹 FUNCIÓN AUXILIAR: Borra todos los usuarios de Firebase Authentication
async function purgarAuthentication() {
  console.log('🧹 Vaciando registro de usuarios en Authentication...');
  let listUsersResult = await auth.listUsers(1000);
  const uids = listUsersResult.users.map((user) => user.uid);
  
  if (uids.length > 0) {
    await auth.deleteUsers(uids);
    console.log(`🗑️ Eliminados ${uids.length} usuarios de Auth.`);
  } else {
    console.log('ℹ️ Auth ya estaba limpio.');
  }
}

// 🧹 FUNCIÓN AUXILIAR: Borra colecciones completas de Firestore
async function borrarColeccionFirestore(collectionPath) {
  const collectionRef = db.collection(collectionPath);
  const snapshot = await collectionRef.get();
  
  if (snapshot.empty) return;

  const batch = db.batch();
  for (const doc of snapshot.docs) {
    const tokensSnapshot = await doc.ref.collection('tokens').get();
    tokensSnapshot.docs.forEach(tDoc => batch.delete(tDoc.ref));
    
    batch.delete(doc.ref);
  }
  await batch.commit();
  console.log(`🗑️ Colección de Firestore [${collectionPath}] eliminada por completo.`);
}

// 🚀 EJECUCIÓN PRINCIPAL
async function inicializarBaseDeDatosDesdeCero() {
  console.log('🛑 [ALERTA] Iniciando destrucción y reinicio total del entorno...\n');

  try {
    // 1. PURGA Y REINICIO
    await purgarAuthentication();
    await borrarColeccionFirestore('users');
    await borrarColeccionFirestore('events');
    await borrarColeccionFirestore('invitedUsers'); // 🚀 NUEVO: Vaciamos invitaciones previas
    console.log('\n✨ Base de datos y autenticación completamente vírgenes.\n');

    console.log('🏗️ Sembrando nuevos perfiles de demostración...');
    
    // Almacenaremos los UIDs generados para poder cruzar las invitaciones de forma realista
    const uidsMapeados = {};

    // Primero registramos los usuarios en Auth y Firestore
    for (const usuario of usuariosDemo) {
      const userRecord = await auth.createUser({
        email: usuario.email,
        password: usuario.password,
        displayName: usuario.displayName,
        emailVerified: true
      });

      uidsMapeados[usuario.firestoreData.tipo] = userRecord.uid;

      const userDocRef = db.collection('users').doc(userRecord.uid);
      
      // Ajuste dinámico para el campo 'invitadoPor' si es el aspirante Pepe
      if (usuario.firestoreData.tipo === 'invitado') {
        usuario.firestoreData.invitadoPor = uidsMapeados['directiva'] || 'directiva-placeholder-uid';
      }

      await userDocRef.set({
        id: userRecord.uid,
        ...usuario.firestoreData
      });

      console.log(`✅ Registrado en users: ${usuario.firestoreData.nombre} (${usuario.firestoreData.tipo})`);
    }

    console.log('\n🎟️ Generando historial en la colección [invitedUsers]...');

    // 2. INYECCIÓN AUTOMÁTICA EN INVITEDUSERS (EXCEPTO ADMINISTRADOR)
    for (const usuario of usuariosDemo) {
      const tipo = usuario.firestoreData.tipo;
      
      // Saltamos el tipo administrador tal y como has pedido
      if (tipo === 'administrador') continue;

      const uidUsuario = uidsMapeados[tipo];
      const inviteRef = db.collection('invitedUsers').doc(uidUsuario);

      // El anfitrión por defecto de la demo será el miembro de la directiva (Juan Jesús)
      const uidAnfitrion = uidsMapeados['directiva'];

      let estadoInvitacion = 'accepted'; // Por defecto los socios ya están aceptados
      if (tipo === 'invitado') {
        estadoInvitacion = 'pending'; // Pepe Martínez aparecerá como pendiente de validar
      }

      await inviteRef.set({
        id: uidUsuario,
        email: usuario.email,
        invitedBy: uidAnfitrion,
        used: true,
        createdAt: Timestamp.now()
      });

      console.log(`🎫 Invitación inyectada para: ${usuario.firestoreData.nombre}`);
    }

    console.log('\n🦅 [PROCESO COMPLETADO]: Base de datos sincronizada al 100% con invitedUsers.');

  } catch (error) {
    console.error('🚨 Error crítico durante el reset total:', error);
  }
}

inicializarBaseDeDatosDesdeCero();