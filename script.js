
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');

    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';

        if (sectionId === 'travelling') {
            document.getElementById('travelling-submenu').style.display = 'block';
        } else {
            document.getElementById('travelling-submenu').style.display = 'none';
        }
        
    }
}

function showSubSection(subSectionId) {
    const subSections = document.querySelectorAll('.sub-content-section');
    subSections.forEach(subSection => subSection.style.display = 'none');
    
    const subSectionToShow = document.getElementById(subSectionId);
    if (subSectionToShow) {
        subSectionToShow.style.display = 'block';
    }

    const travellingSection = document.getElementById('travelling');
    if (travellingSection) {
        travellingSection.style.display = 'block';
    }

    const mainSections = document.querySelectorAll('.content-section');
    mainSections.forEach(section => {
      
        if (section.id !== 'travelling') {
            section.style.display = 'none';
        }
        
    });
}

function storeSearch() {
    const searchQuery = document.getElementById('searchBox').value.toLowerCase();

    if (searchQuery) {
        localStorage.setItem('lastSearch', searchQuery); 
        filterMonuments(searchQuery);
        
    } else {
        filterMonuments('');
    }
}

function filterMonuments(query) {
    let found = false; 
    let sections = document.querySelectorAll('.content-section'); 

    sections.forEach(function(section) {
        let monuments = section.querySelectorAll('ul li.clickable'); 
        let cityHasMatch = false;

        monuments.forEach(function(monument) {
            let title = monument.textContent.toLowerCase(); 

            // Affiche ou masque le monument en fonction de la recherche
            if (title.includes(query)) {
                monument.style.display = '';
                cityHasMatch = true; 
            } else {
                monument.style.display = 'none'; 
            }
        });

        if (cityHasMatch && !found) {
            found = true; 
            showSection(section.id);
        }
    });

    if (!found) {
        console.log("Aucun monument trouvé pour cette recherche.");
    }
}

function updateSuggestions() {
    let searchTerm = document.getElementById('searchBox').value.toLowerCase();
    let suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = ''; 
    if (searchTerm.length > 0) {
        let allItems = document.querySelectorAll('.clickable');
        let matchingItems = [];

        allItems.forEach(item => {
            let text = item.textContent.toLowerCase();
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

    if (city) {
        showSection('travelling')
        showSection('friends');
        showSubSection(city);
    }

    document.getElementById('searchBox').value = '';

    document.getElementById('suggestions').innerHTML = '';

    let allItems = document.querySelectorAll('.clickable');
    allItems.forEach(listItem => {
        listItem.style.display = 'none'; 
    });

    item.style.display = 'block';
    item.scrollIntoView({ behavior: 'smooth' });
}



function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

function showSubSection(subSectionId) {
    const subSections = document.querySelectorAll('.sub-content-section');
    subSections.forEach(subSection => {
        subSection.style.display = 'none';
    });

    const targetSubSection = document.getElementById(subSectionId);
    if (targetSubSection) {
        targetSubSection.style.display = 'block';
    }

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
            let city = foundItem.getAttribute('data-city');
            if (city) {
                showSection('travelling');
                showSubSection(city);
                
                foundItem.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            alert("Aucun résultat trouvé");
        }
    }
}

window.onload = function() {
    const lastSearch = localStorage.getItem('lastSearch');
    if (lastSearch) {
        document.getElementById('searchBox').value = lastSearch;
        filterMonuments(lastSearch); // Applique le filtre au chargement
    }
};
document.getElementById('cancelButton').addEventListener('click', function() {
    document.getElementById('searchBox').value = '';

    localStorage.removeItem('lastSearch');

    filterMonuments('');

    document.getElementById('suggestions').innerHTML = '';


});


document.addEventListener('DOMContentLoaded', function() {
    const videos = document.getElementById('maVideo'); 
    const correctPassword = "hive";  

    videos.forEach(videoElement => {
       
        videoElement.controls = false;

        
        videoElement.addEventListener('click', function(event) {
           
            if (!videoElement.controls) {
                event.preventDefault(); 

                let enteredPassword = prompt("Entrez le mot de passe pour regarder la vidéo :");

                if (enteredPassword === correctPassword) {
                    videoElement.controls = true; 
                    videoElement.play(); 
                } else {
                    alert("Mot de passe incorrect !");
                    location.reload(); 
                }
            }
        });
    });
});

