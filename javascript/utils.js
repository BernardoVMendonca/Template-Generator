export function addMenuEventListener() {
  document.addEventListener("DOMContentLoaded", function () {

    let menu = document.getElementById("menu");
    let menuButton = document.getElementById("menu-button");

    menuButton.addEventListener("click", function () {
      menu.style.display = "flex";
    });

    // Ao clickar em qualquer outro lugar fora do popup ou clicar no X, o popup irá fechar
    window.addEventListener("click", function (event) {
      if (event.target === menu) {
        menu.style.display = "none";
      }
    });

    let naviCollectionCreator = document.getElementById("navigation-collection-creator");
    let naviTemplateCreator = document.getElementById("navigation-template-creator");
    let naviTemplateGenerator = document.getElementById("navigation-template-generator");

    naviCollectionCreator.addEventListener('click', () => {
      window.location.replace("collection_creator.html");
    })

    naviTemplateCreator.addEventListener('click', () => {
      window.location.replace("template_creator.html");
    })

    naviTemplateGenerator.addEventListener('click', () => {
      window.location.replace("template_generator.html");
    })

  });
}

export function addPopUpEventListener() {
  document.addEventListener("DOMContentLoaded", function () {
    let popup = document.getElementById("popup");
    let popupButton = document.getElementById("popupButton");
    let closeButton = document.querySelector(".close-button");

    popupButton.addEventListener("click", function () {
      popup.style.display = "flex";
    });

    // Ao clickar em qualquer outro lugar fora do popup ou clicar no X, o popup irá fechar
    window.addEventListener("click", function (event) {
      if (event.target === popup || event.target === closeButton) {
        popup.style.display = "none";
      }
    });
  });
}

export function copyText(text) {
  // console.log(text)
  navigator.clipboard.writeText(text).then(() => {
    alert('Texto copiado com sucesso!');
  }).catch(function (error) {
    alert('Erro ao copiar o texto: ' + error);
  });

}

export function cleanChilds(parentId) {
  const parent = document.getElementById(parentId);

  while (parent.firstChild)
    parent.removeChild(parent.firstChild)
}

export function displayTable(id, textList, func, arg) {

  arg = arg || ""

  const output = document.getElementById(id);
  const tableList = document.createElement('div');

  let tableHeader = textList.map(element => {
    return `<th>${element}</th>`
  }).join("") // .join() usado para não aparecer a virgula que separa os elementos em tableHeader


  console.log(tableHeader)

  tableList.innerHTML =
    `<table>
        <tr>
            ${tableHeader}
        </tr>
        ${func(arg)} 
    </table>`

  // console.log(tableList.innerHTML )
  output.appendChild(tableList);
}

export function downloadObject(obj, objName) {
  const jsonStr = JSON.stringify(obj);

  // Criar um Blob com o conteúdo JSON
  const blob = new Blob([jsonStr], { type: 'application/json' });

  // Criar um link de download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${objName}.json`;

  link.click();

  URL.revokeObjectURL(link.href);

}

export function hideElement(id, flag) {

  const element = document.getElementById(id);

  switch (flag) {
    case 0: // hide element
      element.style.display = "none";
      break;
    case 1: // unhide element
      element.style.display = "flex";
      break;
    default:
      element.style.display = "none";
      break;
  }
}