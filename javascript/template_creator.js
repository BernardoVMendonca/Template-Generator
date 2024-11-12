import { copyText, cleanChilds, displayTable, downloadObject, addMenuEventListener } from './utils.js';

// ================================================================================================
// ----------------------------------------GLOBAL VARIABLES----------------------------------------
// ************************************************************************************************

let template = { name: "", text: "", collection: {} };
let collection = {}

// ================================================================================================


// ================================================================================================
// -------------------------------------------FUNCTIONS--------------------------------------------
// ************************************************************************************************

function generateHeaderTable() {

    let result = "";
    let header;
    for (header in collection.fields) {
        result += `<tr>
           <td>${collection.fields[header]}</td>
           <td><button  class="copyButton" id="${collection.fields[header]}"')">Copiar Campo</button></td>
       </tr>`
    }

    // console.log(result);
    return result;
}

function readCollection(file) {

    template.name = ""
    template.text = ""
    template.collection = {}
    collection = {}
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            collection = JSON.parse(e.target.result);

            displayTable("collection-view", ["FIELD NAME", "COPIAR"], generateHeaderTable)

        } catch (err) {
            console.error("Erro ao abrir a coleção:", err);
            alert("Erro ao abrir a coleção.");
        }
    };
    reader.readAsText(file);

}
// ================================================================================================


// ================================================================================================
// ----------------------------------------EVENT LISTENERS-----------------------------------------
// ************************************************************************************************

// Será utilizado jQuery pois quero usar a GUI disponível na tag <input> para escolha de arquivos :)
$(document).ready(function () {
    $("#choose-collection-button").click(function () {
        $("#collection-selector").click(); // Botão escondido na parte de cima da página hehehehehe
    });

    $("#collection-selector").change(function (event) {
        const file = event.target.files[0];
        readCollection(file)
        addCopyButtonListener() // O botão de cópia só aparece depois do dados serem lidos
        cleanChilds("collection-view")
    });
});



document.addEventListener('DOMContentLoaded', () => {

    // ************************************************************************************************
    // SAVE TEMPLATE BUTTON EVENT LISTENER
    const button = document.getElementById('save-template-button');

    button.addEventListener('click', () => {
        let templateName = document.getElementById("template-name").value
        let templateText = document.getElementById("template-area").value

        if (templateName.length == 0) {
            alert("O nome do Template precisam estar preenchidas");
        }
        else {
            template.text = templateText
            template.name = templateName;
            template.collection = collection;

            downloadObject(template, template.name)
        }
    })
})

// ************************************************************************************************
// COPY BUTTON EVENT LISTENER

function addCopyButtonListener() {
    document.body.addEventListener('click', function (event) {
        if (event.target.classList.contains("copyButton")) {
            //    console.log(event.target.id)
            copyText("$<" + event.target.id + ">$")
        }
    });
}

addMenuEventListener()
// ================================================================================================
