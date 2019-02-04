//Funciones dependientes de la página
var lista = new Lista();

function addPerson(name, surname) { //función para añadir una persona a la lista
    var error = document.getElementById("error");
    var list = document.getElementById("list");
    error.innerHTML = "";
    try {
        var person = new Person(name, surname);
        lista.add(person);
        list.innerHTML = lista.toString();
    } catch (err) {
        error.innerHTML = err;
    }
}

function pollPerson() { //función para eliminar una persona de la lista
    var error = document.getElementById("error");
    var list = document.getElementById("list");
    error.innerHTML = "";
    try {
        lista.remove(lista.size() - 1);
        list.innerHTML = lista.toString();
    } catch (err) {
        error.innerHTML = err;
    }
}

//Manejo de errores

//Excepción base para ir creando el resto de excepciones
function BaseException() { }

BaseException.prototype = new Error(); //Herencia del objeto Error
BaseException.prototype.constructor = BaseException; //Definimos el constructor

//Sobreescribimos el método toString para personalizarlos
BaseException.prototype.toString = function () {
    //name y message son propiedades de Error
    return this.name + ": " + this.message;
}

//Excepción personalizada para indicar si el objeto es de tipo Person o no.
//Recibe como parámetro el valor
function NotAPersonException(value) {
    this.name = "NotAPersonException";
    this.message = "El objeto " + value + " no es de tipo Person.";
}

NotAPersonException.prototype = new BaseException(); //Heredamos de BaseException
NotAPersonException.prototype.constructor = NotAPersonException;

//Excepción para indicar si la lista está llena
function IsFull() {
    this.name = "IsFull";
    this.message = "La lista está llena. No puedes meter elementos en ella.";
}
IsFull.prototype = new BaseException();
IsFull.prototype.constructor = IsFull;


//Objeto Person
function Person(name, surname) {
    this.name = name;
    this.surname = surname;

    this.fullname = function () { //función que retorna el nombre completo de la persona
        return this.name + " " + this.surname;
    }
}

