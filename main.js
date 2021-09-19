///////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////        Clases principales         ////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

class Admin {
    constructor(){
        this.usuarios = [];
        this.smartHomes = [];
        this.idUserOn;
        this.idHomeOn;
    }

    crearUsuario(pForm){
        const form = pForm;
        const elementos = form.children;
        let contenido = [];
        let nuevoId = this.usuarios.length + 1;
        let i = 0;
    
        // Recorro los elementos del formulario y extraigo los datos
        for(let elemento of elementos){
            if(elemento.type != 'submit'){
                contenido[i++] = elemento.lastElementChild.value;
            }  
        }
        
        // Creo un Id de usuario que no este repetido
        while(this.usuarios.filter(u => u.id == nuevoId).length > 0){
            nuevoId++;
        } 
        // Agrego el nuevo usuario al arreglo de admin
        // y retorno el nuevo arreglo (para funcion de visualizacion)
        this.usuarios.push(new Usuario(nuevoId, contenido[0], contenido[1], contenido[2], contenido[3]));
        return this.usuarios;
    }

    almacenarEnStorage(pClave){
        if(localStorage.getItem(pClave)){
            localStorage.removeItem(pClave);
        }
        if(pClave == 'usuarios'){
            localStorage.setItem(pClave, JSON.stringify(this.usuarios));
        }
        else {
            localStorage.setItem(pClave, JSON.stringify(this.smartHomes));
        }
        
        if(localStorage.getItem('homes')){
            localStorage.removeItem('homes');
        }
        localStorage.setItem('homes', JSON.stringify(this.smartHomes));
    }

    crearSmartHome(pHomeActual){
        let nuevoId = this.smartHomes.length + 1;
        // Creo y chequeo la unicidad del id y agrego la home al arreglo
        while(this.smartHomes.filter(h => h.id == nuevoId).length > 0){
            nuevoId++;
        }
        pHomeActual.id = nuevoId;
        this.smartHomes.push(pHomeActual);
        return new SmartHome(-1,[],[],[],[],[]);
    }
}

class Membresia {
    constructor(pTipo, pDate, pDuracion){
        this.idHome = -1;
        this.tipo = pTipo;
        this.date = pDate;
        this.pDuracion = pDuracion;
    }

    costoSistema(pSistema){
        let precio = 0.0;
        for(let sist of pSistema)
            precio += parseFloat(sist.precio);
        return precio;
    }
    
    costoTotal(pHome){
        let costos = [];
        let total = 0.0;
        let msg = '';

        const actualSmartHome = pHome;
        //for(let sh of pSmartHomes){
        //    if(sh.id == this.idHouse)
        //   actualSmartHome = sh;
        //}

        costos[0] = {costo : this.costoSistema(actualSmartHome.luces), sistema : 'luces'};
        costos[1] = {costo : this.costoSistema(actualSmartHome.climatizadores), sistema : 'climatizadores'};
        costos[2] = {costo : this.costoSistema(actualSmartHome.accesos), sistema : 'accesos'};
        costos[3] = {costo : this.costoSistema(actualSmartHome.huertas), sistema : 'huertas'};
        costos[4] = {costo : this.costoSistema(actualSmartHome.pool), sistema : 'pool'};
    
        costos.sort((a, b) => b.costo - a.costo);
        
        for(let cost of costos){
            msg += `El costo de sistema ${cost.sistema}= $${cost.costo}\n`;
            total += cost.costo;
        }
        return msg + `\nTotal = $${total}`;
    }
}

class Usuario {
    // Clase Usuario: guarda los datos de todos los usuarios y
    // y les permite loguearse
    constructor(pId, pNombre, pApellido, pEmail, pContra){
        this.id = pId;
        this.nombre = pNombre;
        this.apellido = pApellido;
        this.email = pEmail;
        this.password = pContra;
        this.membresias = [];
        this.login = false;
    }

    crearMembresia(pTipo, pDate, pDuracion){
        this.membresias.push(new Membresia(pTipo, pDate, pDuracion));
        return true;
    }

    obtenerInfoRegistro(){
        return `<p>Nombre: ${this.nombre}</p>
        <p>Apellido: ${this.apellido}</p>
        <p>Email: ${this.email}</p>
        <p>Password: ${this.password}</p>
        <p>Id de usuario: ${this.id}</p>
        <button class="clear-user">Borrar usuario</button>`;
    }

