var dataZone = document.getElementById('dataZone') //elemento html donde se mostrará los datos
var componentsTable = document.getElementById('componentsTable') // tabla que contendrá cada uno de los componentes
var files = document.getElementById('files') //boton para obtener el archivo
//variables que contendrán los componentes del autómta/archivo leído
var aStatuses = new Array()
var aAlphabet = new Array()
var aInitialStatus = ''
var aAcceptanceStatuses = new Array()

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

    //limpiar posibles datos anteriores
    dataZone.innerHTML=''
    aStatuses = new Array()
    aAlphabet = new Array()
    aInitialStatus = ''
    aAcceptanceStatuses = new Array()

    //creación del título con los componentes del autómata que contiene el archivo.txt
    dataZone.innerHTML += '<hr>'
    var automatonExpression  = document.createElement('h4')
    automatonExpression.id = 'automatonExpression'
    automatonExpression.textContent = 'COMPONENTES DEL AUTÓMATA'
    dataZone.appendChild(automatonExpression)

    //obteniendo datos de forma individual y seteándolos en el respectivo array/variable (caso: estado inicial)
    //estados
    currentItem = goFile(result,currentItem,false,'statuses')

    //alfabeto
    currentItem = goFile(result,currentItem+6,false,'alphabet')

    //estado inicial
    currentItem = goFile(result,currentItem+5,true,'initialStatus')

    //estados de aceptación
    goFile(result,currentItem+6,false,'acceptanceStatuses')

    //poner los componentes/datos en una tabla
    createElementsForComponentes()

}

function goFile(result,item, findInitialState, component){ //este metodo recorre el archivo.txt a partir del punto que se le es indicado, de modo que se 
                                                           //obteniene cada item de los componentes
    
    if(findInitialState){ //caso: cuando sí se está buscando el estado inicial
         aInitialStatus = result[item]
    }else{ 
        while(result[item] !='}'){
            if(result[item] != ','){
                switch(component){
                    case 'statuses': aStatuses.push(result[item]); break;
                    case 'alphabet': aAlphabet.push(result[item]); break;
                    case 'acceptanceStatuses': aAcceptanceStatuses.push(result[item]); break;
                }
            }
            item +=1
        }
    }

    return item

}  

function createElementsForComponentes(){
    //creación de la matriz con los componentes del autómata
    var tableData = [aStatuses,aAlphabet,aInitialStatus,aAcceptanceStatuses]
    //creación de la tabla, asignación de clases para los estilos bootstrap y creación del tbody
    var table = document.createElement('table')
    table.className = 'table table-striper table-hover'
    var tableBody = document.createElement('tbody')
  
    //se recorren los componente del autómata
    for(var fila=0; fila<tableData.length; fila++){
         var row = document.createElement('tr') //por cada componente se crea una fila
         var cellTittle = document.createElement('th') //td para el título del componente
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

function setStringTittle(component){ //con base en el numero de componente se elige el titulo adecuado para la fila
    var answer = ''
        switch(component){
             case 0: answer = 'ESTADOS'; break;
             case 1: answer = 'ALFABETO'; break;
             case 2: answer = 'ESTADO INICIAL'; break;
             case 3: answer = 'ESTADOS DE ACEPTACIÓN'; break;
        }
    return answer
}
