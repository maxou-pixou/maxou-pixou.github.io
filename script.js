
function showSection(sectionId) {
    // Cache toutes les sections principales
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');
    
    // Affiche la section sélectionnée
    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';

       
        // Affiche ou cache le sous-menu pour "Travelling"
        if (sectionId === 'travelling') {
            document.getElementById('travelling-submenu').style.display = 'block';
        } else {
            document.getElementById('travelling-submenu').style.display = 'none';
        }
        
    }
}

function showSubSection(subSectionId) {
    // Cache toutes les sous-sections
    const subSections = document.querySelectorAll('.sub-content-section');
    subSections.forEach(subSection => subSection.style.display = 'none');
    
    // Affiche la sous-section sélectionnée
    const subSectionToShow = document.getElementById(subSectionId);
    if (subSectionToShow) {
        subSectionToShow.style.display = 'block';
    }
   
    // Affiche la section principale "Travelling"
    const travellingSection = document.getElementById('travelling');
    if (travellingSection) {
        travellingSection.style.display = 'block';
    }


    // Cache les autres sections principales
    const mainSections = document.querySelectorAll('.content-section');
    mainSections.forEach(section => {
      
        if (section.id !== 'travelling') {
            section.style.display = 'none';
        }
        
    });
}

// Fonction pour stocker la dernière recherche et effectuer le filtrage global
function storeSearch() {
    const searchQuery = document.getElementById('searchBox').value.toLowerCase();

    if (searchQuery) {
        localStorage.setItem('lastSearch', searchQuery); // Stocke l'information dans le localStorage
        filterMonuments(searchQuery);
        
    } else {
        filterMonuments(''); // Réaffiche tout si la recherche est vide
    }
}

// Fonction pour filtrer les monuments à travers toutes les villes et changer de section si nécessaire
function filterMonuments(query) {
    let found = false; // Pour savoir si un monument correspondant a été trouvé
    let sections = document.querySelectorAll('.content-section'); // Toutes les sections (villes)

    sections.forEach(function(section) {
        let monuments = section.querySelectorAll('ul li.clickable'); // Monuments de cette ville
        let cityHasMatch = false; // Indique si cette ville contient un monument correspondant

        monuments.forEach(function(monument) {
            let title = monument.textContent.toLowerCase(); // Titre du monument

            // Affiche ou masque le monument en fonction de la recherche
            if (title.includes(query)) {
                monument.style.display = ''; // Affiche le monument
                cityHasMatch = true; // Cette ville a un monument correspondant
            } else {
                monument.style.display = 'none'; // Cache le monument
            }
        });

        // Si cette ville contient un monument correspondant, on la montre, sinon on la cache
        if (cityHasMatch && !found) {
            found = true; // On a trouvé un monument correspondant
            showSection(section.id); // Affiche la ville/section où se trouve le monument
        }
    });

    // Si aucune correspondance n'est trouvée, affiche un message ou réinitialise l'affichage
    if (!found) {
        console.log("Aucun monument trouvé pour cette recherche.");
    }
}

function updateSuggestions() {
    let searchTerm = document.getElementById('searchBox').value.toLowerCase();
    let suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = ''; // Clear previous suggestions

    if (searchTerm.length > 0) {
        let allItems = document.querySelectorAll('.clickable');
        let matchingItems = [];

        allItems.forEach(item => {
            let text = item.textContent.toLowerCase();
            // Ne pas inclure les éléments de recherche précédente
            if (text.includes(searchTerm) && text !== localStorage.getItem('lastSearch')) {
                matchingItems.push(item);
            }
        });

        matchingItems.forEach(item => {
            let suggestion = document.createElement('li');
            suggestion.textContent = item.textContent;
            suggestion.onclick = function() {
                selectSuggestion(item);
            };
            suggestions.appendChild(suggestion);
        });
    }
}


function selectSuggestion(item) {
    let searchTerm = item.textContent.toLowerCase();
    let city = item.getAttribute('data-city');

    // Afficher la section de la ville
    if (city) {
        showSection('travelling')
        showSection('friends');
        showSubSection(city);
    }

    // Effacer le champ de recherche
    document.getElementById('searchBox').value = '';

    // Clear the suggestions list
    document.getElementById('suggestions').innerHTML = '';

    // Montrer seulement l'élément sélectionné
    let allItems = document.querySelectorAll('.clickable');
    allItems.forEach(listItem => {
        listItem.style.display = 'none'; // Cacher tous les éléments
    });
    
    item.style.display = 'block'; // Montrer seulement l'élément sélectionné
    item.scrollIntoView({ behavior: 'smooth' }); // Faire défiler jusqu'à l'élément
}



function showSection(sectionId) {
    // Cache toutes les sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Affiche la section principale sélectionnée
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

function showSubSection(subSectionId) {
    // Cache toutes les sous-sections
    const subSections = document.querySelectorAll('.sub-content-section');
    subSections.forEach(subSection => {
        subSection.style.display = 'none';
    });

    // Affiche la sous-section sélectionnée
    const targetSubSection = document.getElementById(subSectionId);
    if (targetSubSection) {
        targetSubSection.style.display = 'block';
    }

    // S'assurer que la section "Travelling" est visible
    showSection('travelling');
    
}

function handleKeyDown(event) {
    if (event.key === 'Enter') {
        let searchTerm = document.getElementById('searchBox').value.toLowerCase();
        let allItems = document.querySelectorAll('.clickable');
        let foundItem = null;

        allItems.forEach(item => {
            let text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                foundItem = item;
            }
        });

        if (foundItem) {
            // Récupérer la ville associée à cet élément
            let city = foundItem.getAttribute('data-city');
            if (city) {
                // Naviguer vers la section correspondante
                showSection('travelling');
                showSubSection(city);
                
                // Faire défiler jusqu'à l'élément trouvé
                foundItem.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            alert("Aucun résultat trouvé");
        }
    }
}

window.onload = function() {
    // Récupérer et afficher la dernière recherche
    const lastSearch = localStorage.getItem('lastSearch');
    if (lastSearch) {
        document.getElementById('searchBox').value = lastSearch;
        filterMonuments(lastSearch); // Applique le filtre au chargement
    }
    // Optionnel : tu peux supprimer cette ligne si tu souhaites garder la dernière recherche jusqu'à ce qu'une nouvelle soit faite
    // localStorage.clear(); // Efface tout le localStorage
};
document.getElementById('cancelButton').addEventListener('click', function() {
    // Vider la valeur du champ de recherche
    document.getElementById('searchBox').value = '';

    // Vider le localStorage
    localStorage.removeItem('lastSearch');

    // Réinitialiser l'affichage des monuments
    filterMonuments(''); // Réaffiche tous les monuments

    // Vider la liste des suggestions s'il y en a
    document.getElementById('suggestions').innerHTML = '';


});


// Fonction JavaScript pour lire ou mettre en pause la vidéo
function lireOuPause() {
    var video = document.getElementById("monVideo");
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}