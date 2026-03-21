/* =============================================================================
   VU-METER — McIntosh DAP
   File    : js/vu-meter.js
   Role    : Animates both VU-meter needles based on the audio level
             provided by the engine.
   Loading : include this file BEFORE script.js in the HTML:
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
       RESTING POSITION
       Angle (in degrees) of the needle when there is no audio signal.
       A negative value = needle leaning to the left (actual "0" position).
       Example: -55 → needle at rest at -55°
       ⚠️  Also update ANGLE_MAX if you change this value,
           as the total sweep = ANGLE_MAX - ANGLE_REST.
    ------------------------------------------------------------------------- */
    ANGLE_REST: -55,

    /* -------------------------------------------------------------------------
       MAXIMUM SWEEP
       Additional degrees the needle can travel from ANGLE_REST
       when the signal is at maximum (full power).
       Example: 110 → the needle can reach up to -55 + 110 = +55°
       ↑ Increase → needle goes higher at full volume
       ↓ Decrease → needle stays lower even at high volume
    ------------------------------------------------------------------------- */
    ANGLE_MAX: 110,

    /* -------------------------------------------------------------------------
       SIGNAL AMPLIFICATION (boost)
       Multiplier applied to the raw audio level before any calculation.
       The raw engine level ranges from 0 to ~72. This boost scales it to a
       usable range (0–255) for files with low dynamic range.
       Example: 3.5 → multiplies the raw level by 3.5
       ↑ Increase → needles more reactive, move more on quiet sounds
       ↓ Decrease → needles calmer, reserved for louder sounds
       Suggested values: 2.0 (subtle) — 3.5 (standard) — 6.0 (very sensitive)
    ------------------------------------------------------------------------- */
    SIGNAL_BOOST: 3.5,

    /* -------------------------------------------------------------------------
       RESPONSE CURVE (exponent)
       Controls the shape of the curve between low and high signal levels.
       Formula: normalized_level ^ RESPONSE_CURVE
         < 1.0 → logarithmic curve: very sensitive to quiet sounds,
                 the needle moves a lot even at low volume (behavior
                 close to a real analog VU-meter)
         = 1.0 → linear curve: strictly proportional progression
         > 1.0 → exponential curve: the needle barely lifts
                 until volume is high
       Example: 0.7 → natural behavior, good low/high balance
       Suggested values: 0.4 (very log) — 0.7 (standard) — 1.0 (linear)
    ------------------------------------------------------------------------- */
    RESPONSE_CURVE: 0.7,

    /* -------------------------------------------------------------------------
       ATTACK SMOOTHING (active smoothing)
       Interpolation factor applied when audio is playing and the needle
       is rising toward its target.
       Formula: current_angle += (target - current) * SMOOTHING_ATTACK
         Close to 1.0 → near-instant response, very snappy needle
         Close to 0.0 → very slow response, sluggish needle
       Example: 0.35 → fast attack without being jerky
       Suggested values: 0.15 (slow) — 0.35 (standard) — 0.6 (snappy)
    ------------------------------------------------------------------------- */
    SMOOTHING_ATTACK: 0.35,

    /* -------------------------------------------------------------------------
       RELEASE SMOOTHING (return to rest)
       Interpolation factor applied when audio is paused/stopped and
       the needle slowly falls back to ANGLE_REST.
       Lower than SMOOTHING_ATTACK for a naturally slow return,
       like a real physical needle governed by its return spring.
       Example: 0.1 → slow and elegant return
       Suggested values: 0.03 (very slow) — 0.1 (standard) — 0.25 (fast)
    ------------------------------------------------------------------------- */
    SMOOTHING_RELEASE: 0.1,

};


/* =============================================================================
   ANIMATION LOGIC — do not modify unless you know what you are doing
   ============================================================================= */

/**
 * startVuMeter(engine, audio, nl, nr, getIsPoweredOn)
 *
 * Starts the VU-meter animation loop.
 *
 * @param {object}   engine          — McIntoshAudioEngine instance
 * @param {HTMLAudioElement} audio   — The main <audio> element
 * @param {Element}  needleL         — SVG/DOM element for the left needle (#needle-l)
 * @param {Element}  needleR         — SVG/DOM element for the right needle (#needle-r)
 * @param {Function} getIsPoweredOn  — Function that returns the power state (true/false)
 *                                     Using a function rather than a direct value ensures
 *                                     the latest state is always read from script.js.
 */
function startVuMeter(engine, audio, needleL, needleR, getIsPoweredOn) {

    // Current angles (internal animation state)
    // Initialized to ANGLE_REST to start from the resting position
    let currentAngleL = VU_METER_CONFIG.ANGLE_REST;
    let currentAngleR = VU_METER_CONFIG.ANGLE_REST;

    // Target angles calculated each frame from the audio level
    let targetAngleL  = VU_METER_CONFIG.ANGLE_REST;
    let targetAngleR  = VU_METER_CONFIG.ANGLE_REST;

    /* -----------------------------------------------------------------------
       Main loop — called ~60 times per second via requestAnimationFrame
    ----------------------------------------------------------------------- */
    function animate() {
        requestAnimationFrame(animate);

        const levels = engine.getLevels(); // { left: 0–72, right: 0–72 }

        if (!audio.paused && getIsPoweredOn()) {
            /* -----------------------------------------------------------------
               TARGET ANGLE CALCULATION
               Full formula:
                 1. levels.left * SIGNAL_BOOST         → amplify the raw signal
                 2. Math.min(255, ...)                 → clamp: never exceeds 255
                 3. / 255                              → normalize to [0 ; 1]
                 4. Math.pow(..., RESPONSE_CURVE)      → apply the response curve
                 5. * ANGLE_MAX                        → convert to degrees
                 6. + ANGLE_REST                       → offset from resting position
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
               ATTACK SMOOTHING (linear interpolation toward target)
               The needle does not jump directly to targetAngle;
               it approaches it gradually each frame.
            ----------------------------------------------------------------- */
            currentAngleL += (targetAngleL - currentAngleL) * VU_METER_CONFIG.SMOOTHING_ATTACK;
            currentAngleR += (targetAngleR - currentAngleR) * VU_METER_CONFIG.SMOOTHING_ATTACK;

        } else {
            /* -----------------------------------------------------------------
               RETURN TO REST (audio paused or device powered off)
               The needle slowly falls back to ANGLE_REST,
               like a physical needle pulled by its return spring.
            ----------------------------------------------------------------- */
            currentAngleL += (VU_METER_CONFIG.ANGLE_REST - currentAngleL) * VU_METER_CONFIG.SMOOTHING_RELEASE;
            currentAngleR += (VU_METER_CONFIG.ANGLE_REST - currentAngleR) * VU_METER_CONFIG.SMOOTHING_RELEASE;
        }

        // Apply calculated angles to the needle DOM elements
        if (needleL) needleL.style.transform = `rotate(${currentAngleL}deg)`;
        if (needleR) needleR.style.transform = `rotate(${currentAngleR}deg)`;
    }

    // Start the loop
    animate();
}
