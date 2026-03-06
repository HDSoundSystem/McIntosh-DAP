/* =============================================================================
   VU-METER — McIntosh DAP
   Fichier : js/vu-meter.js
   Rôle    : Anime les deux aiguilles des VU-mètres analogiques en fonction
             du niveau audio fourni par l'engine.
   Chargement : inclure ce fichier AVANT script.js dans le HTML :
                <script src="js/vu-meter.js"></script>
   ============================================================================= */


/* -----------------------------------------------------------------------------
   ██████╗  █████╗ ██████╗  █████╗ ███╗   ███╗███████╗████████╗██████╗ ███████╗
   ██╔══██╗██╔══██╗██╔══██╗██╔══██╗████╗ ████║██╔════╝╚══██╔══╝██╔══██╗██╔════╝
   ██████╔╝███████║██████╔╝███████║██╔████╔██║█████╗     ██║   ██████╔╝█████╗
   ██╔═══╝ ██╔══██║██╔══██╗██╔══██║██║╚██╔╝██║██╔══╝     ██║   ██╔══██╗██╔══╝
   ██║     ██║  ██║██║  ██║██║  ██║██║ ╚═╝ ██║███████╗   ██║   ██║  ██║███████╗
   ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
   ----------------------------------------------------------------------------- */

const VU_METER_CONFIG = {

    /* -------------------------------------------------------------------------
       POSITION DE REPOS
       Angle (en degrés) de l'aiguille quand il n'y a aucun signal audio.
       Une valeur négative = aiguille penchée vers la gauche (position "0" réelle).
       Exemple : -55 → aiguille au repos à -55°
       ⚠️  Modifier aussi ANGLE_MAX si vous changez cette valeur,
           car l'amplitude totale = ANGLE_MAX - ANGLE_REST.
    ------------------------------------------------------------------------- */
    ANGLE_REST: -55,

    /* -------------------------------------------------------------------------
       AMPLITUDE MAXIMALE
       Degrés supplémentaires que l'aiguille peut parcourir depuis ANGLE_REST
       quand le signal est au maximum (pleine puissance).
       Exemple : 110 → l'aiguille peut aller jusqu'à -55 + 110 = +55°
       ↑ Augmenter → l'aiguille monte plus haut à plein volume
       ↓ Diminuer  → l'aiguille reste plus basse même à fort volume
    ------------------------------------------------------------------------- */
    ANGLE_MAX: 110,

    /* -------------------------------------------------------------------------
       AMPLIFICATION DU SIGNAL (boost)
       Multiplicateur appliqué au niveau audio brut avant tout calcul.
       Le niveau brut de l'engine va de 0 à ~72. Ce boost le ramène à une
       plage utilisable (0-255) pour les fichiers peu dynamiques.
       Exemple : 3.5 → multiplie le niveau brut par 3.5
       ↑ Augmenter → aiguilles plus réactives, bougent plus sur les sons faibles
       ↓ Diminuer  → aiguilles plus calmes, réservées aux sons forts
       Valeurs conseillées : 2.0 (discret) — 3.5 (standard) — 6.0 (très sensible)
    ------------------------------------------------------------------------- */
    SIGNAL_BOOST: 3.5,

    /* -------------------------------------------------------------------------
       COURBE DE RÉPONSE (exposant)
       Contrôle la forme de la courbe entre signal faible et signal fort.
       Formule : niveau_normalisé ^ RESPONSE_CURVE
         < 1.0 → courbe logarithmique : très sensible aux sons faibles,
                 l'aiguille bouge beaucoup même à bas volume (comportement
                 proche d'un vrai VU-mètre analogique)
         = 1.0 → courbe linéaire : progression strictement proportionnelle
         > 1.0 → courbe exponentielle : l'aiguille ne décolle vraiment
                 qu'aux volumes élevés
       Exemple : 0.7 → comportement naturel, bon compromis faible/fort
       Valeurs conseillées : 0.4 (très log) — 0.7 (standard) — 1.0 (linéaire)
    ------------------------------------------------------------------------- */
    RESPONSE_CURVE: 0.7,

    /* -------------------------------------------------------------------------
       INERTIE DE MONTÉE (lissage actif)
       Facteur d'interpolation appliqué quand l'audio joue et que l'aiguille
       monte vers sa cible.
       Formule : angle_actuel += (cible - actuel) * SMOOTHING_ATTACK
         Proche de 1.0 → réponse quasi-instantanée, aiguille très nerveuse
         Proche de 0.0 → réponse très lente, aiguille paresseuse
       Exemple : 0.35 → montée rapide mais pas saccadée
       Valeurs conseillées : 0.15 (lent) — 0.35 (standard) — 0.6 (vif)
    ------------------------------------------------------------------------- */
    SMOOTHING_ATTACK: 0.35,

    /* -------------------------------------------------------------------------
       INERTIE DE RETOUR AU REPOS (lissage inactif)
       Facteur d'interpolation appliqué quand l'audio est en pause/stop et
       que l'aiguille revient doucement vers ANGLE_REST.
       Plus faible que SMOOTHING_ATTACK pour un retour naturellement lent,
       comme une vraie aiguille physique soumise à la gravité.
       Exemple : 0.1 → retour lent et élégant
       Valeurs conseillées : 0.03 (très lent) — 0.1 (standard) — 0.25 (rapide)
    ------------------------------------------------------------------------- */
    SMOOTHING_RELEASE: 0.1,

};


