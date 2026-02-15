// Component Loader - Loads all HTML components
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

        // Load the main components into the amplifier panel
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
            panel.innerHTML = allContent; // Inject all at once without wrappers
            console.log(`✅ All components injected into amplifier-panel`);
        } else {
            console.error(`❌ Element #amplifier-panel not found in DOM`);
        }

        // Load the modals separately
        const modalsSection = document.getElementById('modals-section');
        if (modalsSection) {
            const modalsContent = await this.loadComponent(this.modalsComponent.file);
            modalsSection.innerHTML = modalsContent;
            console.log(`✅ ${this.modalsComponent.file} injected into modals-section`);
        }

        console.log('✅ All components loaded');

        // Trigger a custom event to indicate that the components are ready
        document.dispatchEvent(new Event('componentsLoaded'));
    }
}

// Load components when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 DOM loaded, initializing components...');
    const loader = new ComponentLoader();
    await loader.loadAll();
});
