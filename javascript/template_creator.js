let template = {name: "", language: "", text: "", collection: ""};
let  collection = {}


function saveTemplate(){
   // Armazena no LocalStorage
   localStorage.setItem(`${template.name}`, JSON.stringify(template));

   // Obtém do LocalStorage
   var objSalvo = localStorage.getItem(`${template.name}`);

   console.log('objSalvo: ', JSON.parse(objSalvo));
}

function copyField(tag){
   navigator.clipboard.writeText("$<" + tag.id + ">$").then(() => {
      alert('Texto copiado com sucesso!');
  }).catch(function(error) {
      alert('Erro ao copiar o texto: ' + error);
  });

}

function generateHeaderTable() {
    
   console.log(collection)
   let result = "";
   for (header in collection.fields){
       result += `<tr>
           <td>${collection.fields[header][0]}</td>
           <td><button  class="copyButton" id="${collection.fields[header][0]}" onclick="copyField(${collection.fields[header][0]})">Copiar Campo</button></td>
       </tr>`
   }

   // console.log(result);
   return result;
}

function displayCollection() {
   const output = document.getElementById("collection-view");
   const tableList = document.createElement('div');
   tableList.innerHTML  = 
   `<table> 
       <tr>
           <th>Field Name</th>
           <th></th>
       </tr>
       ${generateHeaderTable()} 
   </table>`
   
   // console.log(tableList.innerHTML )
   output.appendChild(tableList);
}

function readCollection(file){
   const reader = new FileReader();
   reader.onload = function(e) {
      try {
         collection = JSON.parse(e.target.result);

         template.collection = collection.name

         displayCollection()

         // console.log(collection)
      } catch (err) {
         console.error("Erro ao abrir a coleção:", err);
         alert("Erro ao abrir a coleção.");
      }
   };
   reader.readAsText(file);

}

// Será utilizado jQuery pois quero usar a GUI disponível na tag <input> para escolha de arquivos :)
$(document).ready(function() {
   $("#choose-collection-button").click(function() {
       $("#collection-selector").click(); // Botão escondido na parte de cima da página hehehehehe
   });

   $("#collection-selector").change(function(event) {
      const file = event.target.files[0];
      readCollection(file)
  });
});

document.addEventListener('DOMContentLoaded', () => {
   const button = document.getElementById('save-template-button');

   button.addEventListener('click', () => {
       let templateName = document.getElementById("template-name").value
       let templateLanguage = document.getElementById("template-language").value
       let templateText = document.getElementById("template-area").value

       if (templateName.length == 0 || templateLanguage.length == 0){
           alert("O nome e a língua do Template precisam estar preenchidas");
       }
       else {
           template.name = templateName;
           template.language = templateLanguage;
           template.text = templateText

           saveTemplate();

           const jsonStr = JSON.stringify(template);

           // Criar um Blob com o conteúdo JSON
           const blob = new Blob([jsonStr], { type: 'application/json' });

           // Criar um link de download
           const link = document.createElement('a');
           link.href = URL.createObjectURL(blob);
           link.download = `${template.name}.json`;

           
           document.body.appendChild(link);
           link.click();

           // Remover o link do documento
           document.body.removeChild(link);
       }
   })
})
