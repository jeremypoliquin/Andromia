const URL_SERVEUR = "http://andromiaserver.us-3.evennode.com";

$(document).ready(function(){
    $("#error").hide();


    $(".form-andromia").submit(function (e) {
        e.preventDefault();
        if(isValidEmailAddress($("#email").val()))
        {
            let message = isValidPassword();
            if(message == "") {
                let urlServeur = URL_SERVEUR + "/utilisateurs/comptes/";
                let dataJSON = {"utilisateur":{"courriel":$("#email").val(), "motDePasse": $("#password").val()}, "nomExplorateur": $("#explorateur").val()};
                $.ajax({
                    url : urlServeur,
                    type : 'POST',
                    dataType: 'json',
                    data : JSON.stringify(dataJSON),
                    contentType : 'application/json',
                    success: function(data, status, xhr)
                    {
                        window.localStorage.setItem("successCreation", "création de compte");
                        window.location = "login.html";
                    },
                    error: function(xhr, status, error)
                    {
                        if(xhr.status == 400) {
                            $("#error").text(xhr.responseJSON.userMessage).show().fadeOut(4500);
                        } else {
                            $("#error").text("Une erreur est survenue.").show().fadeOut(4500);
                        }
                    }
                });
            } else {
                $("#error").text(message).show().fadeOut(4500);
            }
        } else {
            $("#error").text("L'email n'est pas valide. Veuillez utiliser le format: abc@abc.abc'").show().fadeOut(4500);
        }
    
        $("#password").val("");
        $("#confpassword").val("");
            
    });
});

function CreationUtilObjet() {
    return 
}

function isValidPassword()
{
    
    if($("#password").val() === $("#confpassword").val()){
        if($("#password").val().length >= 3 && $("#password").val().length < 31) {
            return "";
        } else {
            return "Le mot de passe doit être entre 3 et 30 caractères.";
        }
    } else {
       return "Les deux mots de passe ne concordent pas. Veuillez-vous assurer qu'il soit similaire.";
    }
}

function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}