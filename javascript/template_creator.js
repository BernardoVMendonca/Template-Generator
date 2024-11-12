import { copyText, cleanChilds, displayTable, downloadObject, hideElement, addMenuEventListener } from './utils.js';

// ================================================================================================
// ----------------------------------------GLOBAL VARIABLES----------------------------------------
// ************************************************************************************************

let template = { name: "", templates: [], collection: {} };
let collection = {}
let cont = 0;

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
    template.templates = []
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
        cleanChilds("template-area")
    });
});



document.addEventListener('DOMContentLoaded', () => {


    // ************************************************************************************************
    // ADD NEW TEMPLATE BUTTON EVENT LISTENER

    const addTemplateButton = document.getElementById("addTemplateButton");

    addTemplateButton.addEventListener('click', () => {

        const templateArea = document.getElementById("template-area");

        const HTMLElement = document.createElement('span');

        HTMLElement.id = `template_${cont}`;

        HTMLElement.setAttribute('id', `template_${cont}`);
        HTMLElement.innerHTML = `
        <div class="flex-container">
            <span id="expand-toggle_${cont}" class="expand-toggle">V</span>
            <input class="static-field" id="template-name_${cont}" placeholder="Template Colleciton Name">
            <span id="remove-button_${cont}" class="remove-template">X</span>
        </div>
        <textarea id="template-textarea_${cont}" class="template-textarea" placeholder="WRITE YOUR TEMPLATE HERE"></textarea>
        `
        templateArea.appendChild(HTMLElement)

        const expandToggle = document.getElementById(`expand-toggle_${cont}`)

        expandToggle.addEventListener('click', () => {
            if (expandToggle.innerText == "V") {
                hideElement(`template-textarea_${expandToggle.id.replace("expand-toggle_", "")}`, 0)
                expandToggle.innerHTML = ">"
            } else {
                hideElement(`template-textarea_${expandToggle.id.replace("expand-toggle_", "")}`, 1)
                expandToggle.innerHTML = "V"
            }

        })


        const removeButton = document.getElementById(`remove-button_${cont}`);

        removeButton.addEventListener('click', () => {
            document.getElementById(`template_${removeButton.id.replace("remove-button_", "")}`).remove()
        })
        cont++
    })

    // ************************************************************************************************
    // SAVE TEMPLATE COLLECTION BUTTON EVENT LISTENER
    const button = document.getElementById('save-template-button');

    button.addEventListener('click', () => {
        let templateName = document.getElementById("template-name").value

        if (templateName.length == 0) {
            alert("O nome do Template precisam estar preenchidas");
        }
        else {

            for (let i = 0; i <= cont; i++) {
                let newTemplate = {}

                try {
                    newTemplate.name = document.getElementById(`template-name_${i}`).value
                    newTemplate.text = document.getElementById(`template-textarea_${i}`).value

                    template.templates.push(newTemplate)
                } catch (e) {
                    console.log(e)
                }


            }

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
