const URL_SERVEUR = "http://andromiaserver.us-3.evennode.com";
const NOM_RUNES_FR = {air: "air", darkness: "Ténèbres", earth: "Terre", energy: "Énergie", fire: "Feu", life: "Vie", light: "Lumière", logic: "Logique", music: "Musique", space: "Espace", toxic: "Toxique", water: "Eau"};
const COLOR_RUNES = {air: "#bdc3c7", darkness:"#8e44ad", earth:"#cd6133", energy: "#8e44ad", fire: "#e74c3c", life: "#2ecc71",light: "#f6e58d", logic:"#1abc9c", music: "#e84393", space: "#130f40", toxic: "#8e44ad", water: "#3498db"}
let access_token;

$( document ).ready(function() {
    var lastScrollTop = 0;
    access_token = localStorage.getItem("andromia");
    RetrieveGlobalInfo();
    
    $("#disconnect").click(function(){
        localStorage.removeItem("andromia");
        window.localStorage.setItem("successDisconnect", "déconnexion");
        window.location = "login.html";
    });
});

function RetrieveGlobalInfo()
{
    let urlRetrieve = URL_SERVEUR + "/explorateurs/";
    let req = new XMLHttpRequest();
    
    $.ajax
    ({
        type: "GET",
        url: urlRetrieve,
        beforeSend : function( xhr ) {
            xhr.setRequestHeader( 'Authorization', 'BEARER ' + access_token );
        },
        success: function (data, status, xhr){
            loadMainInfoBlock(data[0]); 
        },
        error: function(xhr, status, error){
            console.log(xhr);
            console.log("echec");
        }
    });
}

function loadMainInfoBlock(explorateur)
{
    $("#inox").text(explorateur.inox + " Inox");
    $("#location").text("Location: " + explorateur.location);
    $("#bienvenue").text("Bienvenue sur Andromia, " + explorateur.nom);
    let dateCreate = new Date(explorateur.dateCreation);
    $("#tempsMembre").text(
        dateCreate.getFullYear() 
        +"-"+ 
        (dateCreate.getMonth()+1) 
        +"-"+
        dateCreate.getDate()
    );

    loadUnits(explorateur.units);
    loadExplorations(explorateur.explorations);
    loadRunes(explorateur.runes);
    

    let units = loadUnits(explorateur.units);
}

function loadExplorations(explorations)
{
    $.ajax
    ({
        type: "GET",
        url: explorations.href,
        beforeSend : function( xhr ) {
            xhr.setRequestHeader( 'Authorization', 'BEARER ' + access_token );
        },
        success: function (data, status, xhr){
            $("#nbrExplo").text(data.length);
            console.log(data);
            loadActivites(data);

            // Appel pour loader tous les unités dans ton bloc
        },
        error: function(xhr, status, error){
            console.log(xhr);
        }
    });
    
    // Laisser ça la
    /*
    $.ajax
    ({
        type: "GET",
        url: "http://andromiaserver.us-3.evennode.com/units/5dfc04d09b8a95001ed8614a",
        beforeSend : function( xhr ) {
            xhr.setRequestHeader( 'Authorization', 'BEARER ' + access_token );
        },
        success: function (data, status, xhr){
            console.log(data);

            // Appel pour loader tous les unités dans ton bloc
        },
        error: function(xhr, status, error){
            console.log(xhr);
        }
    });*/
}

function loadActivites(explorations)
{
    let activitesShowcase = "";

    if(explorations.length > 3)
    {
        let exploTemp = [];
        exploTemp.push(explorations[explorations.length-1], explorations[explorations.length-2], explorations[explorations.length-3] );
        explorations = exploTemp;
    }

    let compteurContenu = 0;

    for(var exploration in explorations)
    {
        var dateExplo = new Date(explorations[exploration].dateExploration);
        console.log(exploration);
        var dateExploStr =  dateExplo.getFullYear() 
                            +"-"+ 
                            (dateExplo.getMonth()+1) 
                            +"-"+
                            dateExplo.getDate();
        if(explorations[exploration].unit != null && explorations[exploration].unit != undefined) {
            activitesShowcase += "<li>";
            activitesShowcase += `<img src="img/mighty-force.svg" class="small-img circle dark-red-color-bg" alt="hero"/>`;
            activitesShowcase += `<p class="rounded-border dark-red-color-bg width-100"><span>${dateExploStr}:</span> Vous avez découvert une unité!</p>`;
            activitesShowcase += "</li>";
            compteurContenu++;
            if(compteurContenu == 3)
                break;
        }
        activitesShowcase += "<li>";
        activitesShowcase += '<img src="img/binoculars.svg" class="small-img circle dark-red-color-bg" alt="exploration"/>';
        activitesShowcase += `<p class="rounded-border dark-red-color-bg width-100"><span>${dateExploStr}:</span> Exploration réalisée!</p>`;
        activitesShowcase += "</li>";
        compteurContenu++;
        if(compteurContenu == 3)
                break;
    }
    
    $("#activites").append(activitesShowcase);
    
    /*
    <li>
        <img src="img/binoculars.svg" class="small-img circle dark-red-color-bg" alt="exploration"/>
        <p class="rounded-border dark-red-color-bg width-100"><span>2019-12-05:</span> Exploration réalisé!</p>
    </li>
    <li> 
        <img src="img/portal.svg" class="small-img circle dark-red-color-bg" alt="portail"/>
        <p class="rounded-border dark-red-color-bg width-100"><span>2019-12-05:</span> Vous avez découvert un portail!</p>
    </li>
    <li>
        <img src="img/mighty-force.svg" class="small-img circle dark-red-color-bg" alt="hero"/>
        <p class="rounded-border dark-red-color-bg width-100"><span>2019-12-05:</span> Vous avez découvert une unité!</p>
    </li>*/
}

