// Component Loader - Loads all HTML components
class ComponentLoader {
    constructor() {
        this.components = [
            { file: 'components/meter-section.html' },
            { file: 'components/display-area.html' },
            { file: 'components/controls.html' },
            { file: 'components/options-menu.html' },
            { file: 'components/info.html' },
            { file: 'components/drop.html' }
        ];
        this.modalsComponent = { file: 'components/modals.html' };
    }

    async loadComponent(file) {
        try {
            console.log(`📥 Loading ${file}...`);
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            console.log(`✅ ${file} loaded (${content.length} characters)`);
            return content;
        } catch (error) {
            console.error(`❌ Error loading component ${file}:`, error);
            return '';
        }
    }

    async loadAll() {
        console.log('🚀 Starting component loading...');
        const panel = document.getElementById('amplifier-panel');
        if (panel) {
            let allContent = '';
            for (const component of this.components) {
                const content = await this.loadComponent(component.file);
                if (content) {
                    allContent += content;
                    console.log(`✅ ${component.file} added`);
                }
            }
            panel.innerHTML = allContent;
            console.log(`✅ All components injected into amplifier-panel`);
        } else {
            console.error(`❌ Element #amplifier-panel not found in DOM`);
        }

        const modalsSection = document.getElementById('modals-section');
        if (modalsSection) {
            const modalsContent = await this.loadComponent(this.modalsComponent.file);
            modalsSection.innerHTML = modalsContent;
            console.log(`✅ ${this.modalsComponent.file} injected into modals-section`);
        }

        console.log('✅ All components loaded');

        document.dispatchEvent(new Event('componentsLoaded'));
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 DOM loaded, initializing components...');
    const loader = new ComponentLoader();
    await loader.loadAll();
});
