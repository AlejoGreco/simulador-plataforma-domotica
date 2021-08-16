// Clases principales //
////////////////////////

class Admin {
    constructor(){
        this.membresias = [];
        this.idUserOn;
        this.idHomeOn;
    }

    crearUsuario(pUsuarios){
        let nuevoId = pUsuarios.length + 1;
        let nombre;
        let apellido;
        let email;
        let password = [];

        nombre = prompt('Ingrese el nombre del nuevo usuario');
        apellido = prompt('Ingrese el apellido');
        email = prompt('Ingrese el email');
        password[0] = prompt('Ingrese su clave');
        password[1] = prompt('Ingrese nuevamente su clave');

        while(password[0] != password [1]){
            password[0] = prompt('Error al ingresar su clave, intente nuevamente');
            password[1] = prompt('Ingrese nuevamente su clave');
        }
        pUsuarios.push(new Usuario(nuevoId, nombre, apellido, email, password[0]));
        return nuevoId;
    }

    crearSmartHome(pSmartHome){
        let nuevoId = pSmartHome.length + 1;
        let respuesta = '';

        pSmartHome.push(new SmartHome(nuevoId,[],[],[],[],[]));

        // Carga de sistema de luminarias
        respuesta = prompt('Desea agregar luminarias inteligentes (s/n)?');
        while(respuesta == 's' || respuesta == 'S'){
            pSmartHome[nuevoId - 1].agregarElementoDeSistema('luz');
            respuesta = prompt('Desea agregar una nueva (s/n)?');
        }

        // Carga de estufas / caloventores / aires
        respuesta = prompt('Desea agregar elementos climatizadores (aires acondicionados / estufas)(s/n)?');
        while(respuesta == 's' || respuesta == 'S'){
            pSmartHome[nuevoId - 1].agregarElementoDeSistema('climatizador');
            respuesta = prompt('Desea agregar uno nuevo (s/n)?');
        }

        // Carga de cerraduras inteligentes
        respuesta = prompt('Desea agregar cerraduras inteligentes en los accesos al hogar(s/n)?');
        while(respuesta == 's' || respuesta == 'S'){
            pSmartHome[nuevoId - 1].agregarElementoDeSistema('acceso');
            respuesta = prompt('Desea agregar uno nuevo (s/n)?');
        }

        respuesta = prompt('Desea agregar huerta inteligente (s/n)?');
        // Carga de huertas inteligentes
        while(respuesta == 's' || respuesta == 'S'){
            pSmartHome[nuevoId - 1].agregarElementoDeSistema('huerta');
            respuesta = prompt('Desea agregar otra huerta inteligente (s/n)?');
        }

        respuesta = prompt('Desea agregar control de piscinas (s/n)?');
        // Carga de control de piscinas
        while(respuesta == 's' || respuesta == 'S'){
            pSmartHome[nuevoId - 1].agregarElementoDeSistema('pool');
            respuesta = prompt('Desea agregar otro control de piscinas (s/n)?');
        }
        return nuevoId;
    }

    crearMembresia(pIdUser, pUsuarios, pIdHome, pSmartHome){
        if(buscarPorId(pIdUser, pUsuarios) && buscarPorId(pIdHome, pSmartHome)){
            this.membresias.push(new Membresia(pIdUser, pIdHome));
            return true;
        }
        return false;
    }
}

class Membresia {
    constructor(pIdUsuario, pIdHouse){
        this.idUser = pIdUsuario;
        this.idHouse = pIdHouse;
    }

    costoSistema(pSistema){
        let precio = 0.0;
        for(let sist of pSistema)
            precio += parseFloat(sist.precio);
        return precio;
    }
    