    logIn(email, contra){
        if(this.email == email && this.password == contra){
            this.login = true;
            return this.login;
        }
        else {
            this.login = false;
            return this.login;
        }
    }

    logOut(){
        if(this.login) {
            this.login = false;
            return `Ha cerrado sesion con exito`;
        }
    }
}

class SmartHome {
    // Clase SmartHome: contiene todos los elementos inteligentes del sistema domotico
    // y metodos para mostrar la informacion de su estado y para editar el mismo
    constructor(pId, pLuces, pClimatizadores, pAccesos, phuertas, pPool){
        this.id = pId;
        this.luces = pLuces;
        this.climatizadores = pClimatizadores;
        this.accesos = pAccesos;
        this.huertas = phuertas;
        this.pool = pPool;
    }

    crearIluminationSystem(pFormIlumination){
        let info = extraerInfoForm(pFormIlumination);
        // Creo la nueva luminaria y la agrego al arregle de la smart home temporal
        this.luces.push(new Luz(info[0], info[1], info[2]));
        return this.luces;

    }

    crearAccessSystem(pFormAccess){
        let info = extraerInfoForm(pFormAccess);
        // Creo el nuevo accesoy la agrego al arregle de la smart home temporal
        this.accesos.push(new Acceso(info[0], info[1]));
        return this.accesos;
    }

    crearClimaSystem(pFormClima){
        let info = extraerInfoForm(pFormClima);
        // Creo el nuevo accesoy la agrego al arregle de la smart home temporal
        this.climatizadores.push(new Climatizador(info[0], info[1]));
        return this.climatizadores;
    }

    crearHuertaSystem(pFormHuerta){
        let info = extraerInfoForm(pFormHuerta);
        // Creo la nueva huerta, la agrego al arregle de la smart home temporal y limpio el arreglo de sensores
        this.huertas.push(new Huerta(actualSensorsArray, info[0], info[1]));
        actualSensorsArray = [];
        return this.huertas;
    }

    crearPoolSystem(pFormPool){
        let info = traducirInfoPool(extraerInfoPoolForm(pFormPool));
        // Creo el nuevo control de piscina y la agrego al arregle de la smart home temporal
        this.pool.push(new Pool([new Luz(info[0], info[1], 0), new Luz(info[3], info[4], 0)], [info[2], info[5]], info[6]));
        return this.pool;
    }    

    obtenerInfoRegistro(){
        let info;
        let infoHuerta;
        let infoPool;

        if(this.huertas.length > 0){
            infoHuerta = `<div>
                <p>T ( A / S ) - H ( A / S ) - R</p>
                <p>${this.huertas[0].obtenerCantidadesSensor()[0]} / ${this.huertas[0].obtenerCantidadesSensor()[1]} - ${this.huertas[0].obtenerCantidadesSensor()[2]} / ${this.huertas[0].obtenerCantidadesSensor()[3]} - ${this.huertas[0].obtenerCantidadesSensor()[4]}</p>
            </div>`;
        }
        else {
            infoHuerta = '<div>No disponible</div>';
        }

        if(this.pool.length > 0){
            infoPool = `<div>
                <p>LE - LS</p>
                <p>${this.pool[0].cantidades[0]} - ${this.pool[0].cantidades[1]}</p>
            </div>`;
        }
        else {
            infoPool = '<div>No disponible</div>';
        }

        info = `<p>${this.id}</p>
        <div>
            <p>L - A - C</p>
            <p>${this.luces.length} - ${this.accesos.length} - ${this.climatizadores.length}</p>
        </div>
        ${infoHuerta}
        ${infoPool}
        <button>Eliminar</button>`;

        return info;
    }
    ////////////////////////////////////////////////////////////////////

