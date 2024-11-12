import { cleanChilds, displayTable, downloadObject, addMenuEventListener } from './utils.js';

// ================================================================================================
// ----------------------------------------GLOBAL VARIABLES----------------------------------------
// ************************************************************************************************

let collection = { id: "", fields: [], data: [] }
let data

// ================================================================================================


// ================================================================================================
// -------------------------------------------FUNCTIONS--------------------------------------------
// ************************************************************************************************

function readFile(file) {

    // Reseta a coleção
    collection.fields = [];

    // Lê a coleção assim que a função readAsText for compilada
    const reader = new FileReader();
    reader.onload = function (event) {
        const csvData = event.target.result;
        Papa.parse(csvData, {
            header: true,
            complete: function (results) {
                const headers = results.meta.fields;
                displayTable("file-view", ['FIELD NAME', "ADD"], generateHeaderTable, headers)
                data = results.data
            }
        });
    };
    // console.log(collection);
    reader.readAsText(file);
}

function generateViewTable() {

    let collectionFields = [];
    let result = "";

    let field, header;
    for (field in collection.fields) {
        // console.log(collection.fields[field])
        collectionFields.push(collection.fields[field])
    }

    for (header in collectionFields) {
        // console.log(collectionFields[header])
        result += `<tr>
            <td>${collectionFields[header]}</td>
            <td><input type="checkbox" class="view-checkbox" value=${collectionFields[header]}></td>
            <td><button class="set-id-button" value=${collectionFields[header]}>Set as ID</button></td>

        </tr>`
    }

    return result;
}

function generateHeaderTable(headers) {

    let result = "";
    let header;

    for (header in headers) {
        result += `<tr>
            <td>${headers[header]}</td>
            <td><input type="checkbox" class="checkbox" value=${headers[header]}></td>
            </tr>`
    }
    return result;
}

// ================================================================================================


// ================================================================================================
// ----------------------------------------EVENT LISTENERS-----------------------------------------
// ************************************************************************************************

// Será utilizado jQuery pois quero usar a GUI disponível na tag <input> para escolha de arquivos :)
$(document).ready(function () {
    $("#choose-file-button").click(function () {
        $("#file_uploads").click(); // Botão escondido na parte de cima da página hehehehehe
    });

    $("#file_uploads").change(function (event) {
        const file = event.target.files[0];
        readFile(file)
        cleanChilds("file-view")
        cleanChilds("collection-view")
    });
});


document.addEventListener('DOMContentLoaded', () => {

    // ************************************************************************************************
    // ADD FIELD BUTTON EVENT LISTENER
    const addFieldButton = document.getElementById("add-field-button");

    addFieldButton.addEventListener('click', () => {
        let checkBoxes = document.getElementsByClassName("checkbox");

        let checkedFields = collection.fields.map(field => field);
        let check;
        for (check in checkBoxes) {
            console.log(checkBoxes[check])
            if (checkBoxes[check].checked && !checkedFields.includes(checkBoxes[check].value)) {
                collection.fields.push(checkBoxes[check].value)
            }
        }
        cleanChilds("collection-view")
        displayTable("collection-view", ["FIELD NAME", "REMOVE"], generateViewTable)

        addSetIdEventListener()

    })

    // ************************************************************************************************
    // ADD STATIC FIELD BUTTON EVENT LISTENER

    const addStaticFieldButton = document.getElementById("add-static-field-button");

    addStaticFieldButton.addEventListener('click', () => {
        let fieldName = document.getElementById("field-name").value

        let checkedFields = collection.fields.map(field => field);

        if (checkedFields.includes(fieldName)) {
            alert("Field Name already in the collection")
        } else if (fieldName.length != 0) {
            collection.fields.push(fieldName)
        }

        // console.log(fieldName.length)

        // console.log(collection.fields);
        cleanChilds("collection-view")
        displayTable("collection-view", ["FIELD NAME", "REMOVE"], generateViewTable)

    })

    // ************************************************************************************************
    // REMOVE FIELD BUTTON EVENT LISTENER
    const removeFieldButton = document.getElementById("remove-field-button");

    removeFieldButton.addEventListener('click', () => {
        let checkBoxes = document.getElementsByClassName("view-checkbox");

        let check;

        for (check in checkBoxes) {
            if (checkBoxes[check].checked) {
                // console.log(checkBoxes[check].value)
                collection.fields.splice(collection.fields.indexOf(checkBoxes[check].value), 1)
            }
        }
        cleanChilds("collection-view")
        displayTable("collection-view", ["FIELD NAME", "REMOVE"], generateViewTable)
    })

    // ************************************************************************************************
    // SAVE COLLECTION BUTTON EVENT LISTENER
    const saveCollectionButton = document.getElementById('save-collection-button');

    saveCollectionButton.addEventListener('click', () => {
        let collectionName = document.getElementById("collection-name").value

        if (collectionName.length == 0) {
            alert("A coleção precisa de um nome");
        } else {
            // Salva apenas os dados dos campos selecionados
            try {
                collection.data = data.map(line => {
                    let newLine = {};
                    collection.fields.forEach(field => {
                        if (line[field] !== undefined) {
                            newLine[field] = line[field];
                        }
                    });
                    return newLine;
                });
            } catch (e) {
                console.log(e)
            }


            downloadObject(collection, collectionName)
        }
    })
})


// ************************************************************************************************
// Set ID BUTTON EVENT LISTENER

function addSetIdEventListener() {
    const setIdButtons = document.getElementsByClassName("set-id-button");

    // console.log(setIdButtons)
    Array.from(setIdButtons).map(button => {
        button.addEventListener('click', () => {
            collection.id = button.value
            // console.log(collection.id)
        })

    })

}

addMenuEventListener()
// ================================================================================================
