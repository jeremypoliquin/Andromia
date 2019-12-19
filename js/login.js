const URL_SERVEUR = "http://andromiaserver.us-3.evennode.com";
$(document).ready(function(){
    $("#error").hide();
    $("#success").hide();
    if(localStorage.getItem("andromia")) {
        window.location = "main.html";
    } else if(localStorage.getItem("successCreation")) {
        localStorage.removeItem("successCreation");
        $("#success").text("Compte créer avec succès! Utiliser votre identifiant dès maintenant").show();
    } else if(localStorage.getItem("successDisconnect")) {
        localStorage.removeItem("successDisconnect");
        $("#success").text("Déconnexion réussie!").show();
    }


    $(".form-andromia").submit(function (e) {
        e.preventDefault();

        if(isValidEmailAddress($("#email").val()))
        {
            if($("#password").val().length != 0)
            {
                let dataJSON = {"courriel": $("#email").val(), "motDePasse":$("#password").val()};
                let urlServeur = URL_SERVEUR + "/utilisateurs/token";
                $.ajax({
                    url : urlServeur,
                    type : 'post',
                    dataType: 'json',
                    data : JSON.stringify(dataJSON),
                    contentType : 'application/json',
                    success: function(data, status, xhr)
                    {
                        window.localStorage.setItem("andromia", data.token);
                        window.location = "main.html";
                    },
                    error: function(xhr, status, error)
                    {
                        if(xhr.status == 401){
                            $("#error").text("Vos identifiants sont incorrects.").show().fadeOut(4500);
                        } else {
                            $("#error").text("Une erreur est survenue.").show().fadeOut(4500);
                        }
                    }
                });
            } else {
                $("#error").text("Le mot de passe ne peut être vide.").show().fadeOut(4500);
            }
        } else {
            $("#error").text("L'email n'est pas valide. Veuillez utiliser le format: abc@abc.abc'").show().fadeOut(3500);;
        }
    });
});

function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}