// Permet d'aller chercher les units
function loadUnits(units)
{
    $.ajax
    ({
        type: "GET",
        url: units.href,
        beforeSend : function( xhr ) {
            xhr.setRequestHeader( 'Authorization', 'BEARER ' + access_token );
        },
        success: function (data, status, xhr){
            $("#nbrUnites").text(data.length);
            loadLastUnites(data);
            loadAllUnites(data);
        },
        error: function(xhr, status, error){
            console.log(xhr);
            return null;
        }
    });
}

function loadRunes(lienRunes)
{
    $.ajax
    ({
        type: "GET",
        url: lienRunes.href,
        beforeSend : function( xhr ) {
            xhr.setRequestHeader( 'Authorization', 'BEARER ' + access_token );
        },
        success: function (data, status, xhr){
            for(let runes in data)
                $("#runes-"+runes).text(data[runes]);
        },
        error: function(xhr, status, error){
            for(let runes in NOM_RUNES_FR)
                $("#runes-"+runes).text(0);
        }
    });
}

function loadLastUnites(units)
{
    let cardsShowcaseLast = "";

    
    if(units.length > 3)
    {
        let unitsTemp = [];
        let compteur = 0;
        for(var i = units.length-1; compteur < 3; compteur++){
            unitsTemp.push(units[i]);
            i--;
        }
        units = unitsTemp;
    }
    for(var unit in units)
    {
        var valNew = units[unit].href.split('/');
        var id = valNew[4];
        cardsShowcaseLast += '<div class="col-sm-4 card-box pd-5">';
        cardsShowcaseLast += '<div class="pd-5 darker-blue-bg">';
        cardsShowcaseLast += '<h6 class="text-center font-weight-bold mb-3"><u>'+ units[unit].name +'</u></h6>';
        cardsShowcaseLast += `<div><img class="img-card" id="${id}" alt="${units[unit].affinity}" src="${units[unit].imageURL}"/></div>`;
        cardsShowcaseLast += "</div></div>";
    }
    $("#cards-showcase-last").append(cardsShowcaseLast);
}

function loadAllUnites(units)
{
    let cards = "";
    for(var unit in units)
    {
        var valNew = units[unit].href.split('/');
        var id = valNew[4];
        cards += '<div class="col-sm-4 card-box pd-5">';
        cards += '<div class="pd-5 darker-blue-bg">';
        cards += '<h5 class="text-center font-weight-bold mb-3"><u>'+ units[unit].name +'</u></h5>';
        cards += `<div><img class="img-card" id="${id}" alt="${units[unit].affinity}" src="${units[unit].imageURL}"/></div>`;
        cards += "</div></div>";
    }
    $("#cards").append(cards);

    $(".img-card").mouseover(function(){ 

        $(this).animate({ borderColor: COLOR_RUNES[$(this).attr("alt")]}, 'slow');
        $(this).animate({opacity: 0.5}, 500);
    });

    $(".img-card").mouseout(function(){ 

        $(this).animate({borderColor:"#34495e"}, 'fast');
        $(this).animate({opacity: 1.0}, 500);
    });

    // Section pour afficher les détails d'une unit : 
    $(".img-card").click(function() {

        let cardDetails = "";

        for(var unit in units)
        {
            var valNew = units[unit].href.split('/');
            var id = valNew[4];
            if ($(this).attr("id") == id) {

                $("#modalCarteCentreTitre").html(units[unit].name);                
                var i = 1;
                for (var x = 0; x < units[unit].life; x++) {

                    cardDetails += ` <img class="img-card" alt="vie${x}" src="img/heart.svg" width="10%" height="5%"/>`;

                    if (i == 8) {                        
                        cardDetails += "<br>"; 
                        i = 0;
                    }

                    i++;
                }

                cardDetails += '<p>Capacités :</p>'
                cardDetails += `<img class="img-card" id="${id}" alt="${units[unit].affinity}" src="${units[unit].imageURL}" width="75%" height="50%"/>`;
                cardDetails += '<p>' + units[unit].number + "-" + units[unit].set + '</p>';
            }
        }

        $(".modal-body").html(cardDetails);
         
        $(".modal").modal('show');
    });
}
