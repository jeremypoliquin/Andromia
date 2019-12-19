const URL_SERVEUR = "http://andromiaserver.us-3.evennode.com";
const NOM_RUNES_FR = {air: "air", darkness: "Ténèbres", earth: "Terre", energy: "Énergie", fire: "Feu", life: "Vie", light: "Lumière", logic: "Logique", music: "Musique", space: "Espace", toxic: "Toxique", water: "Eau"};
const COLOR_RUNES = {air: "#bdc3c7", darkness:"#8e44ad", earth:"#cd6133", energy: "#8e44ad", fire: "#e74c3c", life: "#2ecc71",light: "#f6e58d", logic:"#1abc9c", music: "#e84393", space: "#130f40", toxic: "#8e44ad", water: "#3498db"}
let access_token;

$( document ).ready(function() {
    var lastScrollTop = 0;
    access_token = localStorage.getItem("andromia");
    prepareListener("profile");
    prepareListener("map");
    prepareListener("units");
    RetrieveGlobalInfo("1");

    if(($(".img-card").width() * 1.62) > 324) {
        $(".img-card").height(324);
        $(".img-card").width(200);
    } else
        $(".img-card").height($(".img-card").width() * 1.62);
    
    $("#disconnect").click(function(){
        localStorage.removeItem("andromia");
        window.localStorage.setItem("successDisconnect", "déconnexion");
        window.location = "login.html";
    });
});

function RetrieveGlobalInfo(id)
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
            console.log(data[0]);
            loadMainInfoBlock(data[0]); 
        },
        error: function(xhr, status, error){
            console.log(xhr);
            console.log("echec");
        }
    });
    /*
    $.get(url, function(explorateur){
        loadMainInfoBlock(explorateur);
    });*/
}

function loadMainInfoBlock(explorateur)
{
    $("#inox").text(explorateur.inox + " Inox");
    $("#location").text("Location: " + explorateur.location);
    $("#bienvenue").text("Bienvenue sur Andromia, " + explorateur.nom);
    

    let units = loadUnits(explorateur.units);
    //let affinitesHTML = CreerAffinites(explorateur.units);
    //$("#affinites").append(affinitesHTML);

    //loadLastUnites(explorateur.units);
    loadRunes(explorateur.runes);

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
            loadLastUnites(data);

            // Appel pour loader tous les unités dans ton bloc
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
        for(var i = units.length-1; i > units.length-4; i++)
        {
            unitsTemp.push(units[i]);
        }
        units = unitsTemp;
    }
    for(var unit in units)
    {
        console.log(units[unit]);
        cardsShowcaseLast += '<div class="col-sm-4 card-box pd-5">';
        cardsShowcaseLast += '<div class="pd-5 darker-blue-bg">';
        cardsShowcaseLast += `<img class="img-card" alt="${units[unit].affinity}" src="${units[unit].imageURL}"/>`;
        cardsShowcaseLast += "</div></div>";
    }
    $("#cards-showcase-last").append(cardsShowcaseLast);

    if(($(".img-card").width() * 1.62) > 324) {
        $(".img-card").height(324);
        $(".img-card").width(200);
    } else
        $(".img-card").height($(".img-card").width() * 1.62);

    console.log($(".img-card").attr("alt"));
    $(".img-card").mouseover(function(){ $(this).animate({ borderColor: COLOR_RUNES[$(this).attr("alt")]}, 'slow')});
    $(".img-card").mouseout(function(){ $(this).animate({borderColor:"#34495e"}, 'fast') });
}

function CreerAffinites(units)
{
    var arrayComparAffinity = {air:0,darkness:0,earth:0,energy:0,fire:0,life:0,light:0,logic:0,music:0,space:0,toxic:0,water:0};

    units.forEach(unit => {
        arrayComparAffinity[unit.affinity] += 1;
    });

    var topThree = {first:0, firstStr:"", second:0, secondStr:"", third:0, thirdStr:"" };

    for(var rune in arrayComparAffinity) {
        runeValue = arrayComparAffinity[rune];
        if(runeValue > topThree.first) {
            topThree.thirdStr = topThree.secondStr;
            topThree.third = topThree.second;
            topThree.secondStr = topThree.firstStr;
            topThree.second = topThree.first;
            topThree.firstStr = rune;
            topThree.first = runeValue;
        } else if(runeValue > topThree.second) {
            topThree.thirdStr = topThree.secondStr;
            topThree.third = topThree.second;
            topThree.secondStr = rune;
            topThree.second = runeValue;
        } else if(runeValue > topThree.third)
            topThree.thirdStr = rune;
            topThree.third = runeValue;
    }

    let affinitesHTML = "";
    
    if(topThree.firstStr != "") {
        affinitesHTML += '<li>';
        affinitesHTML += `<span><img src="img/runes/lighter/${topThree.firstStr}.svg" class="small-img circle dark-yellow-bg" alt="rune"/></span>`;
        affinitesHTML += `<p class="rounded-border dark-yellow-bg font-500">${NOM_RUNES_FR[topThree.firstStr]}</p>`;
        affinitesHTML += '</li>';
        if(topThree.secondStr != "") {
            affinitesHTML += '<li>';
            affinitesHTML += `<span><img src="img/runes/lighter/${topThree.secondStr}.svg" class="small-img circle dark-yellow-bg" alt="rune"/></span>`;
            affinitesHTML += `<p class="rounded-border dark-yellow-bg font-500">${NOM_RUNES_FR[topThree.secondStr]}</p>`;
            affinitesHTML += '</li>';
            if(topThree.thirdStr != "") {
                affinitesHTML += '<li>';
                affinitesHTML += `<span><img src="img/runes/lighter/${topThree.thirdStr}.svg" class="small-img circle dark-yellow-bg" alt="rune"/></span>`;
                affinitesHTML += `<p class="rounded-border dark-yellow-bg font-500">${NOM_RUNES_FR[topThree.thirdStr]}</p>`;
                affinitesHTML += '</li>';
            }
        }
    }
    return affinitesHTML;
}


function prepareListener(name)
{
    $(`#goto-${name}`).click(function(){
        $(this).removeClass("toTransparent").addClass("toWhite");

        if(name == "profile")
        {
            if ($("#goto-map").hasClass("toWhite"))
            {
                $("#goto-map").removeClass("toWhite").addClass("toTransparent");
            }
            else if ($("#goto-units").hasClass("toWhite"))
            {
                $("#goto-units").removeClass("toWhite").addClass("toTransparent");
            }
            prepareListener("map");
            prepareListener("units");
        } else if(name == "map")
        {
            if ($("#goto-profile").hasClass("toWhite"))
            {
                $("#goto-profile").removeClass("toWhite").addClass("toTransparent");
            }
            else if ($("#goto-units").hasClass("toWhite"))
            {
                $("#goto-units").removeClass("toWhite").addClass("toTransparent");
            }
            prepareListener("profile");
            prepareListener("units");
        } else if (name =="units")
        {
            if ($("#goto-map").hasClass("toWhite"))
            {
                $("#goto-map").removeClass("toWhite").addClass("toTransparent");
            }
            else if ($("#goto-profile").hasClass("toWhite"))
            {
                $("#goto-profile").removeClass("toWhite").addClass("toTransparent");
            } 
            prepareListener("map");
            prepareListener("profile");
        }
        scrollToAnchor(name);
        $(this).off();
    });
}

function scrollToAnchor(anchor_id)
{   
    var tag = $("#"+anchor_id);
    $('html,body').animate({scrollTop: tag.offset().top},1000);
}

// ANIMATION
