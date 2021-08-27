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

    crearSmartHome(){
        let nuevoId = this.smartHomes.length + 1;
        let respuesta = '';

        this.smartHomes.push(new SmartHome(nuevoId,[],[],[],[],[]));

        // Carga de sistema de luminarias
        respuesta = prompt('Desea agregar luminarias inteligentes (s/n)?');
        while(respuesta == 's' || respuesta == 'S'){
            this.smartHomes[nuevoId - 1].agregarElementoDeSistema('luz');
            respuesta = prompt('Desea agregar una nueva (s/n)?');
        }

        // Carga de estufas / caloventores / aires
        respuesta = prompt('Desea agregar elementos climatizadores (aires acondicionados / estufas)(s/n)?');
        while(respuesta == 's' || respuesta == 'S'){
            this.smartHomes[nuevoId - 1].agregarElementoDeSistema('climatizador');
            respuesta = prompt('Desea agregar uno nuevo (s/n)?');
        }

        // Carga de cerraduras inteligentes
        respuesta = prompt('Desea agregar cerraduras inteligentes en los accesos al hogar(s/n)?');
        while(respuesta == 's' || respuesta == 'S'){
            this.smartHomes[nuevoId - 1].agregarElementoDeSistema('acceso');
            respuesta = prompt('Desea agregar uno nuevo (s/n)?');
        }

        respuesta = prompt('Desea agregar huerta inteligente (s/n)?');
        // Carga de huertas inteligentes
        while(respuesta == 's' || respuesta == 'S'){
            this.smartHomes[nuevoId - 1].agregarElementoDeSistema('huerta');
            respuesta = prompt('Desea agregar otra huerta inteligente (s/n)?');
        }

        respuesta = prompt('Desea agregar control de piscinas (s/n)?');
        // Carga de control de piscinas
        while(respuesta == 's' || respuesta == 'S'){
            this.smartHomes[nuevoId - 1].agregarElementoDeSistema('pool');
            respuesta = prompt('Desea agregar otro control de piscinas (s/n)?');
        }
        return nuevoId;
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
        <button>Borrar usuario</button>`;
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

    agregarElementoDeSistema(pTipoDeSistema){

        let infoAdmin ='';
        let infoArray = [];
        let creado = true;
        let precio = 0.0;

        switch(pTipoDeSistema){
            case 'luz':                
                infoAdmin = prompt(`Sistema de Iluminacion\nIngrese los parametros de la luminaria separados por guiones medios (Tipo-Potencia-Precio)\nEj: Interior-15 watts-600`);
                infoArray = infoAdmin.split('-');
                this.luces.push(new Luz(infoArray[0], infoArray[1], infoArray[2]));
                break;
            case 'climatizador':
                infoAdmin = prompt(`Sistema de Climatizacion\nIngrese los parametros de la unidad climatizadora separados por guiones medios (Tipo-Precio)\nEj: Aire acondicionado-1500`);
                infoArray = infoAdmin.split('-');
                this.climatizadores.push(new Climatizador(infoArray[0], infoArray[1]));
                break;
            case 'acceso':
                infoAdmin = prompt(`Sistema de acceso al hogar\nIngrese los parametros de los accesos separados por guiones medios (Tipo-Precio)\nEj: Puerta principal-800`);
                infoArray = infoAdmin.split('-');
                this.accesos.push(new Acceso(infoArray[0], infoArray[1]));
                break;
            case 'huerta':
                let riego = false;

                // Riego automatico
                respuesta = prompt('Huerta inteligente\nDesea agregar control de riego (s/n)?');
                if(respuesta == 's' || respuesta == 'S')
                    riego = true;         

                // Precio 
                precio = parseFloat(prompt('Huerta inteligente\nIngrese el precio del sistema'));
                this.huertas.push(new Huerta([], riego, precio));

                respuesta = prompt('Huerta inteligente\nDesea agregar un sensor (s/n)?');
                while(respuesta == 's' || respuesta == 'S'){
                    // Carga de sensores 
                    this.huertas[this.huertas.length - 1].agregarSensor();
                    this.huertas[this.huertas.length - 1].precio += precio * 0.15;
                    respuesta = prompt('Desea agregar uno nuevo (s/n)?');
                }
                break;
            case 'pool':
                let luces = [];
                
                infoAdmin = prompt(`Control de piscina\nSistema de Iluminacion\nIngrese los parametros de la luminaria separados por guiones medios (Tipo-Potencia-Precio)\nEj: Sumergible-15 watts-2300`);
                infoArray = infoAdmin.split('-');
                luces.push(new Luz(infoArray[0], infoArray[1], infoArray[2]));
                luces.push(parseInt(prompt('Control de piscina\nIngrese la cantidad de luces de ese tipo que llevara si piscina?')));
                precio = parseInt(prompt('Control de piscina\nIngrese el precio del sistema de filtrado'));
                this.pool.push(new Pool(luces[0], luces[1], precio));
            default:
                creado = false;
                break;
        }
        return creado;
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
            }else if(sensor.tipo.startsWith('Humedad')){
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

    agregarSensor(){
        let infoAdmin = '';
        let infoArray = [];
        infoAdmin = prompt(`Sistema de control de cultivos\nIngrese los parametros de los sensores separados por guiones medios (Tipo-Modelo)\nEj: Temperatura de Suelo-HL 69`);
        infoArray = infoAdmin.split('-');
        this.sensores.push(new Sensor(infoArray[0], infoArray[1]));
        return this.sensores.length;
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
    switch (pSistema){
        case 'usuarios':
            listaId= 'lista-user';
            classNameLI = 'user-item';
            break;
        case 'luces':
            listaId= 'lista-luminarias';
            classNameLI = 'luz-item';
            break;
        case 'accesos':
            listaId= 'lista-accesos';
            classNameLI = 'access-clima-item';
            break;
        case 'clima':
            listaId= 'lista-climas';
            classNameLI = 'access-clima-item';
            break;
        case 'sensores':
            listaId= 'lista-sensores';
            classNameLI = 'sensor-item';
            break;
        case 'huerta':
            listaId= 'lista-huertas';
            classNameLI = 'huerta-item';
            break;
        case 'pool':
            listaId= 'lista-pool';
            classNameLI = 'pool-item';
            break;
    }
    const listaDeItems = document.getElementById(listaId);
    let itemInfo;
    for(let item of pArrayItems){
        itemInfo = document.createElement('LI');
        itemInfo.classList.add(classNameLI);
        itemInfo.innerHTML = item.obtenerInfoRegistro();
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

// Variables creacion de usuarios
const formUser = document.getElementById('user-form');

// Variables creacion smart home
const actualSmartHome = new SmartHome(-1,[],[],[],[],[]);
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

// Events listeners
// User form
formUser.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    mostrarItemsRegistrados(admin.crearUsuario(form), 'usuarios');
    //form.submit();
});

// Ilumination form
formIlumination.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    mostrarItemsRegistrados(actualSmartHome.crearIluminationSystem(form), 'luces');
    //form.submit();
});

// Access form
formAccess.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    mostrarItemsRegistrados(actualSmartHome.crearAccessSystem(form), 'accesos');
    //form.submit();
})

// Climatizador form
formClima.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    mostrarItemsRegistrados(actualSmartHome.crearClimaSystem(form), 'clima');
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
    }
});

// Creacion de huerta
formHuerta.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target.lastElementChild;
    mostrarItemsRegistrados(actualSmartHome.crearHuertaSystem(form), 'huerta');
});

// Creacion de piscina
formPool.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    /* const tipoSensor = document.getElementById('tipo-sensor');
    const ubiSensor = document.getElementById('ubi-sensor');
    const tipoSensor = document.getElementById('tipo-sensor');
    const ubiSensor = document.getElementById('ubi-sensor');
    if(tipoSensor.value != 'Tipo' && ubiSensor.value != 'Ubicacion'){
     */mostrarItemsRegistrados(actualSmartHome.crearPoolSystem(form), 'pool');
});



























/* // Declaracion de variables del sistema
let mail;
let clave;
let idUser;
let idHome;
let respuesta = 's';
let usuario;
let home;
let huerta = [];

const admin = new Admin();

// Creacion de usuarios
while(respuesta == 's' || respuesta == 'S'){
    if(idUser = admin.crearUsuario())
        respuesta = prompt('Usted ha agregado un nuevo usuario\nDesea ingresar uno nuevo (s/n)?');
    else
        alert('Error al crear el usuario');
}

// Creacion de membresia
usuario = buscarPorId(idUser, admin.usuarios);
usuario.crearMembresia('standar', '16/08/2021', '6 meses');

// Creacion de Smart Homes
respuesta = prompt('Desea crear una nueva Smart House (s/n)?');
while(respuesta == 's' || respuesta == 'S'){
    if(idHome = admin.crearSmartHome())
        respuesta = prompt('Usted ha agregado una nueva Smart Home\nDesea crear una nueva (s/n)?');
    else
        alert('Error al crear la nueva Smart Home');
}

// Vinculo membresia con el sistema creado
usuario.membresias[usuario.membresias.length - 1].idHome = idHome;

// Login (falta implementar en el sistema real)
respuesta = true;

while(respuesta){
    mail = prompt('Login\nIngrese su Email');
    clave = prompt('Login\nIngrese su clave');
    let aux = 0;
    for(let user of admin.usuarios){
        aux++;
        if(user.logIn(mail,clave)){
            alert(`Bienvenido ${user.nombre} ${user.apellido}!`);
            admin.idUserOn = user.id;
            respuesta = false;
        }
        else if(aux == admin.usuarios.length){
            alert(`Nombre o clave incorrecta`);
        }
    }
}

// Visualizacion de sistema del user logueado(falta implementar en el sistema real)
usuario = buscarPorId(admin.idUserOn, admin.usuarios);

if(usuario.membresias.length > 0){
    for(let membresia of usuario.membresias){
        if(membresia.idHome != -1){
            home = buscarPorId(membresia.idHome, admin.smartHomes);
            alert(`Sistema del usuario:
            Id: ${usuario.id}
            Nombre: ${usuario.nombre}
            Apellido: ${usuario.apellido}`);
            document.getElementById('lista-luces').innerHTML = home.obtenerSistema('luz');
            document.getElementById('lista-accesos').innerHTML = home.obtenerSistema('acceso');
            document.getElementById('lista-clima').innerHTML = home.obtenerSistema('climatizador');
            huerta = home.obtenerSistema('huerta');
            document.getElementById('sensorAmb').appendChild(huerta[0]);
            document.getElementById('sensorSub').appendChild(huerta[1]);
            document.querySelector('.huerta-container-3').appendChild(huerta[2]);
            alert('Control de piscina =>\n' + home.obtenerSistema('pool'));
            alert(membresia.costoTotal(home));
        }
    }
    
}
     */
