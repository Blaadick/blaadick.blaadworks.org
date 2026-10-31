export function setupCycleToggle(id: string, key: string, states: string[], apply: (state: string) => void) {
    const button = document.getElementById(id)!;
    const stored = localStorage.getItem(key);
    let state = stored && states.includes(stored) ? stored : states[0];

    function update() {
        for(const icon of button.querySelectorAll<HTMLElement | SVGElement>('[data-icon]')) {
            icon.style.display = icon.dataset.icon === state ? '' : 'none';
        }
        apply(state);
    }

    button.addEventListener('click', () => {
        state = states[(states.indexOf(state) + 1) % states.length];
        localStorage.setItem(key, state);
        update();
    });

    update();
}
