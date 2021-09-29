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

    crearMembresia(pFormMembresia){
        const form = pFormMembresia;
        const elementos = form.children;
        let contenido = [];
        let i = 0;
    
        // Recorro los elementos del formulario y extraigo los datos
        for(let elemento of elementos){
            if(elemento.type != 'submit'){
                contenido[i++] = elemento.lastElementChild.value;
            }  
        }

        // Encuentro el usuario y creo la membresia
        for(const user of this.usuarios){
            if(user.id == parseInt(contenido[0])){
                user.membresias.push(new Membresia(parseInt(contenido[1]), contenido[2], contenido[3], contenido[4]));
            }
        }

        // Marcamos la home como ya asignada a un usuario
        this.smartHomes.forEach(h => {
            if(h.id == contenido[1]){ h.libre = false; }
        });
    }

    agruparMembresias(){
        // Me junta todas las membresias dispersas por los distintos usuarios
        // y las pone en un solo arreglo - Dicho arreglo esta apareado por misma posicion
        // con un arreglo de id's de usuarios correspondiente
        let totalMembresias = [];
        let idUsuarios = [];
        let indice = 0;

        for(const user of this.usuarios){
            if(user.membresias.length > 0){
                for(const memb of user.membresias){
                    totalMembresias.push(memb);
                    idUsuarios[indice++] = user.id;
                }
            }
        }
        return [totalMembresias, idUsuarios];
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
}

class Membresia {
    constructor(pIdHome, pTipo, pDate, pDuracion){
        this.idHome = pIdHome;
        this.tipo = pTipo;
        this.date = pDate;
        this.duracion = pDuracion;
    }

    costoSistema(pSistema){
        let precio = 0.0;
        for(let sist of pSistema)
            precio += parseFloat(sist.precio);
        return precio;
    }
    
    costoTotal(){
        let costos = [];
        
        const home = buscarPorId(this.idHome, admin.smartHomes);
        costos[0] = this.costoSistema(home.luces);
        costos[1] = this.costoSistema(home.climatizadores);
        costos[2] = this.costoSistema(home.accesos);
        costos[3] = this.costoSistema(home.huertas);
        costos[4] = this.costoSistema(home.pool);
    
        costos.sort((a, b) => b.costo - a.costo);
        let total = 0.0;

        for(let cost of costos){
            total += cost;
        }
        costos[5] = total;
        return costos;
    }

    obtenerInfoRegistro(pUser){
        return `<div class="memb-item">
            <p>Usuario: ${pUser.nombre} ${pUser.apellido}</p>
            <p>Home: ${this.idHome}</p>
            <p>Tipo de membresia: ${this.tipo}</p>
            <p>Inicio: ${this.date}</p>
            <p>Duración: ${this.duracion}</p>
            <button class="clear-button">Borrar membresia</button>
        </div>
        <div class="costos-container">
            <p>Costo total del sistema: $ ${Math.fround(this.costoTotal()[5].toFixed(2))}</p>
            <p>Costo mensual: $ ${Math.fround(this.costoTotal()[5] / this.duracion).toFixed(2)}</p>
        </div>`;
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

    obtenerInfoRegistro(){
        return `<p>Nombre: ${this.nombre}</p>
        <p>Apellido: ${this.apellido}</p>
        <p>Email: ${this.email}</p>
        <p>Password: ${this.password}</p>
        <p>Id de usuario: ${this.id}</p>
        <button class="clear-button">Borrar usuario</button>`;
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
        this.libre = true;
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
        <button class="clear-button">Eliminar</button>`;

        return info;
    }
    ////////////////////////////////////////////////////////////////////

    /* obtenerSistema(tipoDeSistema){
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
    } */
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
        <button class="clear-button">Eliminar</button>`;
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
        <button class="clear-button">Eliminar</button>`;
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
        <button class="clear-button">Eliminar</button>`;
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
        <button class="clear-button">Eliminar huerta</button>`;
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
        <input type="button" value="Eliminar" class="clear-button">`;
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
        <button class="clear-button">Eliminar</button>`;
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
