var dataZone = document.getElementById('dataZone') //elemento html donde se mostrará los datos
var componentsTable = document.getElementById('componentsTable') // tabla que contendrá cada uno de los componentes
var files = document.getElementById('files') //boton para obtener el archivo
//variables/estructuras de datos que contendrán los componentes del autómta/archivo leído
var aStatuses = new Array()
var aAlphabet = new Array()
var aInitialStatus = ''
var aAcceptanceStatuses = new Array()
var aTransitions = new Array();

files.addEventListener('change',process)//cuando se "cambie" de archivo seleccionado, se ejecutará el método process

function process(e){
    // "e" es el input de tipo file
    // "files" es una propiedad que tiene un array que contiene los elementos seleccionados por el botón
    // "target" es el método que hace eso posible
    var files = e.target.files
    var myFile = files[0] //se selecciona el primer archivo de dicho array
    var reader = new FileReader() 
    reader.readAsText(myFile)
    reader.addEventListener('load', showdAta) //una vez cargado un archivo, se ejecutará el metodo showdAta para mostrar la data

}

function showdAta(e){

    var result = e.target.result //result es la variable que contiene todas las letras del texto que contiene el archivo.txt
    var currentItem = 3 //currentItem es la variable auxiliar que me permitirá leer letra por letra el archivo
    // ¿Por qué es igual a 3? Porque en un archivo
    // - El primer item corresponde una letra X que representa los estados
    // - El segundo item corresponde al signo "igual"
    // - El tercer item corresponde al signo de apertura de llave
    // Sin embargo, como result es un array significa que la posición cero es la que tiene un primer estado.

    //limpiar posibles datos anteriores
    dataZone.innerHTML=''
    aStatuses = new Array()
    aAlphabet = new Array()
    aInitialStatus = ''
    aAcceptanceStatuses = new Array()
    aTransitions = new Array();

    //creación del título con los componentes del autómata que contiene el archivo.txt
    dataZone.innerHTML += '<hr>' //se crea un separador abajo del botón que leyó el archivo.
    var automatonExpression  = document.createElement('h4')//creación de un h4 para el título
    automatonExpression.id = 'automatonExpression'
    automatonExpression.textContent = 'COMPONENTES DEL AUTÓMATA'
    dataZone.appendChild(automatonExpression)// a la zona de datos se le añade ese "hijo" (el H4)

    //obteniendo datos de forma individual y seteándolos en el respectivo array/variable (caso: estado inicial)
    //estados
    currentItem = goFile(result,currentItem,false,'statuses') 
    //result son los datos en sí, currentItem es la posicion en la que se empezará a leer los datos dentro de la variable result
    //false indica que NO SE ESTÁ BUSCANDO el estado inicial
    //el string "statuses" dentro del método "goFile" lo que hace es setear el dato encontrado en la respectiva variable
    //este método retorna la cantidad de posiciones que se recorrió, por lo que al ejecutarse currentItem se actualiza.

    //alfabeto
    currentItem = goFile(result,currentItem+6,false,'alphabet') //sucede lo mismo que en el caso anterior
    // a diferencia que acá se setearán los items encontrados en la estructura aAlphabet/alfabeto del autómata

    //estado inicial
    currentItem = goFile(result,currentItem+5,true,'initialStatus') //este es el caso especial, pues se manda un true
    //por ende no se ejecuta el "else" de la función "goFile" sino el "if", por ende solo se setea el item actual
    // a la variable que contendrá el estado inicial.

    //estados de aceptación
    currentItem = goFile(result,currentItem+6,false,'acceptanceStatuses')// en este caso vuelve a ser similar como lo es el caso del alfabeto o los estados
    //le pasamos false, le indicamos en donde queremos guardar los datos y listo

    //poner los componentes/datos en una tabla
    createElementsForComponentes()//este metodo crea filas y columnas html con los datos que ya se tiene en los arryas.
    dataZone.innerHTML += '<hr><br>' //se crea otra "sección" para posteriormente escribir las transiciones.
    //console.log("LECTURA DE TRANSICIONES")
         readTransitions(result,currentItem+6)
        // 6 porque:
        // 1 pertenece al caracter } de finalizacion de estados de aceptacion
        // 2 corresponde al salto de linea
        // 1 corresponde al caracter inicio de transiciones $
        // 2 corresponde al salto de linea de dicho caracter 
             createElementsForTransitions() //una vez se tiene las transiciones, se ponen en una tabla
}