    obtenerSistema(tipoDeSistema){
        let msg;
        
        switch(tipoDeSistema){
            case 'luz':
                if(this.luces.length > 0){
                    for(let luz of this.luces){
                        msg += luz.obtenerLuzEstado() + '\n';
                    }
                }
                else{
                    msg = `<li class="sist-elemento-1">Sistema de control de luminaria no disponible</li>`;
                }
                break;
            case 'climatizador':
                if(this.climatizadores.length > 0){
                    for(let climatizador of this.climatizadores){
                        msg += climatizador.obtenerClimatizadorEstado() + '\n';
                    }
                }
                else{
                    msg = `<li class="sist-elemento-1">Sistema de control de climatizadores no disponible</li>`;
                }
                break;
            case 'acceso':
                if(this.accesos.length > 0){
                    for(let acceso of this.accesos){
                        msg += acceso.obtenerAccesoEstado() + '\n';
                    }
                }
                else{
                    msg = `<li class="sist-elemento-1">Sistema de control de accesos no disponible</li>`;
                }
                break;
            case 'huerta':
                if(this.huertas.length > 0){
                    for(let huerta of this.huertas){
                        msg = huerta.obtenerHuerta();
                    }
                }
                else{
                    msg = 'Sistema de huerta no disponible';
                }
                break;
            case 'pool':
                if(this.pool.length > 0){
                    for(let p of this.pool){
                        msg += msg = p.obtenerPool() + '\n';
                    }
                }
                else{
                    msg = 'Sistema de piscina no disponible';
                }
                break;
            default:
                msg = 'El sistema elegido no existe';
                break;
        }
        return msg;
    }
}
/////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////      Fin de clases principales       /////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////        Clases de elementos del sistema domotico       /////////
//////////////////////////////////////////////////////////////////////////////////////
class Luz {
    constructor(pIdentificacion, pTipoPot, pPrecio){
        this.id = pIdentificacion;
        this.tipoPot = pTipoPot;
        this.precio = pPrecio;
        this.estado = 'off';
    }

    obtenerInfoRegistro(){
        return `<p>Id: ${this.id}</p>
        <p>Tipo: ${this.tipoPot}</p>
        <p>Precio: $${this.precio}</p>
        <button>Eliminar</button>`;
    }

    obtenerLuzEstado(){
        return `<li class="sist-elemento-1">
        ${this.id}<span class="on">${this.estado}</span>
        <i class="fa-solid fa-toggle-on">ICO</i>
        </li> `;
    }
}

class Climatizador {
    constructor(pId, pPrecio){
        this.id = pId;
        this.precio = pPrecio;
        this.estado = 'off';
    }

    obtenerInfoRegistro(){
        return `<p>Id: ${this.id}</p>
        <p>Precio: $${this.precio}</p>
        <button>Eliminar</button>`;
    }

    obtenerClimatizadorEstado(){
        return `<li class="sist-elemento-2">
        ${this.tipo}<span class="off">${this.estado}</span><span class="off">T = 24 C</span>
        <i class="fa-solid fa-toggle-off">ICO</i>
        </li>`;
    }
}

class Acceso {
    constructor(pId, pPrecio){
        this.id = pId;
        this.precio = pPrecio;
        this.estado = 'close';
    }

    obtenerInfoRegistro(){
        return `<p>Id: ${this.id}</p>
        <p>Precio: $${this.precio}</p>
        <button>Eliminar</button>`;
    }

    obtenerAccesoEstado(){
        return `<li class="sist-elemento-1">
        ${this.tipo}<span class="on">${this.estado}</span>
        <i class="fa-solid fa-toggle-on">ICO</i>
        </li>`;
    }
}

class Huerta {
    constructor(pSensores, pRiego, pPrecio){
        this.sensores = pSensores;
        this.riego = ['Off', pRiego];   // pRiego es un boleano
        this.precio = pPrecio * ( 1 + 0.15 * this.sensores.length);
    }

    obtenerInfoRegistro(){
        let numTem = [0, 0]; // [total, total ambiente]
        let numHum = [0, 0];
        let numNivel = 0;
        let riego = 'NO';
        for(let sensor of this.sensores){
            if(sensor.tipo.startsWith('Temperatura')){
                ++numTem[0];
                if(sensor.ubicacion.startsWith('Ambiente')){
                    numTem[1]++;
                }
            }
            else if(sensor.tipo.startsWith('Humedad')){
                numHum[0]++;
                if(sensor.ubicacion.startsWith('Ambiente')){
                    numHum[1]++;
                }
            }
            else{
                numNivel++;
            }

            if(this.riego[1]){
                riego = 'SI';
            }
        }
        return `<p>Sensores de temperatura<br>Ambiente: ${numTem[1]} - Suelo: ${numTem[0] - numTem[1]}</p>
        <p>Sensores de nivel: ${numNivel}</p>
        <p>Sensores de humedad<br>Ambiente: ${numHum[1]} - Suelo: ${numHum[0] - numHum[1]}</p>
        <p>Riego automatico ${riego}</p>
        <button>Eliminar huerta</button>`;
    }

