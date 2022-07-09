import { checkAllMusicParams } from "./resources/audio/audio.js";

let d = $(document);
d.ready(function () {
  let page = parseInt(localStorage.getItem("page"));
  let status = localStorage.getItem("status");
  checkAllMusicParams();
  removeClassHover();
  getAllCharactersInfo();

  //Controladores del modal
  $(".start").on("click", function () {
    $(".overlay, .modal").addClass("active");
  });
  $(".continue, .overlay").on("click", function () {
    $(".overlay, .modal").removeClass("active");
  });
  $(document).keyup(function (e) {
    if (e.keyCode === 27) {
      $(".overlay, .modal").removeClass("active");
    }
  });
  //----------------------------------------------------------------
  //Reconocer la página actual para completar la petición a la API y que siempre comience desde la página 1
  $('a[id="alive"] , .continue').on("click", function () {
    let actualURL = window.location.pathname;
    if (actualURL.includes("alive") === false) {
      localStorage.setItem("page", 1);
      localStorage.setItem("status", "&status=alive");
    }
  });
  $('a[id="dead"]').on("click", function () {
    let actualURL = window.location.pathname;
    if (actualURL.includes("dead") === false) {
      localStorage.setItem("page", 1);
      localStorage.setItem("status", "&status=dead");
    }
  });
  $('a[id="unknown"]').on("click", function () {
    let actualURL = window.location.pathname;
    if (actualURL.includes("unknown") === false) {
      localStorage.setItem("page", 1);
      localStorage.setItem("status", "&status=unknown");
    }
  });
  //---------------------------------------------------------------
  //Navegar a la página siguiente o anterior
  $("#button-next").on("click", function () {
    if (status.includes("alive") && page < 22) {
      page++;
      localStorage.setItem("page", page);
      $('article[class="characterCard"]').remove();
      getAllCharactersInfo();
    }
    if (status.includes("dead") && page < 15) {
      page++;
      localStorage.setItem("page", page);
      $('article[class="characterCard"]').remove();
      getAllCharactersInfo();
    }
    if (status.includes("unknown") && page < 5) {
      page++;
      localStorage.setItem("page", page);
      $('article[class="characterCard"]').remove();
      getAllCharactersInfo();
    }
  });
  $("#button-prev").on("click", function () {
    if (
      (status.includes("alive") ||
        status.includes("dead") ||
        status.includes("unknown")) &&
      page > 1
    ) {
      page--;
      localStorage.setItem("page", page);
      $('article[class="characterCard"]').remove();
      getAllCharactersInfo();
    }
  });
  //-------------------------------------------------------------
  //Si el formulario de reegistro está relleno correctamente, validamos
  $(".button-register").on("click", function () {
    let email = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    let password =
      /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    let succeed =
      '<form class="survey-form-success"><h1>Register succeded!</h1><div class="check-container"><img src="../resources/images/check.gif" alt="check-gift"/></div></form>';
    if (
      $("#name-register").val().length === 0 ||
      !email.test($("#email-register").val()) ||
      !password.test($("#password-register").val())
    ) {
      return;
    } else {
      localStorage.setItem("email", $("#email-register").val());
      localStorage.setItem("password", $("#password-register").val());
      $(".survey-form-register").remove();
      $(".form-main-register").append(succeed);
      setInterval(function () {
        $(location).prop("href", "./login-page.html");
        window.location.href = "./login-page.html";
      }, 5000);
    }
  });
  //---------------------------------------------------------------
  //Iniciamos sesión con los datos guardados en el registro
  $(".button-login").on("click", function () {
    if (
      localStorage.getItem("email") === $("#email").val() &&
      localStorage.getItem("password") === $("#password").val()
    ) {
      window.location.href = "./characters/alive.html";
    } else {
      if ($("#invalid").length === 0)
        $("#password").after(
          '<p class="condition-password" id="invalid">Email o contraseña incorrecta</p>'
        );
    }
  });
  //----------------------------------------------------------------
  //Botón que nos permitirá volver a la página de seleción de registro o login
  $(".exit-button").on("click", function () {
    let currentUrl = window.location.href;
    if (currentUrl.includes("characters")) {
      window.location.href = "../intro.html";
    } else {
      window.location.href = "./intro.html";
    }
  });
  //--------------------------------------------------------------
  //Accederemos al registro o login
  $(".left-intro").on("click", function () {
    window.location.href = "./register-page.html";
  });
  $(".right-intro").on("click", function () {
    window.location.href = "./login-page.html";
  });
  //---------------------------------------------------------------
  //Petición a la API y recogida de datos con el pintado de éstos.
  function getAllCharactersInfo() {
    var fullUrl = localStorage.getItem("URL") + String(page) + status;

    checkUrl();

    $.ajax({
      type: "GET",
      url: fullUrl,
    }).done(function (data) {
      let characterData = data.results;

      let pageNumber = page;
      $("#pageNumber").html(pageNumber);

      for (let i = 0; i < characterData.length; i++) {
        let characterId = characterData[i].id;
        let characterGender = characterData[i].gender;
        let characterName = characterData[i].name;
        let characterImg = characterData[i].image;
        let characterOrigin = characterData[i].origin.name;
        let characterLocation = characterData[i].origin.name;
        let characterSpecies = characterData[i].species;
        let characterStatus = characterData[i].status;
        let url = characterData[i].url;

        let gridCharacter =
          '<article class="characterCard">' +
          '<div class="characterCard_img" id="' +
          characterId +
          '">' +
          '<img src="' +
          characterImg +
          '" alt="' +
          characterName +
          '-img">' +
          "</div>" +
          '<div class="characterCard_ContentWrapper">' +
          "<h2>" +
          characterName +
          "</h2>" +
          '<span class="status__icon"></span>' +
          "<span>Género: " +
          characterGender +
          "</span>" +
          "<span>Especie: " +
          characterSpecies +
          "</span>" +
          '<span class="text-gray">Visto por última vez: ' +
          characterLocation +
          "</span> " +
          '<span class="text-gray">Origen: ' +
          characterOrigin +
          "</span> " +
          "</div></article>";

        $(".grid").append(gridCharacter);
      }
    });
    return false;
  }
});
//-------------------------------------------
//Comprobación si hay datos guardados en localstorage y si no crearlos
function checkUrl() {
  if (
    !("URL" in localStorage) ||
    localStorage.getItem("URL") === "" ||
    localStorage.getItem("URL") == undefined
  ) {
    localStorage.setItem(
      "URL",
      "https://rickandmortyapi.com/api/character/?page="
    );
  }
  if (
    !("page" in localStorage) ||
    localStorage.getItem("page") === "" ||
    localStorage.getItem("page") == undefined
  ) {
    localStorage.setItem("page", 1);
  }
  if (
    !("status" in localStorage) ||
    localStorage.getItem("status") === "" ||
    localStorage.getItem("status") == undefined
  ) {
    localStorage.setItem("status", "&status=alive");
  }
}
//----------------------------------------------
//Agregar o quitar la clase del botón active de la barra de navegación cuando se hace
//hover en otro botón
function removeClassHover() {
  $(document).on("mouseover", "nav a", function () {
    $("a.active").addClass("inactive").removeClass("active");
  });
  $(document).on("mouseout", "nav a", function () {
    $("a.inactive").addClass("active").removeClass("inactive");
  });
}
