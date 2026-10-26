// Mascote do jogo: a Bolhinha. Desenhada em SVG para ficar nítida em qualquer tela.
// Humores: "feliz", "animada", "triste" e "pensando".
let mascotId = 0;
function mascot(mood = "feliz", extraClass = "") {
  const id = "bolha" + (++mascotId);
  const openEyes = (dy = 0) => `
    <ellipse cx="44" cy="60" rx="11" ry="13" fill="#fff"/><ellipse cx="76" cy="60" rx="11" ry="13" fill="#fff"/>
    <circle cx="46" cy="${62 + dy}" r="6.5" class="m-pupil"/><circle cx="78" cy="${62 + dy}" r="6.5" class="m-pupil"/>
    <circle cx="48.5" cy="${59 + dy}" r="2.2" fill="#fff"/><circle cx="80.5" cy="${59 + dy}" r="2.2" fill="#fff"/>`;
  const faces = {
    feliz: openEyes() + '<path d="M48 80q12 12 24 0" class="m-line"/>',
    animada: '<path d="M34 61q10-12 20 0M66 61q10-12 20 0" class="m-line"/>' +
      '<path d="M45 76q15 24 30 0z" class="m-mouth"/><path d="M52 86q8 6 16 0" fill="#FF8FB1"/>',
    triste: openEyes(3) + '<path d="M32 44l15-5M88 44l-15-5" class="m-line"/>' +
      '<path d="M50 89q10-8 20 0" class="m-line"/><path d="M92 46q4 8 0 11q-4-3 0-11z" fill="#9EE7FF"/>',
    pensando: openEyes(-3) + '<path d="M53 85q7-3 14 0" class="m-line"/>'
  };
  return `<span class="mascot mascot-${mood} ${extraClass}" role="img" aria-label="Bolhinha, a mascote do jogo">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <radialGradient id="${id}" cx="35%" cy="30%" r="75%">
          <stop offset="0" stop-color="#C9FFF4"/><stop offset=".45" stop-color="#3EE0C0"/><stop offset="1" stop-color="#0FA88E"/>
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="112" rx="34" ry="5" fill="#000" opacity=".25" class="m-shadow"/>
      <circle cx="60" cy="64" r="45" fill="url(#${id})" stroke="#0B8A75" stroke-width="3"/>
      <ellipse cx="38" cy="38" rx="13" ry="7" fill="#fff" opacity=".75" transform="rotate(-35 38 38)"/>
      <circle cx="54" cy="29" r="3" fill="#fff" opacity=".75"/>
      <ellipse cx="33" cy="78" rx="7" ry="4.5" fill="#FF8FB1" opacity=".55"/>
      <ellipse cx="87" cy="78" rx="7" ry="4.5" fill="#FF8FB1" opacity=".55"/>
      ${faces[mood] || faces.feliz}
      <circle cx="102" cy="20" r="6" fill="none" stroke="#C9FFF4" stroke-width="2" opacity=".8" class="m-bubble"/>
      <circle cx="111" cy="35" r="3.5" fill="none" stroke="#C9FFF4" stroke-width="2" opacity=".7" class="m-bubble m-bubble-2"/>
    </svg>
  </span>`;
}