    obtenerCantidadesSensor(){
        let numTem = [0, 0]; // [total, total ambiente]
        let numHum = [0, 0];
        let riego = 'NO';
        for(let sensor of this.sensores){
            if(sensor.tipo.startsWith('Temperatura')){
                ++numTem[0];
                if(sensor.ubicacion.startsWith('Ambiente')){
                    numTem[1]++;
                }
            }
            else if(sensor.tipo.startsWith('Humedad')){
                numHum[0]++;
                if(sensor.ubicacion.startsWith('Ambiente')){
                    numHum[1]++;
                }
            }

            if(this.riego[1]){
                riego = 'SI';
            }
        }
        return  [numTem[1], numTem[0] - numTem[1], numHum[1], numHum[0] - numHum[1], riego];
    }

    obtenerHuerta(){
        const huertaHTML = [];
        
        huertaHTML[0] = this.obtenerAmbiente();
        huertaHTML[1] = this.obtenerSuelo();
        huertaHTML[2] = this.obtenerRiego();
        return huertaHTML;
    }

    obtenerAmbiente(){
        let resultado = true;
        let fragmento = document.createDocumentFragment();
        let sensoresAmb = this.sensores.filter((s)=> s.ubicacion == 'ambiente')
        if(sensoresAmb.length > 0){
            for(let sensor of sensoresAmb){
                fragmento.appendChild(sensor.obtenerSensor());
            } 
        }
        else {
            let div = document.createElement('DIV');
            div.innerHTML = `<h5>Sensores no disponibles</h5>`;
            div.classList.add('sensor');
            fragmento.appendChild(div);
            resultado = false;
        }
        return fragmento;
    }

    obtenerSuelo(){
        let resultado = true;
        let fragmento = document.createDocumentFragment();
        let sensoresSub = this.sensores.filter((s)=> s.ubicacion == 'suelo')
        if(sensoresSub.length > 0){
            for(let sensor of sensoresSub){
                fragmento.appendChild(sensor.obtenerSensor());
            } 
        }
        else {
            let div = document.createElement('DIV');
            div.innerHTML = `<h5>Sensores no disponibles</h5>`;
            div.classList.add('sensor');
            fragmento.appendChild(div);
            resultado = false;
        }
        return fragmento;
    }

    obtenerRiego(){
        let divRiego;
        let resultado = true;
        let sensorRiego = this.sensores.filter((s)=> s.ubicacion == 'riego')
        if(sensorRiego.length > 0 && this.riego[1]){
            divRiego = sensorRiego[0].obtenerSensor();
            let estadoBomba = document.createElement('P');
            estadoBomba.innerHTML = `Riego: ${this.riego[0]}`;
            divRiego.appendChild(estadoBomba);
        }
        else {
            divRiego = document.createElement('DIV');
            divRiego.innerHTML = `<h5>Sensores no disponibles</h5>`;
            divRiego.classList.add('sensor');
            resultado = false;
        }
        return divRiego;
    }
}

class Sensor {
    constructor(pTipo, pUbicacion){
        this.tipo = pTipo;      
        this.ubicacion = pUbicacion;
    }

    leerTemperatura(){
        let temp;
        temp = Math.random() * 50 - 10;
        return temp;
    }

    leerHumedad(){
        let hum;
        hum = Math.round((Math.random() * 100));
        return hum;
    }

    obtenerInfoRegistro(){
        return `<p>Sensor: ${this.tipo}</p>
        <p>Ubicacion: ${this.ubicacion}</p>
        <input type="button" value="Eliminar">`;
    }

    obtenerSensor(){
        let objetoHtml = document.createElement('DIV');
        objetoHtml.innerHTML = `
        <h5>Sensor ${this.tipo}</h5>
        <p>${this.leerHumedad()}</p>`;
        objetoHtml.classList.add('sensor');
        return objetoHtml;
    }
}

class Pool {
    constructor(pLuces, pCantidades, pPrecio){
        this.luces = pLuces;    // Arreglo de 2 luces
        this.cantidades = pCantidades;  // Arreglo de cantidades de las 2 luces anteriores
        this.precio = pPrecio;
        this.estado = 'off';
    }

