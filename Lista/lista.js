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
    this.add = function (persona) {
        if (!this.isFull()) { //si la lista no está llena
            lista.push(persona);
        } else {
            throw new IsFull();
        }

        return this.size(); //devolvemos el tamaño de la lista
    };

    /**Añade un nuevo elemento en la posición especificada en la lista.
     * Devuelve el tamaño de la lista una vez añadido.
     */
    this.addAt = function (persona, indice) {
        var longitud = lista.length;

        if (this.isFull(lista)) {
            throw new IsFull();
        } else if (indice >= this.size()) {
            throw "El índice está fuera de los límites de la lista.";
        } else if (indice >= lista.length) {
            lista[lista.length] = persona;
        } else {
            for (var i = indice, aux; i < longitud; i++) {
                aux = lista[i];
                lista[i] = persona;
                persona = aux;
            }

            lista[i] = persona;
        }

        return this.size();
    };

    //Devuelve el elemento dela lista de la posición indicada
    this.get = function (indice) {
        if (indice > this.size() || indice <= -1) {
            throw "El índice está fuera de los límites de la lista.";
        } else { //devolvemos la persona de la posición indicada
            return lista[indice].fullname();
        }
    };

    //Devuelve la lista en formato cadena
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

    //Devuelve la posición del elemento indicado. Si el elemento no está, devuelve -1
    this.indexOf = function (persona) {
        var posicion = -1;
        if (!(persona instanceof Person)) {
            throw new NotAPersonException();
        } else {
            posicion = lista.indexOf(persona); //recogemos la posición
        }
        return posicion;
    };

    //Devuelve la posición del elemento indicado comenzando por el final.
    //Si el elemento no está, devuelve -1
    this.lastIndexOf = function (persona) {
        var posicion = -1;
        if (!(persona instanceof Person)) {
            throw new NotAPersonException();
        } else {
            posicion = lista.lastIndexOf(persona); //recogemos la posición
        }
        return posicion;
    };

    //Devuelve el nº máx de elementos que podemos tener en la lista
    this.capacity = function () {
        return MAX_ELEMENTOS;
    };

    //Vacía la lista
    this.clear = function () {
        if (!this.isEmpty()) { //sino está vacía
            lista.splice(0, lista.length);
        }
    };

    //Devuelve el primer elemento de la lista
    this.firstElement = function () {
        var primero;
        if (!this.isEmpty()) {
            primero = lista[0].fullname();
        } else {
            throw "La lista está vacía.";
        }
        return primero;
    };

    //Devuelve el último elemento de la lista
    this.lastElement = function () {
        var ultimo;
        if (!this.isEmpty()) {
            ultimo = lista[this.size() - 1].fullname();
        } else {
            throw "La lista está vacía";
        }
        return ultimo;
    };

    //Elimina el elemento de la posición indicada. Devuelve el elemento eliminado
    this.remove = function (indice) {
        var persona;
        if (indice > this.size() || indice <= -1) {
            throw "El índice está fuera de los límites de la lista.";
        } else { //sino, devolvemos la persona de la posición indicada
            persona = lista.splice(indice, 1);
        }
        return persona[0].fullname(); //devolvemos la persona borrada
    };

    /*Elimina el elemento indicado de la lista. 
    * Devuelve true si se ha podido borrar el elemento,
    * false en caso contrario.*/
    this.removeElement = function (persona) {
        if (!this.isEmpty()) {
            var posicion = this.indexOf(persona);
            if (posicion == -1) {
                return false;
            }
            else {
                remove(posicion);
                return true;
            }
        }
    };

    /**Reemplaza el elemento de la lista indicado por el índice.
    * Devuelve el elemento que estaba anteriormente en la lista.
    */
    this.set = function (persona, indice) {
        var person;
        if (!(persona instanceof Person)) {
            throw new NotAPersonException();
        } else {
            if (indice > this.size() || indice <= -1) {
                throw "El índice está fuera de los límites de la lista";
            } else {
                person = this.get(indice);
                return lista.splice(indice, 1, persona); //devolvemos el elemento que había antes en la lista
            }
        }
        return person;
    };


}

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
    console.log("Devuelvo la posición del elemento indicado 'persona1': " + persona1.fullname() + ", empezando por el final: " + lista.lastIndexOf(persona1));
    console.log("Devuelvo el máximo número de elementos de la lista: " + lista.capacity());
    console.log("Devuelvo el primer elemento: " + lista.firstElement().toString());
    console.log("Devuelvo el último elemento: " + lista.lastElement().toString());
    console.log("Elimino el elemento de la posición indicada [2]: " + lista.remove(2));
    console.log("Devuelvo la lista en formato cadena: " + lista.toString());
    console.log("Reemplazo el elemento 'persona2': " + persona2.fullname() + ", indicado por el índice [0]: " + lista.set(persona2, 0));
    console.log("Devuelvo la lista en formato cadena: " + lista.toString());
    console.log("Vacío la lista: " + lista.clear());
    console.log(lista.toString());
}

window.onload = test;