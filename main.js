///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////            Progrograma para admin (creacion de usuarios y sistemas)              ////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Variables para el sistema de carga de datos
const admin = new Admin();
let usuariosCargados;
let smartHomesCargadas;

// Variables creacion de usuarios
const formUser = document.getElementById('user-form');
// Membresias
const formMembresia = document.getElementById('memb-form');

// Variables creacion smart home
let actualSmartHome = new SmartHome(-1,[],[],[],[],[]);
// Luminarias
const formIlumination = document.getElementById('ilumination-form');
// Accesos
const formAccess = document.getElementById('access-form');
// Climatizadores
const formClima = document.getElementById('clima-form');
// Huertas
const crearSensorButton = document.getElementById('sensor-create-button');
const formHuerta = document.getElementById('huerta-form');
let actualSensorsArray = [];
// Pool
const formPool = document.getElementById('pool-form');
// Boton de creacion de home
const crearHomeButton = document.getElementById('create-home-button');
// Boton lista de homes
const listarHomesButton = document.getElementById('lista-home-button');
// Boton de descarte de cambios
const descartarHomeButton = document.getElementById('descartar-home-button');

// Events listeners

// User form
formUser.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    mostrarItemsRegistrados(admin.crearUsuario(form), 'usuarios');
    $('.user-item:last-child').css('display', 'none');
    $('.user-item:last-child').slideDown(600)
                            .fadeOut(180)
                            .fadeIn(180)
                            .fadeOut(180)
                            .fadeIn(180);
    admin.almacenarEnStorage('usuarios'); // Guardo en el storage (reemplazo el submit)
    cargarSelectMembresias('user');
    //form.submit();
});

// Ilumination form
formIlumination.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    mostrarItemsRegistrados(actualSmartHome.crearIluminationSystem(form), 'luces');
    $('.luz-item:last-child').css('display', 'none');
    $('.luz-item:last-child').slideDown(600)
                            .fadeOut(180)
                            .fadeIn(180)
                            .fadeOut(180)
                            .fadeIn(180);
    //form.submit();
});

// Access form
formAccess.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    mostrarItemsRegistrados(actualSmartHome.crearAccessSystem(form), 'accesos');
    $('.access-clima-item:last-child').css('display', 'none');
    $('.access-clima-item:last-child').slideDown(600)
                            .fadeOut(180)
                            .fadeIn(180)
                            .fadeOut(180)
                            .fadeIn(180);
    //form.submit();
})

// Climatizador form
formClima.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    mostrarItemsRegistrados(actualSmartHome.crearClimaSystem(form), 'clima');
    $('.access-clima-item:last-child').css('display', 'none');
    $('.access-clima-item:last-child').slideDown(600)
                                      .fadeOut(180)
                                      .fadeIn(180)
                                      .fadeOut(180)
                                      .fadeIn(180);
});

// Huerta
// Creacion de sensores para la huerta
crearSensorButton.addEventListener('click', (e) => {
    const tipoSensor = document.getElementById('tipo-sensor');
    const ubiSensor = document.getElementById('ubi-sensor');
    let tipo;
    let ubicacion;
    if(tipoSensor.value != 'Tipo' && ubiSensor.value != 'Ubicacion'){
        switch (tipoSensor.value){
            case '1':
                tipo = 'Temperatura';
                break;
            case '2':
                tipo = 'Humedad';
                break;
            case '3':
                tipo = 'Nivel';
                break;
        }

        switch (ubiSensor.value){
            case '1':
                ubicacion = 'Ambiente';
                break;
            case '2':
                ubicacion = 'Suelo';
                break;
            case '3':
                ubicacion = 'Riego';
                break;
        }
        actualSensorsArray.push(new Sensor(tipo + ` ${actualSensorsArray.length + 1}`,ubicacion));
        mostrarItemsRegistrados(actualSensorsArray, 'sensores');
        $('.sensor-item:last-child').css('display', 'none');
        $('.sensor-item:last-child').slideDown(600)
                                    .fadeOut(180)
                                    .fadeIn(180)
                                    .fadeOut(180)
                                    .fadeIn(180);
    }
});

// Creacion de huerta
formHuerta.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target.lastElementChild;
    mostrarItemsRegistrados(actualSmartHome.crearHuertaSystem(form), 'huerta');
    $('.huerta-item:last-child').css('display', 'none');
    $('#lista-sensores').slideUp(300);
    $('.huerta-item:last-child').delay(310)
                                .slideDown(600)
                                .fadeOut(180)
                                .fadeIn(180)
                                .fadeOut(180)
                                .fadeIn(180);
    mostrarItemsRegistrados([],'sensores');
});

// Creacion de piscina
formPool.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    mostrarItemsRegistrados(actualSmartHome.crearPoolSystem(form), 'pool');
    $('.pool-item:last-child').css('display', 'none');
    $('.pool-item:last-child').slideDown(600)
                              .fadeOut(180)
                              .fadeIn(180)
                              .fadeOut(180)
                              .fadeIn(180);
});