function readTransitions(result, item){
     var endTransac = '$'
        //mientras el item actual no sea el que indica finalizacion de transiciones, leer las transiciones.
        var correctTransitions = validateTransitions(result, item)
            if(correctTransitions){
                while(result[item] != endTransac){
                    var nTransition = new Array()
                    //la posicion uno de una transicion es el estado de partida de dicha transicion
                    nTransition[0] = result[item]  //item corresopnde al estado de partida
                    //la posicion dos de una transicion corresponde  al simbolo que hace el cambio en dicha transicion
                    nTransition[1] = result[item+2] //se agrega dos espacios porque 1 corresponde al punto y coma separador y el otro al simbolo del alfabeto que hace la transicion
                    //la posicion 2 de una transicion cooresponde al estado de destino de dicha transicion
                    nTransition[2] = result[item+4] //se agrega cuatro porque sigue siendo el mismo valor y se hace el mismo procedimiento anterior a diferencia de que ahora se lee el estado de destino
                    aTransitions.push(nTransition) //se setea una nueva transicion por cada iteracion al array de transiciones
                           item += 7 //finalmente se aumenta la variable item, cada transiciones esta compuesta de 7 caracteres
                                     //1 corresponde al estado de partida, 1 al simbolo, 1 al estado de destino, 2 al salto de linea y 2 por los puntos y coma
                }
           }else{
               alert("LOS DATOS DE LA TABLA DE TRANSICIONES NO FUERON CARGADOS PORQUE EL ARCHIVO NO CUMPLE CON LAS ESPECIFICACIONES NECESARIAS")
           } 
        //la funcion no retorna nada, simplemente se continua con el resto del codigo que está después de donde fue invocada
}

function validateTransitions(result, item){
    // se valida las N tansiciones que debería haber en el archivo
    var nTransitions = aStatuses.length * aAlphabet.length
    var nCharacters = nTransitions * 7
        if(result[item+nCharacters]=="$"){
            return true
        }
    return false
}

function goFile(result,item, findInitialState, component){ //este metodo recorre el archivo.txt a partir del punto que se le es indicado, de modo que se obtiene todos los items del componente del automata
    if(findInitialState){ //caso: cuando sí se está buscando el estado inicial
         aInitialStatus = result[item] //se toma la variable que contendrá el estado inicial y se le asigna el caracter del archivo en el item actual
    }else{ 
        while(result[item] !='}'){ //mientras no se encuentre el signo de cierre (lo cual significa que el listado de items del componente ya ha finalizado)
            if(result[item] != ','){//se comprueba si el item es diferente de una coma, si es así, se evalúa el compoente
                switch(component){ //dependiendo del componente que se indica en el uso de la función, se setea el elemento el el array correspondiente.
                    case 'statuses': aStatuses.push(result[item]); break;
                    case 'alphabet': aAlphabet.push(result[item]); break;
                    case 'acceptanceStatuses': aAcceptanceStatuses.push(result[item]); break;
                }
            }           
            item +=1 //se avanza una posición (el cual al ingresarse un item apuntará a una coma, no se ejecutaría el if, se ejecutaría otra vez esto y en la segunda vuelta sí ejecutaría el if)
        }
    }
    return item //después de haber leído todos los items de un componente, se retorna la cantidad de posiciones que se recorrió.
}  

function setStringTittle(component){ //con base en el numero de componente se elige el titulo adecuado para la fila
    var answer = ''
        switch(component){
             case 0: answer = 'ESTADOS'; break; //si al leer la matriz se está leyendo el elemento o fila uno, significa que se trata de los estados, entonces se devuelve ese string.
             case 1: answer = 'ALFABETO'; break;
             case 2: answer = 'ESTADO INICIAL'; break;
             case 3: answer = 'ESTADOS DE ACEPTACIÓN'; break;
        }
    return answer
}

function createElementsForComponentes(){
    //creación de la matriz con los componentes del autómata
    //a este punto ya se cuenta con datos en las variables de la @matriz tableData
    var tableData = [aStatuses,aAlphabet,aInitialStatus,aAcceptanceStatuses]
    //creación de la tabla, asignación de clases para los estilos bootstrap y creación del tbody
    var table = document.createElement('table')
    table.className = 'table table-striper table-hover'
    var tableBody = document.createElement('tbody')
  
    //se recorren los componente del autómata
    for(var fila=0; fila<tableData.length; fila++){
         var row = document.createElement('tr') //por cada componente se crea una fila
         var cellTittle = document.createElement('th') //th para el título del componente
         cellTittle.className = 'tittleComponent'
         cellTittle.scope = 'row'
         cellTittle.appendChild(document.createTextNode(setStringTittle(fila))) //se determina el título con base al número de fila -> se setea como texto al th
         row.appendChild(cellTittle) //asignacion del td a la fila actual

            //se recorren los  items de cada componente
            for (var cellData = 0; cellData < tableData[fila].length; cellData++) {
                var cell = document.createElement('td') //por cada columna/item se crea una columna
                cell.appendChild(document.createTextNode(tableData[fila][cellData])) //se setea la respectiva letra/valor a dicha columna
                row.appendChild(cell) //se setea la columna/celda creada a la fila actual (correspondiente al componente del autómata actual)
            }

        tableBody.appendChild(row) //se setea la fila actual al cuerpo de la tabla
    }

     table.appendChild(tableBody) //finalmente se setea el cuerpo de la tabla, a la tabla como tal
     dataZone.appendChild(table) //una vez se tiene la tabla, se setea en el "dataZone"
         
}

