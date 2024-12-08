const html_tbody = document.getElementById('tbody');
const formulaire = document.getElementById("preferences");
const sectionListe = document.getElementById("sectionListe");
const sectionCarte = document.getElementById("sectionCarte");
const titre = document.getElementById('titreApprenant');
const lien = document.getElementsByClassName('link');
const classeTheme = document.body;
const affichageStocke = localStorage.getItem('affichage');
const themeStocke = localStorage.getItem('theme');

// Lecture du fichier JSON en passant par GitHub Pages
fetch('https://mb-d2wm-eni.github.io/ProjetWeb1/scripts/promo.json')
.then(response => response.json())
.then(data => afficherData(data));

// Fonction pour afficher les données
function afficherData(data){

  // Pour éviter que les 2 modes se chevauchent avant initialisation du localStorage, liste est par défaut.
  if (document.getElementById("liste").hasAttribute('checked')) {
    listeClicked()
  } else if (document.getElementById("carte").hasAttribute('checked')){
    carteClicked()
  };
  
  // Variable pour raccourcir l'accès aux données
  const apprenants = data.apprenants

  // Boucle for pour créer autant de lignes que d'apprenants
  for(let i = 0; i < apprenants.length; i++){
  
    const html_tr = document.createElement("tr");
  
    // template HTML reproduit dans une constante
    const template = `<td>${apprenants[i].nom}</td>
                      <td>${apprenants[i].prenom}</td>
                      <td>${apprenants[i].ville}</td>
                      <td><a href="#" id="${apprenants[i].id}" class="link" >En savoir plus...</a></td>`
  
    // Creation du tableau HTML en appelant le template
    html_tr.innerHTML = template;
    html_tbody.appendChild(html_tr);
  }

  // Fonction pour créer les cartes
  for(let i = 0; i < apprenants.length; i++){
  
    const html_div = document.createElement("div");
    html_div.classList.add("card");
    // template HTML reproduit dans une constante
    const template2 = `<div class="card-body">
                         <img src="images/${apprenants[i].avatar}" class="card-img-top"alt="Avatar des apprenants">
                        <h5 class="card-title">${apprenants[i].nom}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">${apprenants[i].prenom}</h6>
                        <a href="#" id="${apprenants[i].id}" class=" link linkCard btn-primary">Détail...</a>
                      </div>`

    // Creation du tableau HTML en appelant le template2
    html_div.innerHTML = template2;      
    sectionCarte.appendChild(html_div);
  }

  // ================ CONCERNE LA MODALE ==================================

  const links = document.querySelectorAll(".link");
  const modal = document.getElementById("modal");
  const modalTemplate = document.getElementById("modal-template");
  
  // Fonction pour fermer la modale
  const closeModal = () => (modal.style.display = "none");
  
  links.forEach((lien) => {
    lien.addEventListener("click", (event) => {
      event.preventDefault(); // Empêche le comportement par défaut
      const id = parseInt(lien.id); // Récupère l'id du lien
  
      const apprenant = apprenants.find((a) => a.id === id); // Trouve les données correspondantes
  
      if (apprenant) {
        // Crée dynamiquement le contenu de la modale
        modalTemplate.innerHTML = `
          <span class="close-button">x</span>
          <img src="images/${apprenant.avatar}" alt="${apprenant.prenom}" style="width:150px; height:150px;">
          <div>
            <p><strong>Nom : </strong>${apprenant.nom}</p>
            <p><strong>Prénom :</strong> ${apprenant.prenom}</p>
            <p><strong>Ville :</strong> ${apprenant.ville}</p>
          </div>
          <div>
          <p><strong>Anecdote sur l'apprenant :</strong></p>
          <p>${apprenant.anecdotes}</p>
          </div>
        `;
        modal.style.display = "flex"; // Affiche la modale
  
        // Ajoute l'événement pour fermer la modale
        document.querySelector(".close-button").addEventListener("click", closeModal);
      }
    });
  });
  
  // Ferme la modale si on clique à l'extérieur
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
  
  // gestion de l'affichage liste/carte

  function gestionAffichage(){

    if (affichageStocke === "liste") {
      listeClicked();
      liste.setAttribute("checked", "checked");
      carte.removeAttribute("checked");
    } else if (affichageStocke === "carte") {
      carteClicked();
      carte.setAttribute("checked", "checked");
      liste.removeAttribute("checked");
    };
  };
  gestionAffichage();
  
  // Fonction pour changer les couleurs du tableau et des cartes en fonction du thème
  function paramColor(){
    const lienCard = document.getElementsByClassName('linkCard');
    const tab = document.querySelector('table');
    const entetes = document.querySelectorAll('th');
    const lignesPair = document.querySelectorAll('tr:nth-child(even)');    
    const ligne = document.querySelectorAll('tr');
    const ligneNone = document.querySelectorAll('tr:first-child');
    const carte = document.querySelectorAll('div.card');
    const lien = document.getElementsByClassName('link');

    if(!themeStocke || themeStocke === "clair") {
      
      classeTheme.className = "clair";

      for(let i = 0; i < lien.length; i++){
        lien[i].style.color = "#4e4856";
        if(lienCard[i]) {
          lienCard[i].style.color = "#4e4856";
          lienCard[i].style.backgroundColor = "#F5DEB3";
          lienCard[i].style.border = "1px solid #b8a686";
        }
        tab.style.backgroundColor = "rgb(247, 237, 207)";
        tab.style.color = "#4e4856";
        modalTemplate.style.backgroundColor = "rgb(247, 237, 207)";
        modalTemplate.style.border ="2px solid #524A5E"
        // Modifie les <th> => ligne de l'en-tête pour changer la couleur en fonction de l'alternant
        entetes.forEach((entete) =>  {
          entete.style.backgroundColor = "#d6c29d";
          entete.style.borderBottom = "2px solid #b8a686";
        });
        // Modifie les <tr> une ligne sur 2 => pour avoir un backgroundColor qui alterne
        lignesPair.forEach((element) =>  {
          element.style.backgroundColor = "#d6c29d";
        });
        // Modifie tous les <tr> => ajoute une border-top
        ligne.forEach((element) => {
          element.style.borderTop = "2px solid #b8a686";
        });
        // Enlève la bordure du premier <tr>
        ligneNone.forEach((element) => {
          element.style.border = "none";
        });
        carte.forEach((element) => {
          element.style.backgroundColor = "#d6c29d";
          element.style.border = "1px solid #b8a686";
        })
      };
    }else if(themeStocke === "sombre"){

      classeTheme.className = "sombre";

      for(let i = 0; i < lien.length; i++){
        document.body.style.backgroundColor ="rgb(94, 84, 107)";
        document.body.style.color = "wheat";
        lien[i].style.color = "wheat";
        if(lienCard[i]) {
          lienCard[i].style.color = "wheat";
          lienCard[i].style.backgroundColor = "#5E546B";
          lienCard[i].style.border = "1px solid #473f50";
        }
        tab.style.backgroundColor = "#524a5e";
        tab.style.color = "wheat";
        modalTemplate.style.backgroundColor = "#473F50";
        modalTemplate.style.border ="2px solid #D6C29D"
        modalTemplate.style.color = "wheat";
        // Modifie les <th> => ligne de l'en-tête pour changer la couleur en fonction de l'alternant
        entetes.forEach((entete) =>  {
          entete.style.backgroundColor = "#473f50";
          entete.style.borderBottom = "2px solid #6e637d";
        });
        // Modifie tous les <tr> => ajoute une border-top
        lignesPair.forEach((element) =>  {
          element.style.backgroundColor = "#473f50";
        });
        // Modifie tous les <tr> => ajoute une border-top
        ligne.forEach((element) => {
          element.style.borderTop = "2px solid #6e637d";
        });
        // Enlève la bordure du premier <tr>
        ligneNone.forEach((element) => {
          element.style.border = "none";
        });
        carte.forEach((element) => {
          element.style.backgroundColor = "#524A5E";
          element.style.border = "1px solid #473f50";
        })
      };
    };
  };
  paramColor();
};

// ============== PARTIE LISTE/CARTE ==============

  // Changer le format d'affichage en fonction de la sélection
  formulaire.addEventListener('click', format);
  function format(event){
    if(event.target.value === 'liste'){
      listeClicked();
    }else{
      carteClicked();
    };
  };

  // Affiche le tableau et cache les cartes
  function listeClicked(){
    sectionListe.style.display = "";
    sectionCarte.style.display = "none";
  };

  // Affiche les cartes et cache le tableau
  function carteClicked(){
      sectionListe.style.display = "none";
      sectionCarte.style.display = "";
  };