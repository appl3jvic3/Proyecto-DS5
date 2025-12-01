//sobre-nosotros.js limpio: muestra los miembros del equipo de desarrollo
document.addEventListener("DOMContentLoaded", function () {
    const MEMBERS = [
        {
            id: 1, name: "Luis de Leon", image: "img/Miembros/Perfil_luisDeLeon.jpg",
        },
        {
            id: 2, name: "Jeremy Rodríguez", image: "img/Miembros/Perfil_jeremyR.jpg",
        },
        {
            id: 3, name: "Daniel Comrie", image: "img/Miembros/Perfil_danielC.jpg",
        },
        {
            id: 4, name: "Carlos Concepción", image: "img/Miembros/Perfil_carlosC.jpg",
        },
        {
            id: 5, name: "Joseph Guerra", image: "img/Miembros/Perfil_josephG.jpg",
        },
    ];
    const membersGrid = document.getElementById("miembros-grid");
    if(!membersGrid) return;
    membersGrid.innerHTML = MEMBERS.map(
        (member) => `
    <div class="member-card">
      <img src="${member.image}" alt="${member.name}" class="member-img">
      <h3>${member.name}</h3>
    </div>
  `
  ).join("");
});