    costoTotal(pSmartHome){
        let costos = [];
        let actualSmartHome;
        let total = 0.0;
        let msg = '';

        for(let sh of pSmartHome){
            if(sh.id == this.idHouse)
           actualSmartHome = sh;
        }

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
        this.login = false;
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

    obtenerSistema(tipoDeSistema){
        let msg = '';
        switch(tipoDeSistema){
            case 'luz':
                if(this.luces.length > 0){
                    for(let luz of this.luces){
                        msg += luz.obtenerLuzEstado() + '\n';
                    }
                }
                else{
                    msg = 'Sistema de control de luminaria no disponible';
                }
                break;
            case 'climatizador':
                if(this.climatizadores.length > 0){
                    for(let climatizador of this.climatizadores){
                        msg += climatizador.obtenerClimatizadorEstado() + '\n';
                    }
                }
                else{
                    msg = 'Sistema de control de climatizadores no disponible';
                }
                break;
            case 'acceso':
                if(this.accesos.length > 0){
                    for(let acceso of this.accesos){
                        msg += acceso.obtenerAccesoEstado() + '\n';
                    }
                }
                else{
                    msg = 'Sistema de control de accesos no disponible';
                }
                break;
            case 'huerta':
                if(this.huertas.length > 0){
                    for(let huerta of this.huertas){
                        msg += huerta.obtenerHuerta() + '\n';
                    }
                }
                else{
                    msg = 'Sistema de huerta no disponible'
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
// Fin de clases principales //
///////////////////////////////

//////////////////////////////////////////////
// Clases de elementos del sistema domotico //
class Luz {
    constructor(pTipo, pPotencia, pPrecio){
        this.tipo = pTipo;
        this.potencia = pPotencia;
        this.precio = pPrecio;
        this.estado = false;
    }

    obtenerLuzEstado(){
        return `Luz tipo: ${this.tipo}
        Estado: ${this.estado}`;
    }
}

class Climatizador {
    constructor(pTipo, pPrecio){
        this.tipo = pTipo;
        this.precio = pPrecio;
        this.estado = false;
    }

    obtenerClimatizadorEstado(){
        return `Climatizador tipo: ${this.tipo}
        Estado: ${this.estado}`;
    }
}

class Acceso {
    constructor(pTipo, pPrecio){
        this.tipo = pTipo;
        this.precio = pPrecio;
        this.estado = false;
    }

    obtenerAccesoEstado(){
        return `Acceso ${this.tipo}
        Estado: ${this.estado}`;
    }
}

class Huerta {
    constructor(pSensores, pRiego, pPrecio){
        this.sensores = pSensores;
        this.riego = ['Off', pRiego];   // pRiego es un boleano
        this.precio = pPrecio * ( 1 + 0.15 * this.sensores.length);
    }

    obtenerHuerta(){
        let msg = '';
        if(this.sensores.length > 0){
            for(let sensor of this.sensores){
                msg += sensor.obtenerSensor() + '\n';
            } 
        }
        else {
            msg += `Sensores no disponibles\n`;
        }
        if(this.riego[1]){
            msg += `Sistema de riego automatico incluido
            Estado: ${this.riego[0]}`;
        }
        else{
            msg += `Sistema de riego automatico NO disponible`;
        }      
        return msg;
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
    constructor(pTipo, pModelo){
        this.tipo = pTipo;      
        this.modelo = pModelo;
    }

    leerTemperatura(){
        let temp;
        temp = Math.random() * 50 - 10;
        return temp;
    }

    leerHumedad(){
        let hum;
        hum = Math.random() * 100;
        return hum;
    }

    obtenerSensor(){
        return `Sensor de ${this.tipo}
        Modelo: ${this.modelo}`;
    }
}

class Pool {
    constructor(pLuz, pCantidadLuz, pPrecio){
        this.luces = [pLuz, pCantidadLuz];
        this.precio = pPrecio + this.luces[0].precio * this.luces[1];
        this.estado = 'off';
    }

    obtenerPool(){
        return `Luces: ${this.luces[0].tipo} - ${this.luces[0].potencia}
        Cantidad de luces: ${this.luces[1]}
        Estado de la bomba: ${this.estado}`;
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
// Funciones auxiliares //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const buscarPorId = (pId, pArreglo) => {
    let respuesta = pArreglo.filter(elemento => elemento.id == pId);
    if(respuesta[0])
        return respuesta[0];
    return false;
}

// Declaracion de variables del sistema
let mail;
let clave;
let idUser;
let idHome;
let respuesta = 's';

let usuarios = [];
let smartHomes = [];
const admin = new Admin();

// Creacion de usuarios
while(respuesta == 's' || respuesta == 'S'){
    if(idUser = admin.crearUsuario(usuarios))
        respuesta = prompt('Usted ha agregado un nuevo usuario\nDesea ingresar uno nuevo (s/n)?');
    else
        alert('Error al crear el usuario');
}

// Creacion de Smart Homes
respuesta = prompt('Desea crear una nueva Smart House (s/n)?');
while(respuesta == 's' || respuesta == 'S'){
    if(idHome = admin.crearSmartHome(smartHomes))
        respuesta = prompt('Usted ha agregado una nueva Smart Home\nDesea crear una nueva (s/n)?');
    else
        alert('Error al crear la nueva Smart Home');
}

// Creacion de membresia
admin.crearMembresia(idUser, usuarios, idHome, smartHomes);

// Login
respuesta = true;

while(respuesta){
    mail = prompt('Login\nIngrese su Email');
    clave = prompt('Login\nIngrese su clave');
    let aux = 0;
    for(let usuario of usuarios){
        aux++;
        if(usuario.logIn(mail,clave)){
            alert(`Bienvenido ${usuario.nombre} ${usuario.apellido}!`);
            respuesta = false;
        }
        else if(aux == usuarios.length){
            alert(`Nombre o clave incorrecta`);
        }
    }
}

// Visualizacion de sistema
for (let usuario in usuarios){
    if(usuarios[usuario].login && smartHomes[usuario] != undefined){
        alert(`Sistema del usuario:
        Id: ${usuarios[usuario].id}
        Nombre: ${usuarios[usuario].nombre}
        Apellido: ${usuarios[usuario].apellido}`);
        alert('Sistema de iluminacion =>\n' + smartHomes[usuario].obtenerSistema('luz'));
        alert('Sistema de climatizacion =>\n' + smartHomes[usuario].obtenerSistema('climatizador'));
        alert('Puntos de acceso al hogar =>\n' + smartHomes[usuario].obtenerSistema('acceso'));
        alert('Huerta inteligente =>\n' + smartHomes[usuario].obtenerSistema('huerta'));
        alert('Control de piscina =>\n' + smartHomes[usuario].obtenerSistema('pool'));
        alert(admin.membresias[0].costoTotal(smartHomes));
    }
    
}