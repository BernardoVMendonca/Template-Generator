import { copyText, addPopUpEventListener, cleanChilds, displayTable, addMenuEventListener, downloadObject } from './utils.js';


// ================================================================================================
// ----------------------------------------GLOBAL VARIABLES----------------------------------------
// ************************************************************************************************

let template = { name: "", text: "", collection: {} };
let data;

// ================================================================================================



// ================================================================================================
// -------------------------------------------FUNCTIONS--------------------------------------------
// ************************************************************************************************

function textConstructor(fieldName, fieldValue) {

   const fieldNameEnabler = document.getElementById("field-name-enabler")
   const fieldValueEnabler = document.getElementById("field-value-enabler")
   const emptyFieldEnabler = document.getElementById("empty-field-enabler")

   let newText = ""

   if ((emptyFieldEnabler.checked && fieldValue != "") || !emptyFieldEnabler.checked) {
      if (!fieldNameEnabler.checked)
         newText = newText + fieldName + ": "

      if (!fieldValueEnabler.checked)
         newText = newText + fieldValue
   }
   return newText
}

function searchData(field, value) {
   // console.log(field, value)

   data = template.collection.data.map(data => {
      // console.log(data[field])
      if (data[field] == value)
         return data
   }).filter(data => data !== undefined)



   let inputList = document.getElementsByClassName("search-value-input")

   // console.log(inputList, typeof(inputList))
   try {
      Object.keys(data[0]).forEach(element => {
         Array.from(inputList).map(elementHTML => {
            // console.log(elementHTML.id, "input_"+ element, data[element])
            if (elementHTML.id == ("input_" + element))
               document.getElementById(elementHTML.id).value = data[0][element]
            // console.log(elementHTML)
            return elementHTML
         }).filter(elementHTML => elementHTML !== undefined)
      });
   } catch (e) {
      console.log(e)
   }
}

function generateHeaderTable() {

   // console.log(template.collection)
   let result = "";
   let header;
   for (header in template.collection.fields) {

      result += `<tr>
           <td>${template.collection.fields[header]}</td>
           <td><input class="search-value-input" id="input_${template.collection.fields[header]}" placeholder="Value to search" value=""></td>
           <td><button  class="searchButton" id="${template.collection.fields[header]}">Q</button></td>
       </tr>`
   }
   // console.log(result);
   return result;
}

function readTemplate(file) {

   template.name = ""
   template.text = ""
   template.collection = {}

   const reader = new FileReader();
   reader.onload = function (e) {
      try {
         template = JSON.parse(e.target.result);

         displayTable("template-view", ["Field Name", "VALUE", "SEARCH"], generateHeaderTable)

      } catch (err) {
         console.error("Erro ao abrir o template:", err);
         alert("Erro ao abrir a template.");
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
   $("#choose-template-button").click(function () {
      $("#template-selector").click(); // Botão escondido na parte de cima da página hehehehehe
   });

   $("#template-selector").change(function (event) {
      const file = event.target.files[0];
      readTemplate(file)
      addSearchButtonListener() // o botão de procura só aparece depois dos dadados serem lidos
      cleanChilds("template-view")
   });
});

document.addEventListener('DOMContentLoaded', () => {

   // ************************************************************************************************
   // DOWNLOAD UPDATED COLLECTION BUTTON EVENT LISTENER
   const downloadButton = document.getElementById("download-udpated-collection-button");

   downloadButton.addEventListener('click', () => {
      downloadObject(template, template.name);

   })



   // ************************************************************************************************
   // SAVE NEW DATA BUTTON EVENT LISTENER

   const saveDataButton = document.getElementById("save-data-button");

   saveDataButton.addEventListener('click', () => {

      try {

         const newId = document.getElementById(`input_${template.collection.id}`).value

         const loadedData = template.collection.data.map(object => {

            return object[template.collection.id]

         }).filter(element => element !== undefined)


         // console.log(loadedData)

         if (loadedData.indexOf(newId) != -1) {
            alert("Id já está presente na sua coleção de dados.\nTente com outro ID")
         } else {
            const auxObj = {}
            template.collection.fields.forEach(field => {
               auxObj[field] = document.getElementById(`input_${field}`).value
            })

            // console.log(auxObj)
            template.collection.data.push(auxObj)
         }

      } catch (e) {
         alert("ID não encontrado ou não existente.\nVerifique a sua coleção")
      }



   })


   // ************************************************************************************************
   // GENERATE BUTTON EVENT LISTENER

   const generateButton = document.getElementById("generate-button");

   generateButton.addEventListener('click', () => {

      let templateTextArea = document.getElementById("template-textarea")

      templateTextArea.value = " "
      try {
         if (template.text !== undefined) {
            let aux = template.text
            template.collection.fields.forEach(element => {
               aux = aux.replace(new RegExp("\\$<" + element + ">\\$", "g"), textConstructor(element, document.getElementById("input_" + element).value))
            })
            templateTextArea.value = aux
         }
      } catch (e) {
         console.log(e)
      }
   })

   // ************************************************************************************************
   // COPY BUTTON EVENT LISTENER
   const copyButton = document.getElementById("copy-button");

   copyButton.addEventListener('click', () => {
      copyText(document.getElementById("template-textarea").value)
   })
})

// ************************************************************************************************
// SEARCH BUTTON EVENT LISTENER
function addSearchButtonListener() {
   document.body.addEventListener('click', function (event) {
      if (event.target.classList.contains("searchButton"))
         searchData(event.target.id, document.getElementById("input_" + event.target.id).value)
   });
}

// ************************************************************************************************
// POP UP EVENT LISTENER
addPopUpEventListener()
addMenuEventListener()
// ================================================================================================