    obtenerInfoRegistro(){
        return `<p>Luces exteriores: ${this.cantidades[0]}</p>
        <p>Luces sumergibles: ${this.cantidades[1]}</p>
        <p>Precio sistema: $${this.precio}</p>
        <p>${this.luces[0].tipoPot}</p>
        <p>${this.luces[1].tipoPot}</p>
        <button>Eliminar</button>`;
    }

    modificarEstado(pEstado){
        if(pEstado == 'off' || pEstado == 'filtrando' || pEstado == 'skimer' || pEstado == 'vaciando' || pEstado == 'llenando'){
            this.estado = pEstado;
            return true;
        }
        else{
            return false;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////                Funciones auxiliares                ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const buscarPorId = (pId, pArreglo) => {
    let respuesta = pArreglo.filter(elemento => elemento.id == pId);
    if(respuesta[0])
        return respuesta[0];
    return false;
}

// Extrar informacion de formularios de smart home
const extraerInfoForm = pForm => {
    const form = pForm;
    const elementos = form.children;
    let contenido = [];
    let i = 0;

    // Recorro los elementos del formulario y extraigo los datos
    for(let elemento of elementos){
        if(elemento.type != 'submit'){
            if(elemento.lastElementChild.type != 'checkbox'){
                contenido[i++] = elemento.lastElementChild.value;
            }
            else {
                contenido[i++] = elemento.lastElementChild.checked;
            }
        }
    }
    return contenido;
}

// Extrar informacion de formulario POOL de smart home
const extraerInfoPoolForm = pForm => {
    const form = pForm;
    const elementos = form.children;
    let contenido = [];
    let i = 0;

    // Recorro los elementos del formulario y extraigo los datos
    for(let elemento of elementos){
        if(elemento.type != 'submit'){
            // Chequeo que no sean el div que contiene 4 hijos (las 2 cantidades)
            if(elemento.classList.contains('input-container')){
                contenido[i++] = elemento.lastElementChild.value;
            }
            else {
                // Saco la info seleccionando el elemento correcto de cantidad
                contenido[i++] = elemento.firstElementChild.lastElementChild.value;
                contenido[i++] = elemento.lastElementChild.lastElementChild.value;
            }
        }
    }
    return contenido;
}
const traducirInfoPool = (pPoolInfo) => {
    const cantidad = [];
    const info = [];
    let indiceCantidad = 0;
    let indice = 0;

    for(let dato of pPoolInfo){
        // Si es numerico ya se que son las cantidades de las luces
        // Si no son tipo y potencia de las luces
        if(isNaN(parseInt(dato))){
            switch (dato){
                case 'a':
                    info[indice++] = 'RGB';
                    break;
                case 'b':
                    info[indice++] = 'Calida';
                    break;
                case 'c':
                    info[indice++] = 'Fria';
                    break;
                case 'd':
                    info[indice++] = '12 watts';
                    break;
                case 'e':
                    info[indice++] = '16 watts';
                    break;
                case 'f':
                    info[indice++] = '24 watts';
                    break;
            }
        }
        else {
            cantidad[indiceCantidad++] = dato;
        }  
    }
    let infoFinal = [];
    infoFinal[0] = 'Luminarias exteriores';
    infoFinal[1] = info[0] + ' ' + info[1];
    infoFinal[2] = cantidad[0];
    infoFinal[3] = 'Luminarias sumergibles';
    infoFinal[4] = info[2] + ' ' + info[3];
    infoFinal[5] = cantidad[1];
    infoFinal[6] = cantidad[2]; // precio
    return infoFinal;
}


// Visualizar la lista de los elemenots de sistemas
const mostrarItemsRegistrados = (pArrayItems, pSistema) => {
    const fragmento = document.createDocumentFragment();
    let listaId = '';
    let classNameLI = '';
    let noItem = '';
    switch (pSistema){
        case 'usuarios':
            listaId= 'lista-user';
            classNameLI = 'user-item';
            noItem = 'No hay usuarios registrados';
            break;
        case 'homes':
            listaId= 'lista-home';
            classNameLI = 'home-item';
            noItem = 'No hay smart homes registradas';
            let headerList = document.createElement('LI');
            headerList.classList.add(classNameLI);
            headerList.innerHTML = `<p>Id de home</p>
                <p>Elementos simples</p>
                <p>Huertas</p>
                <p>Piscinas</p>
                <p> - </p>`;
            fragmento.appendChild(headerList);
            break;
        case 'luces':
            listaId= 'lista-luminarias';
            classNameLI = 'luz-item';
            noItem = 'No hay luminarias cargadas en la home actual';
            break;
        case 'accesos':
            listaId= 'lista-accesos';
            classNameLI = 'access-clima-item';
            noItem = 'No hay accesos cargados en la home actual';
            break;
        case 'clima':
            listaId= 'lista-climas';
            classNameLI = 'access-clima-item';
            noItem = 'No hay climatizadores cargados en la home actual';
            break;
        case 'sensores':
            listaId= 'lista-sensores';
            classNameLI = 'sensor-item';
            noItem = 'No hay sensores cargados';
            break;
        case 'huerta':
            listaId= 'lista-huertas';
            classNameLI = 'huerta-item';
            noItem = 'No hay huertas cargadas en la home actual';
            break;
        case 'pool':
            listaId= 'lista-pool';
            classNameLI = 'pool-item';
            noItem = 'No hay piscinas cargadas en la home actual';
            break;
    }
    const listaDeItems = document.getElementById(listaId);
    let itemInfo;
    if(pArrayItems.length > 0){
        for(let item of pArrayItems){
            itemInfo = document.createElement('LI');
            itemInfo.classList.add(classNameLI);
            itemInfo.innerHTML = item.obtenerInfoRegistro();
            fragmento.appendChild(itemInfo);
        }
    }
    else {
        itemInfo = document.createElement('LI');
        itemInfo.classList.add('no-item');
        itemInfo.innerHTML = noItem;
        fragmento.appendChild(itemInfo);
    }
    listaDeItems.innerHTML = '';
    listaDeItems.appendChild(fragmento);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////            Progrograma para admin (creacion de usuarios y sistemas)              ////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Variables para el sistema de carga de datos
const admin = new Admin();
let usuariosCargados;
let smartHomesCargadas;

// Variables creacion de usuarios
const formUser = document.getElementById('user-form');

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
// Boton de descarte de cambian 
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
    $('.huerta-item:last-child').slideDown(600)
                                .fadeOut(180)
                                .fadeIn(180)
                                .fadeOut(180)
                                .fadeIn(180);
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

    $('.home-item:last-child').delay(300)
                              .slideDown(600)
                              .fadeOut(180)
                              .fadeIn(180)
                              .fadeOut(180)
                              .fadeIn(180);
    
    admin.almacenarEnStorage('homes');
    mostrarItemsRegistrados([],'luces');
    mostrarItemsRegistrados([],'accesos');
    mostrarItemsRegistrados([],'clima');
    mostrarItemsRegistrados([],'sensores');
    mostrarItemsRegistrados([],'huerta');
    mostrarItemsRegistrados([],'pool');
    //$('.luz-list').show();
    
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

/* // Botones para eliminar usuarios
document.querySelector(".clear-user").addEventListener('click', (e) => {
    let textoIdUser = e.target.parentElement.children[4].innerText;
    let idUser = parseInt(textoIdUser.split(': ')[1]);
    for(const indice in admin.usuarios){
        if(admin.usuarios[indice].id == idUser){
            admin.usuarios.splice(indice,1);
        }
    }
    admin.almacenarEnStorage('usuarios');
    mostrarItemsRegistrados(admin.usuarios, 'usuarios');
}); 
 */


// Programa

// Busco mi lista de usuarios creada con anterioridad
usuariosCargados = localStorage.getItem('usuarios');
if(usuariosCargados){
    // JSON.parse devuelve tipo object (no tipo user -> no tengo sus metodos)
    admin.usuarios = JSON.parse(usuariosCargados).map(userObj => {
        // Utilizo map para crear un array nuevo de tipo Usuarios
        const usuario = new Usuario();
        Object.assign(usuario, userObj);
        // Con Object.assign asigno las propiedes leidas al usuario
        return usuario;
    });
}

// Busco mi lista de smart homes creada con anterioridad
smartHomesCargadas = localStorage.getItem('homes');
if(smartHomesCargadas){
    // JSON.parse devuelve tipo object (no tipo user -> no tengo sus metodos)
    admin.smartHomes = JSON.parse(smartHomesCargadas).map(homeObj => {
        // Utilizo map para crear un array nuevo de tipo Smart Homr
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

