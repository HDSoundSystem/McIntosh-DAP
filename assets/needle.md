

```javascript
targetAngleL = -55 + Math.pow(Math.min(255, levels.left * 1.8) / 255, 0.7) * 95;
```

- **`1.8`** → amplification du signal brut (boost d'entrée)
- **`0.7`** → exposant de la courbe (< 1 = plus sensible dans les bas niveaux)
- **`95`** → amplitude maximale en degrés de rotation
- **`0.25`** → lissage (smoothing) — plus bas = plus réactif

Pour **augmenter la sensibilité** 

| Paramètre | Valeur actuelle | Effet |
|---|---|---|
| `1.8` (boost) | moyen | Amplifie le signal brut avant calcul |
| `0.7` (exposant) | léger | Courbe de réponse — < 1 = sensible aux bas niveaux |
| `95` (amplitude max) | °de rotation max | Débattement physique de l'aiguille |
| `0.25` (smoothing) | lissage montée | Plus bas = plus nerveux |Les 4 changements dans `script.js` :

| Paramètre | Avant | Après | Effet |
|---|---|---|---|
| **Boost signal** | `1.8` | `3.5` | L'aiguille réagit bien plus aux morceaux calmes |
| **Exposant courbe** | `0.7` | `0.5` | Encore plus sensible aux bas niveaux |
| **Amplitude max** | `95°` | `110°` | Plus grand débattement physique |
| **Smoothing montée** | `0.25` | `0.35` | Réponse plus nerveuse et vive |
