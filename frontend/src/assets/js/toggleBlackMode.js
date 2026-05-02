export const toggleBlackMode = (theme) => {
  var body = document.getElementsByTagName("body")[0];
  var nav = document.getElementsByTagName("nav")[0];
  var logo = document.getElementById("logo");
  var nombreUsuario = document.getElementById("nombreUsuario");
  var luna = document.getElementsByClassName("luna")[0];
  var campana = document.getElementsByClassName("fa-bell")[0];
  var vr = document.getElementsByClassName("vr")[0];
  var titulo = document.querySelectorAll(".tituloCardGroup");
  var fecha = document.querySelectorAll(".fechaCardGroup");
  var cards = document.querySelectorAll(".cardElement");
  var lista = document.querySelectorAll(".fa-list");
  var grid = document.querySelectorAll(".fa-border-all");
  var cardsGroup = document.querySelectorAll(".cards-group");
  var outcard = document.getElementsByClassName("extern")[0];
  var tr = document.querySelectorAll(".tr-table");
  var table = document.getElementById("table");
  var eye = document.querySelectorAll(".fa-eye");
  var pen = document.querySelectorAll(".fa-pen-to-square");
  var trash = document.querySelectorAll(".fa-trash");
  var clipboard = document.querySelectorAll(".fa-clipboard");
  var btnAdd = document.querySelectorAll(".acces-tabla");
  var cardEnduser = document.querySelectorAll(".card-enduser");

  if (body) {
    if (theme === "oscuro") {
      body.id = "body-Oscuro";
      if (nav) nav.id = "nav-Oscuro";
      if (logo) logo.src = "./assets/dist/img/logo EVA Black.webp";
      if (nombreUsuario) nombreUsuario.style.color = "white";
      if (campana) {
        campana.classList.remove("fa-regular");
        campana.classList.add("fa-solid");
      }
      if (luna) {
        luna.classList.remove("fa-regular");
        luna.classList.remove("fa-moon");
        luna.classList.add("fa-solid");
        luna.classList.add("fa-sun");
      }
      if (vr) {
        vr.classList.remove("text-dark");
        vr.classList.add("text-light");
      }
      if (outcard) {
        outcard.classList.remove("outstanding-card");
        outcard.classList.add("outstanding-card-black");
      }
      if (table) {
        table.classList.remove("bg-light");
        table.classList.add("bg-dark");
      }
      if (cardEnduser) {
        cardEnduser.forEach(function (cardEnd) {
          cardEnd.classList.remove("bg-light");
          cardEnd.classList.add("bg-dark");
        });
      }

      if (grid) {
        grid.forEach(function (grid) {
          grid.classList.remove("text-dark");
          grid.classList.add("text-light");
        });
      }

      if (lista) {
        lista.forEach(function (lista) {
          lista.classList.remove("text-dark");
          lista.classList.add("text-light");
        });
      }

      if (titulo) {
        titulo.forEach(function (titulo) {
          titulo.classList.remove("text-dark");
          titulo.classList.add("text-light");
        });
      }

      if (fecha) {
        fecha.forEach(function (fecha) {
          fecha.classList.remove("text-dark");
          fecha.classList.add("text-light");
        });
      }

      if (cards) {
        cards.forEach(function (card) {
          card.classList.remove("text-dark");
          card.classList.add("text-light");
          card.classList.add("card-blackshadow");
        });
      }

      if (cardsGroup) {
        cardsGroup.forEach(function (cardsGroups) {
          cardsGroups.classList.remove("bg-light");
          cardsGroups.classList.add("bg-dark");
        });
      }

      if (tr) {
        tr.forEach(function (trs) {
          trs.classList.remove("table-light");
          trs.classList.add("table-dark");
        });
      }

      if (eye) {
        eye.forEach(function (eye) {
          eye.classList.remove("text-dark");
          eye.classList.add("text-light");
        });
      }

      if (pen) {
        pen.forEach(function (pen) {
          pen.classList.remove("text-dark");
          pen.classList.add("text-light");
        });
      }

      if (trash) {
        trash.forEach(function (trash) {
          trash.classList.remove("text-dark");
          trash.classList.add("text-light");
        });
      }

      if (clipboard) {
        clipboard.forEach(function (clipboard) {
          clipboard.classList.remove("text-dark");
          clipboard.classList.add("text-light");
        });
      }

      if (btnAdd) {
        btnAdd.forEach(function (btnAdd) {
          btnAdd.classList.remove("text-dark");
          btnAdd.classList.add("text-light");
        });
      }
    } else if (theme === "claro") {
      body.id = "body-Claro";
      if (nav) nav.id = "nav-Claro";
      if (logo) logo.src = "./assets/dist/img/logo EVA.webp";
      if (nombreUsuario) nombreUsuario.style.color = "black";
      if (campana) {
        campana.classList.remove("fa-solid");
        campana.classList.add("fa-regular");
      }
      if (luna) {
        luna.classList.remove("fa-solid");
        luna.classList.remove("fa-sun");
        luna.classList.add("fa-regular");
        luna.classList.add("fa-moon");
      }
      if (vr) {
        vr.classList.remove("text-light");
        vr.classList.add("text-dark");
      }
      if (outcard) {
        outcard.classList.remove("outstanding-card-black");
        outcard.classList.add("outstanding-card");
      }
      if (table) {
        table.classList.remove("bg-dark");
        table.classList.add("bg-light");
      }
      if (cardEnduser) {
        cardEnduser.forEach(function (cardEnd) {
          cardEnd.classList.remove("bg-dark");
          cardEnd.classList.add("bg-light");
        });
      }

      if (grid) {
        grid.forEach(function (grid) {
          grid.classList.remove("text-light");
          grid.classList.add("text-dark");
        });
      }

      if (lista) {
        lista.forEach(function (lista) {
          lista.classList.remove("text-light");
          lista.classList.add("text-dark");
        });
      }

      if (titulo) {
        titulo.forEach(function (titulo) {
          titulo.classList.remove("text-light");
          titulo.classList.add("text-dark");
        });
      }

      if (fecha) {
        fecha.forEach(function (fecha) {
          fecha.classList.remove("text-light");
          fecha.classList.add("text-dark");
        });
      }

      if (cards) {
        cards.forEach(function (card) {
          card.classList.remove("text-light");
          card.classList.add("text-dark");
        });
      }

      if (cardsGroup) {
        cardsGroup.forEach(function (cardsGroups) {
          cardsGroups.classList.remove("bg-dark");
          cardsGroups.classList.add("bg-light");
        });
      }

      if (tr) {
        tr.forEach(function (trs) {
          trs.classList.remove("table-dark");
          trs.classList.add("table-light");
        });
      }

      if (eye) {
        eye.forEach(function (eye) {
          eye.classList.remove("text-light");
          eye.classList.add("text-dark");
        });
      }

      if (pen) {
        pen.forEach(function (pen) {
          pen.classList.remove("text-light");
          pen.classList.add("text-dark");
        });
      }

      if (trash) {
        trash.forEach(function (trash) {
          trash.classList.remove("text-light");
          trash.classList.add("text-dark");
        });
      }

      if (clipboard) {
        clipboard.forEach(function (clipboard) {
          clipboard.classList.remove("text-light");
          clipboard.classList.add("text-dark");
        });
      }

      if (btnAdd) {
        btnAdd.forEach(function (btnAdd) {
          btnAdd.classList.remove("text-light");
          btnAdd.classList.add("text-dark");
        });
      }
    }
  }
};
