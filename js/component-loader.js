// Component Loader - Charge tous les composants HTML
class ComponentLoader {
    constructor() {
        this.components = [
            { file: 'components/meter-section.html' },
            { file: 'components/display-area.html' },
            { file: 'components/controls.html' },
            { file: 'components/options-menu.html' }
        ];
        this.modalsComponent = { file: 'components/modals.html' };
    }

    async loadComponent(file) {
        try {
            console.log(`📥 Chargement de ${file}...`);
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            console.log(`✅ ${file} chargé (${content.length} caractères)`);
            return content;
        } catch (error) {
            console.error(`❌ Erreur de chargement du composant ${file}:`, error);
            return '';
        }
    }

    async loadAll() {
        console.log('🚀 Début du chargement des composants...');
        
        // Charger les composants principaux dans amplifier-panel
        const panel = document.getElementById('amplifier-panel');
        if (panel) {
            let allContent = '';
            for (const component of this.components) {
                const content = await this.loadComponent(component.file);
                if (content) {
                    allContent += content;
                    console.log(`✅ ${component.file} ajouté`);
                }
            }
            panel.innerHTML = allContent; // Injecter tout d'un coup sans wrappers
            console.log(`✅ Tous les composants injectés dans amplifier-panel`);
        } else {
            console.error(`❌ Element #amplifier-panel introuvable dans le DOM`);
        }
        
        // Charger les modals séparément
        const modalsSection = document.getElementById('modals-section');
        if (modalsSection) {
            const modalsContent = await this.loadComponent(this.modalsComponent.file);
            modalsSection.innerHTML = modalsContent;
            console.log(`✅ ${this.modalsComponent.file} injecté dans modals-section`);
        }
        
        console.log('✅ Tous les composants sont chargés');
        
        // Déclencher un événement personnalisé pour indiquer que les composants sont prêts
        document.dispatchEvent(new Event('componentsLoaded'));
    }
}

// Charger les composants au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 DOM chargé, initialisation des composants...');
    const loader = new ComponentLoader();
    await loader.loadAll();
});