//Objeto Lista
function Lista() {
    //this.lista = []; //creamos la lista vacía
    var lista = [];

    var MAX_ELEMENTOS = 5; //este será el máximo número de elementos de la lista

    //Devuelve true o false en función de si la lista está vacía
    this.isEmpty = function () {
        return (lista.length === 0);
    };

    //Devuelve true o false en función de si la lista está llena
    this.isFull = function () {
        return (lista.length === MAX_ELEMENTOS);
    };

    //Devuelve el número de elementos de la lista
    this.size = function () {
        return lista.length;
    };


    /**Añade un nuevo elemento al final de la lista.
     * Devuelve el tamaño de la lista una vez añadido.
     */
    this.add = function (elemento) {
        if (!elemento instanceof Person) throw new NotAPersonException();
        if (!this.isFull()) { //si la lista no está vacía
            lista.push(elemento); //añadimos el nuevo elemento
            lista.sort(function (a, b) {
                if (a.name.toLocaleLowerCase() == b.name.toLocaleLowerCase()) {
                    return a.surname.toLocaleLowerCase() > b.surname.toLocaleLowerCase();
                } else {
                    return a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase();
                }
            }); //ordenamos la lista
        } else {
            throw "La lista está llena. No puedes meter elementos en ella.";
        }
        return this.size(); //devolvemos el tamaño de la lista
    };

    //Devuelve el elemento de la lista de la posición indicada.
    this.get = function (indice) {
        if (indice >= this.size()) { //si el índice es mayor o igual que el tamaño de la lista
            throw "El índice está fuera de los límites de la lista.";
        } else {
            return lista[indice].fullname(); //devolvemos el elemento 
        }

    };

    /**Devuelve la lista en formato cadena.
    * El delimitador de elementos será "-".
    */
    this.toString = function () {
        var str = "";
        if (!this.isEmpty()) {
            var length = this.size();
            for (var i = 0; i < length - 1; i++) {
                str = str + lista[i].fullname() + " - ";
            }
            str = str + lista[i].fullname();
        }
        return str;
    };

    /**Devuelve la posición del elemento indicado.
    * Si el elemento no está en la lista devuelve -1.
    */
    this.indexOf = function (elemento) {
        var posicion = -1; //inicializamos la variable posición a -1
        if (!this.isEmpty()) { //si la lista no está vacía
            posicion = lista.indexOf(elemento); //a posición le asignamos la posición del elemento pasado
        } else {
            throw "El elemento no es una persona";
        }
        return posicion; //devolvemos la posición
    };

    //Devuelve el máximo número de elementos que podemos tener en la lista.
    this.capacity = function () {
        return MAX_ELEMENTOS;
    };


    //Vacía la lista.
    this.clear = function () {
        if (!this.isEmpty()) { //si la lista no está vacía
            lista.splice(0, lista.length); //eliminamos la lista completa a partir de la posición 0
        }
    };


    //Devuelve el primer elemento de la lista.
    this.firstElement = function () {
        var primero;
        if (!this.isEmpty()) { //si la lista no está vacía
            primero = lista[0].fullname(); //a primero le asignmos el valor de la primera posición
        } else {
            throw "La lista está vacía";
        }

        return primero; //devolvemos el primero elemento
    };

    //Devuelve el último elemento de la lista.
    this.lastElement = function () {
        var ultimo;
        if (!this.isEmpty()) { //si la lista no está vacía
            ultimo = lista[this.size() - 1].fullname(); //a ultimo le asignamos el valor de la última posición
        } else {
            throw "La lista está vacía";
        }

        return ultimo; //devolvemos el último elemento
    };


    /**Elimina el elemento de la posición indicada.
     * Devuelve el elemento borrado.
     */
    this.remove = function (indice) {
        var eliminado;
        if (indice > this.size()) { //si el índice es mayor que el tamaño de la lista
            throw "El índice está fuera de los límites de la lista";
        } else {
            eliminado = lista.splice(indice, 1); //devolvemos el elemento que ha sido eliminado
        }
        return eliminado[0].fullname();
    };

    /**Elimina el elemento indicado de la lista. 
     * Devuelve true si se ha podido borrar el elemento,
     * false en caso contrario.
     */
    this.removeElement = function (elemento) {
        if (!this.isEmpty()) { //y la lista no está vacía
            var posicion = this.indexOf(lista, elemento); //guardamos la posición del número pasado 
            if (posicion == -1) { //si la posición es -1, devolvemos FALSE
                return false;
            } else { //en caso contrario, se eliminará ese elemento y devolveremos TRUE
                this.remove(lista, posicion);
                return true;
            }
        }

    };

}


/**Función de testeo en la que comprobaremos, por medio de la consola,
 * el funcionamiento de todos los métodos anteriormente creados.
 */
function test() {
    var lista = new Lista();

    var persona1 = new Person("Lucía", "Menor");
    var persona2 = new Person("Alba", "Santos");
    var persona3 = new Person("Marcos", "López");

    console.log("¿Está vacía? " + lista.isEmpty());
    console.log("¿Está llena? " + lista.isFull());
    console.log("Su tamaño es:  " + lista.size());

    //las añado al array
    console.log("Añadimos al array las personas");
    lista.add(persona1);
    lista.add(persona2);
    lista.add(persona3);
    //lista.add(persona4);

    console.log("¿Está vacía? " + lista.isEmpty());
    console.log("¿Está llena? " + lista.isFull());
    console.log("Su tamaño es:  " + lista.size());

    console.log("Devuelvo la lista en formato cadena: " + lista.toString());
    console.log("Devuelvo el elemento de la lista de la posición indicada [2]: " + lista.get(2));
    console.log("Devuelvo la posición del elemento indicado 'persona2': " + persona2.fullname() + ", posición: " + lista.indexOf(persona2));
    console.log("Devuelvo el máximo número de elementos de la lista: " + lista.capacity());
    console.log("Devuelvo el primer elemento: " + lista.firstElement().toString());
    console.log("Devuelvo el último elemento: " + lista.lastElement().toString());
    console.log("Elimino el elemento de la posición indicada [2]: " + lista.remove(2));
    console.log("Devuelvo la lista en formato cadena: " + lista.toString());
    console.log("Devuelvo la lista en formato cadena: " + lista.toString());
    console.log("Vacío la lista: " + lista.clear());
    console.log(lista.toString());
}

window.onload = test;