/* =============================================================================
   LOGIQUE D'ANIMATION — ne pas modifier sauf si vous savez ce que vous faites
   ============================================================================= */

/**
 * startVuMeter(engine, audio, nl, nr, getIsPoweredOn)
 *
 * Lance la boucle d'animation des VU-mètres.
 *
 * @param {object}   engine          — Instance de McIntoshAudioEngine
 * @param {HTMLAudioElement} audio   — L'élément <audio> principal
 * @param {Element}  needleL         — L'élément SVG/DOM de l'aiguille gauche (#needle-l)
 * @param {Element}  needleR         — L'élément SVG/DOM de l'aiguille droite (#needle-r)
 * @param {Function} getIsPoweredOn  — Fonction qui retourne l'état d'alimentation (true/false)
 *                                     Utiliser une fonction plutôt qu'une valeur directe permet
 *                                     de toujours lire la valeur à jour depuis script.js.
 */
function startVuMeter(engine, audio, needleL, needleR, getIsPoweredOn) {

    // Angles courants (état interne de l'animation)
    // Initialisés à ANGLE_REST pour partir de la position de repos
    let currentAngleL = VU_METER_CONFIG.ANGLE_REST;
    let currentAngleR = VU_METER_CONFIG.ANGLE_REST;

    // Angles cibles calculés à chaque frame à partir du niveau audio
    let targetAngleL  = VU_METER_CONFIG.ANGLE_REST;
    let targetAngleR  = VU_METER_CONFIG.ANGLE_REST;

    /* -----------------------------------------------------------------------
       Boucle principale — appelée ~60 fois par seconde via requestAnimationFrame
    ----------------------------------------------------------------------- */
    function animate() {
        requestAnimationFrame(animate);

        const levels = engine.getLevels(); // { left: 0–72, right: 0–72 }

        if (!audio.paused && getIsPoweredOn()) {
            /* -----------------------------------------------------------------
               CALCUL DE L'ANGLE CIBLE
               Formule complète :
                 1. levels.left * SIGNAL_BOOST         → amplification du signal brut
                 2. Math.min(255, ...)                 → écrêtage : on ne dépasse pas 255
                 3. / 255                              → normalisation en [0 ; 1]
                 4. Math.pow(..., RESPONSE_CURVE)      → application de la courbe de réponse
                 5. * ANGLE_MAX                        → conversion en degrés
                 6. + ANGLE_REST                       → décalage depuis la position de repos
            ----------------------------------------------------------------- */
            targetAngleL = VU_METER_CONFIG.ANGLE_REST
                + Math.pow(
                    Math.min(255, levels.left  * VU_METER_CONFIG.SIGNAL_BOOST) / 255,
                    VU_METER_CONFIG.RESPONSE_CURVE
                ) * VU_METER_CONFIG.ANGLE_MAX;

            targetAngleR = VU_METER_CONFIG.ANGLE_REST
                + Math.pow(
                    Math.min(255, levels.right * VU_METER_CONFIG.SIGNAL_BOOST) / 255,
                    VU_METER_CONFIG.RESPONSE_CURVE
                ) * VU_METER_CONFIG.ANGLE_MAX;

            /* -----------------------------------------------------------------
               LISSAGE DE MONTÉE (interpolation linéaire vers la cible)
               L'aiguille ne saute pas directement à targetAngle,
               elle s'en approche progressivement à chaque frame.
            ----------------------------------------------------------------- */
            currentAngleL += (targetAngleL - currentAngleL) * VU_METER_CONFIG.SMOOTHING_ATTACK;
            currentAngleR += (targetAngleR - currentAngleR) * VU_METER_CONFIG.SMOOTHING_ATTACK;

        } else {
            /* -----------------------------------------------------------------
               RETOUR AU REPOS (audio pausé ou appareil éteint)
               L'aiguille retombe doucement vers ANGLE_REST,
               comme une aiguille physique soumise à son ressort.
            ----------------------------------------------------------------- */
            currentAngleL += (VU_METER_CONFIG.ANGLE_REST - currentAngleL) * VU_METER_CONFIG.SMOOTHING_RELEASE;
            currentAngleR += (VU_METER_CONFIG.ANGLE_REST - currentAngleR) * VU_METER_CONFIG.SMOOTHING_RELEASE;
        }

        // Application des angles calculés aux éléments DOM des aiguilles
        if (needleL) needleL.style.transform = `rotate(${currentAngleL}deg)`;
        if (needleR) needleR.style.transform = `rotate(${currentAngleR}deg)`;
    }

    // Démarrage de la boucle
    animate();
}