// Boton para crear smart house
crearHomeButton.addEventListener('click', () => {
    actualSmartHome = admin.crearSmartHome(actualSmartHome);
    mostrarItemsRegistrados(admin.smartHomes, 'homes');
    $('.home-item:last-child').css('display', 'none');
    
    $('#lista-luminarias').slideUp(300);
    $('#lista-accesos').slideUp(300);
    $('#lista-climas').slideUp(300);
    $('#lista-huertas').slideUp(300);
    $('#lista-sensores').slideUp(300);
    $('#lista-pool').slideUp(300);

    mostrarItemsRegistrados([],'luces');
    mostrarItemsRegistrados([],'accesos');
    mostrarItemsRegistrados([],'clima');
    mostrarItemsRegistrados([],'sensores');
    mostrarItemsRegistrados([],'huerta');
    mostrarItemsRegistrados([],'pool');

    $('.home-item:last-child').delay(300)
                              .slideDown(600)
                              .fadeOut(180)
                              .fadeIn(180)
                              .fadeOut(180)
                              .fadeIn(180);
    
    admin.almacenarEnStorage('homes'); 
    cargarSelectMembresias('home');

    $("#lista-luminarias").delay(200).fadeIn(300);
    $("#lista-accesos").delay(200).fadeIn(300);
    $("#lista-climas").delay(200).fadeIn(300);
    $("#lista-huertas").delay(200).fadeIn(300);
    $("#lista-sensores").delay(200).fadeIn(300);
    $("#lista-pool").delay(200).fadeIn(300);   
});

// Crear membresias
formMembresia.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    admin.crearMembresia(form);
    cargarSelectMembresias('home');
    mostrarMembresias(admin.agruparMembresias());
    admin.almacenarEnStorage('homes');
    admin.almacenarEnStorage('usuarios');

    $('.memb-item:last-child').css('display', 'none');
    $('.memb-item:last-child').slideDown(600)
                            .fadeOut(180)
                            .fadeIn(180)
                            .fadeOut(180)
                            .fadeIn(180);
    //form.submit();
});

listarHomesButton.addEventListener('click', () => {
    const offsetTop = document.querySelector('.homes-container').offsetTop;
    window.scroll({
        top: offsetTop,
        behavior: "smooth"
    });
});

// Boton para borrar la carga de smart house en curso
descartarHomeButton.addEventListener('click', () => {
    actualSmartHome = new SmartHome(-1, [], [], [], [], []);
    mostrarItemsRegistrados([],'luces');
    mostrarItemsRegistrados([],'accesos');
    mostrarItemsRegistrados([],'clima');
    mostrarItemsRegistrados([],'sensores');
    mostrarItemsRegistrados([],'huerta');
    mostrarItemsRegistrados([],'pool');
});
// Fin events listeners

// Programa

// Busco mi lista de usuarios creada con anterioridad
usuariosCargados = localStorage.getItem('usuarios');
if(usuariosCargados){
    // JSON.parse devuelve tipo object (no tipo user -> no tengo sus metodos)
    admin.usuarios = JSON.parse(usuariosCargados).map(userObj => {
        // Utilizo map para crear un array nuevo de tipo Usuarios
        const usuario = new Usuario();
        // Con Object.assign asigno las propiedes leidas al usuario
        Object.assign(usuario, userObj);
        
        // Simil a lo anterior pero con el arreglo de membresias
        usuario.membresias = usuario.membresias.map(mObj => {
            const m = new Membresia();
            Object.assign(m, mObj); 
            return m;
        });

        return usuario;
    });
}

// Busco mi lista de smart homes creada con anterioridad
smartHomesCargadas = localStorage.getItem('homes');
if(smartHomesCargadas){
    // JSON.parse devuelve tipo object (no tipo SmartHome -> no tengo sus metodos)
    admin.smartHomes = JSON.parse(smartHomesCargadas).map(homeObj => {
        // Utilizo map para crear un array nuevo de tipo Smart Home
        const home = new SmartHome(-1,[],[],[],[],[]);
        // Con Object.assign asigno las propiedes leidas a la home
        Object.assign(home, homeObj);       

        // Simil a lo anterior pero con el arreglo de huertas
        home.huertas = home.huertas.map(hObj => {
            const h = new Huerta([],[],0);
            Object.assign(h, hObj); 
            return h;
        });

        // Simil a lo anterior pero con el arreglo de piscinas
        home.pool = home.pool.map(pObj => {
            const p = new Pool([],[], 0);
            Object.assign(p, pObj); 
            return p;
        });
        return home;
    });
}

// Grafico mi lista de usuarios
mostrarItemsRegistrados(admin.usuarios, 'usuarios');

// Grafico mi lista de smart homes
mostrarItemsRegistrados(admin.smartHomes, 'homes');

// Grafico la lista de membresias existentes
mostrarMembresias(admin.agruparMembresias());

// Cargo los usuarios y homes seleccionables para membresias
cargarSelectMembresias('user');
cargarSelectMembresias('home');

