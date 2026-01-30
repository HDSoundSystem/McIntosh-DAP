const pwr = document.getElementById('pwr');
const vfd = document.getElementById('vfd');
const nl = document.getElementById('needle-l');
const nr = document.getElementById('needle-r');

// L'appareil est ON visuellement au départ
let isOn = true;
// Mais l'animation des aiguilles est OFF au lancement
let isAnimating = false;

// On active la LED du bouton dès le départ
pwr.classList.add('active');

// Gestion du bouton Power
pwr.addEventListener('click', () => {
    isOn = !isOn;
    // Une fois qu'on a cliqué, les aiguilles sont autorisées à bouger
    isAnimating = true; 
    
    pwr.classList.toggle('active');
    vfd.style.opacity = isOn ? "1" : "0.1";
});

// Animation des aiguilles
function loop() {
    // Les aiguilles ne bougent QUE si l'appareil est ON ET que l'utilisateur a activé l'animation via le clic
    if (isOn && isAnimating) {
        nl.style.transform = `rotate(${-45 + Math.random() * 90}deg)`;
        nr.style.transform = `rotate(${-45 + Math.random() * 90}deg)`;
    } else {
        // Position de repos (-55deg) au lancement et quand c'est OFF
        nl.style.transform = `rotate(-55deg)`;
        nr.style.transform = `rotate(-55deg)`;
    }
    setTimeout(loop, 120);
}

// Lancement de la boucle
loop();