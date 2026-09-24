// Inicializador do Lucide Icons para renderização de ícones no DOM

export function renderIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