function createElementsForTransitions(){
    //console.log(aTransitions)
    //console.log(aTransitions.length)
    //creacion del titulo para identificar la tabla de transiciones
    var tittleSectionTransitions = document.createElement('h4')
    tittleSectionTransitions.textContent = 'TRANSICIONES DEL AUTÓMATA'
    dataZone.append(tittleSectionTransitions) 

    //creación de la tabla que contendrá las transiciones, asignación de clases para los estilos bootstrap y creación del tbody
    var tableTransitions = document.createElement('table')
    tableTransitions.className = 'table table-striper table-hover'
    var tableBody = document.createElement('tbody')
    //creacion de la primera fila que lista cada uno de los simbolos del alfabeto
    //la primera columna de esta fila no contiene ni simbolos del alfabeto ni estados, pero hay que crearla.
    var rowAlphabet = document.createElement('tr')
    var FirstColumnTittle = document.createElement('th')
    FirstColumnTittle.className = 'tittleComponent'
    FirstColumnTittle.scope = 'row'
    FirstColumnTittle.appendChild(document.createTextNode('E \\ A'))
    rowAlphabet.appendChild(FirstColumnTittle)
    //se recorre cada simbolo del alfabeto y se setea en la misma columna
    for(var nSymbol = 0; nSymbol < aAlphabet.length; nSymbol++){
        var column = document.createElement('th') //por cada columna/item se crea una columna
        column.scope = 'row'
        column.appendChild(document.createTextNode(aAlphabet[nSymbol])) //se setea el respectivo simbolo a dicha columna
        //se setea la columna/celda creada a la fila actual (correspondiente al componente del autómata actual)
        rowAlphabet.appendChild(column) // se setea la columna creada que contiene n simbolo del alfabeto a la fila actual, la cual es la que lista todos los simbolos del alfabeto
    }
    //una vez hecho esto se setea dicha fila al tableBody
    tableBody.appendChild(rowAlphabet)

    //Ahora por cada estado, se hace lectura de sus transicioens
    //se calcula las N transiciones con base en los estados y los simbolos del alfabeto
    var nATransitions = aStatuses.length * aAlphabet.length;
    //ahora con base en el resultado anterior, se calcula las N transiciones correspondientes a cada estado
    var transitionsPerStatus = nATransitions/aStatuses.length;
    //console.log(transitionsPerStatus)
    var currentTransition = 0 //esta variable sirve para validar cual es la transicion actual que se esta leyendo
        //una vez se tiene este dato, se puede recorrer el array que contiene cada estado para la creacion de la respectiva nueva fila
        for(var nStatus =0; nStatus < aStatuses.length; nStatus++){
             var rowTransitionsFromStatusX = document.createElement('tr') // por cada N transiciones de un estado se crea una fila
             var rowTittle = document.createElement('th') // el titulo de la fila actual
             rowTittle.className = 'tittleComponent'
             rowTittle.scope = 'row'
             rowTittle.append(document.createTextNode(aStatuses[nStatus]))//el header de la fila actual será el X estado que se está leyendo
             rowTransitionsFromStatusX.appendChild(rowTittle) //a la fila actual se asigna dicho titulo
                 //Ahora se tiene un estado "X"
                 //para dicho estado se crea N colummnas para setear sus N transiciones
                 for(var nTransition = 0; nTransition < transitionsPerStatus; nTransition++){
                     var columnNTransitionFromXStatus = document.createElement('td')//por cada transicion de X estado se crea una columna
                     //se valida si el estado actual corresponde al estado de partida de la transicion actual para setear el estado de destino
                     if(aTransitions[currentTransition][0] == aStatuses[nStatus]){
                         columnNTransitionFromXStatus.appendChild(document.createTextNode(aTransitions[currentTransition][2]))
                     }
                     rowTransitionsFromStatusX.appendChild(columnNTransitionFromXStatus) //se setea dicha columna a la fila actual
                     currentTransition+=1 //el valor que tiene currentTransition aumenta lo que ya tiene más uno.
                 }
                 //console.log(aTransitions)
                 tableBody.appendChild(rowTransitionsFromStatusX)//se setea la fila con el estado y sus transiciones
        }

     // *** despues de eso se seta el tablebody a la tabla como tal
     tableTransitions.appendChild(tableBody)
     // *** finalmente la nueva tabla se agrega al div @dataZone para ser visualizado por el usuario
     dataZone.appendChild(tableTransitions)

}
