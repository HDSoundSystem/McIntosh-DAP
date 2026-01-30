const pwr = document.getElementById('pwr');
const vfd = document.getElementById('vfd');
const nl = document.getElementById('needle-l');
const nr = document.getElementById('needle-r');
let isOn = false;

// Gestion du bouton Power
pwr.addEventListener('click', () => {
    isOn = !isOn;
    pwr.classList.toggle('active');
    vfd.style.opacity = isOn ? "1" : "0.1";
});

// Animation des aiguilles
function loop() {
    if (isOn) {
        // Mouvement aléatoire quand allumé
        nl.style.transform = `rotate(${-45 + Math.random() * 90}deg)`;
        nr.style.transform = `rotate(${-45 + Math.random() * 90}deg)`;
    } else {
        // Position de repos quand éteint
        nl.style.transform = `rotate(-55deg)`;
        nr.style.transform = `rotate(-55deg)`;
    }
    setTimeout(loop, 120);
}

// Lancement de la boucle
loop();