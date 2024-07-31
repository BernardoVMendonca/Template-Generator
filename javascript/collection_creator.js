// Variável que guardará as informações que vão ser geradas. Ela irá se transformar em um JSON.
let  collection = {fields: [], name: "", originFiles: []}

function readFile(file) {
    
    // Reseta a coleção
    collection.fields = [];
    collection.name = "";
    collection.originFiles = [];

    collection.originFiles.push(file.name)

    // Lê a coleção assim que a função readAsText for compilada
    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        Papa.parse(csvData, {
            header: true,
            preview: 1,
            complete: function(results) {
                const headers = results.meta.fields;
                // console.log("Headers: ", headers);
                displayHeaders(headers);
            }
        });
    };
    // console.log(collection);
    reader.readAsText(file);
}

function generateViewTable() {

    let collectionFields = [];
    let result = "";

    for (field in collection.fields){
        // console.log(collection.fields[field])
        collectionFields.push(collection.fields[field][0])
    }

    for (header in collectionFields){
        console.log(collectionFields[header])
        result += `<tr>
            <td>${collectionFields[header]}</td>
            <td><input type="checkbox" class="view-checkbox" value=${collectionFields[header]}></td>
        </tr>`
    }

    return result;
}

function generateHeaderTable(data) {
    
    // console.log(data)

    let result = "";
    for (header in data){
        result += `<tr>
            <td>${data[header]}</td>
            <td><input type="checkbox" class="checkbox" value=${data[header]}></td>
        </tr>`
    }

    return result;
}

function saveCollection(){
    // Armazena no LocalStorage
    localStorage.setItem(`${collection.name}`, JSON.stringify(collection));

    // Obtém do LocalStorage
    var objSalvo = localStorage.getItem(`${collection.name}`);

    console.log('objSalvo: ', JSON.parse(objSalvo));
}

function displayView() {
    const output = document.getElementById("collection-view");
    const tableList = document.createElement('div');
    
    // tableList.id = 'view-table';
    
    tableList.innerHTML  = 
    `<table> 
        <tr>
            <th>Field Name</th>
            <th>Remove</th>
        </tr>
        ${generateViewTable()} 
    </table>`
    
    // console.log(tableList.innerHTML )
    try{
        output.removeChild(output.firstChild)
    }catch(e) {
        // console.log(e)
    }
    output.appendChild(tableList);
}

function displayHeaders(data) {
    // console.log(data);
    const output = document.getElementById("file-view");
    const tableList = document.createElement('div');
    tableList.innerHTML  = 
    `<table> 
        <tr>
            <th>Field Name</th>
            <th>Add</th>
        </tr>
        ${generateHeaderTable(data)} 
    </table>`
    
    // console.log(tableList.innerHTML )
    output.appendChild(tableList);
}

// Será utilizado jQuery pois quero usar a GUI disponível na tag <input> para escolha de arquivos :)
$(document).ready(function() {
   $("#choose-file-button").click(function() {
       $("#file_uploads").click(); // Botão escondido na parte de cima da página hehehehehe
   });

   $("#file_uploads").change(function(event) {
      const file = event.target.files[0];
      readFile(file)
  });
});


// Escuta os cliques do botão que irá adiconar os campos selecionados à variável collection
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById("add-field-button");

    button.addEventListener('click', () => {
        let checkBoxes = document.getElementsByClassName("checkbox");

        let checkedFields = [];

        for (field in collection.fields){
            // console.log(collection.fields[field])
            checkedFields.push(collection.fields[field][0])
        }

        for(check in checkBoxes){
            if(checkBoxes[check].checked == true && checkedFields.includes(checkBoxes[check].value) == false){
                // console.log(checkBoxes[check].value)
                collection.fields.push([checkBoxes[check].value, ""])
            }
        }
        // console.log(collection)

        displayView()
    })
})

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById("add-static-field-button");

    button.addEventListener('click', () => {
        let fieldName = document.getElementById("field-name").value
        let defaultValue = document.getElementById("default-value").value

        let checkedFields = [];

        for (field in collection.fields){
            // console.log(collection.fields[field])
            checkedFields.push(collection.fields[field][0])
        }

        if (checkedFields.includes(fieldName)){
            alert("Field Name already in the collection")
        }else if(fieldName.length != 0){
            collection.fields.push([fieldName, defaultValue])
        }

        // console.log(fieldName.length)

        // console.log(collection.fields);

        displayView()
    })
})

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById("remove-field-button");

    button.addEventListener('click', () => {
        let checkBoxes = document.getElementsByClassName("view-checkbox");

        for(check in checkBoxes){
            if(checkBoxes[check].checked == true ){
                // console.log(checkBoxes[check].value)
                collection.fields.splice([checkBoxes[check].value, ""], 1)
            }
        }
        // console.log(collection)

        displayView()
    })
})

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('save-collection-button');

    button.addEventListener('click', () => {
        let collectionName = document.getElementById("collection-name").value

        if (collectionName.length == 0){
            alert("A coleção precisa de um nome");
        }else{
            collection.name = collectionName;

            saveCollection();

            const jsonStr = JSON.stringify(collection);

            // Criar um Blob com o conteúdo JSON
            const blob = new Blob([jsonStr], { type: 'application/json' });

            // Criar um link de download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${collection.name}.json`;

            
            document.body.appendChild(link);
            link.click();

            // Remover o link do documento
            document.body.removeChild(link);
        }
    })
})

