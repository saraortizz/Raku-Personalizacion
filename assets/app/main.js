document.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('intro');
    const introVideo = document.getElementById('introVideo');
    const app = document.getElementById('app');
    const rakuImg = document.getElementById('raku');
    const colorList = document.getElementById('colorList');
    const addonList = document.getElementById('addonList');
    const accessoryLayer = document.getElementById('accessoryLayer');
    function setRakuColor(color) {
        const src = `assets/img/raku_${color}.png`;
        rakuImg.src = src;
        if (color === 'magenta') document.documentElement.style.setProperty('--accent', '#FA1438');
        if (color === 'azul') document.documentElement.style.setProperty('--accent', '#85EFD3');
        if (color === 'amarillo') document.documentElement.style.setProperty('--accent', '#FFEF94');
        if (color === 'cielo') document.documentElement.style.setProperty('--accent', '#C4D9EF');
        if (color === 'aqua') document.documentElement.style.setProperty('--accent', '#00A6A3');
        if (color === 'naranja') document.documentElement.style.setProperty('--accent', '#FF6100');
    }
    colorList.addEventListener('click', e => {
        const btn = e.target.closest('.color-item');
        if (!btn) return;
        document.querySelectorAll('.color-item').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const color = btn.dataset.color;
        setRakuColor(color);
        btn.animate([{ transform: 'scale(1.02)' }, { transform: 'scale(1)' }], { duration: 180 });
    });

    const addonFile = {
        gorra: 'gorra.svg',
        sombrero: 'sombrero.svg',
        pestanas: 'pestanas.svg',
        pajarita: 'pajarita.svg'
    };


    const addonPlacement = {
        sombrero: { width: '35%', left: '-10%', top: '-10%' },
        gorra: { width: '30%', left: '-2.3%', top: '-5%' },
        pestanas: { width: '53%', left: '42%', top: '74%' },
        pajarita: { width: '18%', left: '58%', top: '93%' }
    };

    function getAddonPlacement(name) {
        return addonPlacement[name] || { width: '48%', left: '26%', top: '14%' };
    }

    function applyAddonPlacement(img, name) {
        const p = getAddonPlacement(name);
        // Usamos porcentajes CSS puros relativos al raku-wrap.
        // En Safari iOS los porcentajes en position:absolute son relativos
        // al containing block (raku-wrap), que es correcto.
        // Evitamos cualquier cálculo con getBoundingClientRect aquí
        // porque en dispositivos reales puede haber discrepancias con
        // el zoom de accesibilidad del sistema y la barra de Safari.
        img.style.width = p.width;
        img.style.left = p.left;
        img.style.top = p.top;
    }

    function placeAddon(name) {
        const img = document.createElement('img');
        img.alt = name;
        img.dataset.addon = name;
        img.style.position = 'absolute';
        img.style.height = 'auto';
        img.style.pointerEvents = 'none';
        // Aplicamos el posicionamiento ANTES de añadir al DOM
        // para que Safari no haga un layout intermedio sin posición
        applyAddonPlacement(img, name);
        accessoryLayer.appendChild(img);
        // Asignamos src después para que el onload dispare
        // con el elemento ya en el DOM y con su posición definida.
        // Esto evita el "salto" en Safari iOS real cuando el img
        // se redimensiona al cargarse.
        img.onload = () => {
            // Re-aplicamos el posicionamiento tras cargar para corregir
            // cualquier recalculo que Safari haya hecho durante la carga
            applyAddonPlacement(img, name);
        };
        img.src = `assets/img/${addonFile[name]}`;
    }

    addonList.addEventListener('click', e => {
        const btn = e.target.closest('.addon-item');
        if (!btn) return;
        const name = btn.dataset.addon;
        const active = btn.classList.toggle('active');
        const existing = accessoryLayer.querySelector(`[data-addon="${name}"]`);
        if (active && (name === 'gorra' || name === 'sombrero')) {
            const other = name === 'gorra' ? 'sombrero' : 'gorra';
            const otherBtn = document.querySelector(`.addon-item[data-addon="${other}"]`);
            if (otherBtn && otherBtn.classList.contains('active')) {
                otherBtn.classList.remove('active');
                const otherExisting = accessoryLayer.querySelector(`[data-addon="${other}"]`);
                if (otherExisting) otherExisting.remove();
            }
        }
        if (active && !existing) {
            placeAddon(name);
        } else if (!active && existing) {
            existing.remove();
        }
    });
    function initAddonButtons() {
        document.querySelectorAll('.addon-item').forEach(item => {
            const itemImg = item.querySelector('img');
            const itemName = item.dataset.addon;
            if (itemImg && addonFile[itemName]) {
                itemImg.src = `assets/img/${addonFile[itemName]}`;
            }
        });
    }
    const finalizeBtn = document.getElementById('finalizeBtn');
    const bgList = document.getElementById('bgList');

    const bgColors = [
        { key: 'negro', dark: '#000000', light: '#000000' },
        { key: 'magenta', dark: '#CB0020', light: '#FA1438' },
        { key: 'azul', dark: '#22D4A5', light: '#85EFD3' },
        { key: 'amarillo', dark: '#EFC910', light: '#FFEF94' },
        { key: 'cielo', dark: '#76AEE7', light: '#C4D9EF' },
        { key: 'aqua', dark: '#00827F', light: '#00A6A3' },
        { key: 'naranja', dark: '#E45701', light: '#FF6100' }
    ];

    function getBackgroundColor(colors) {
        return colors.light;
    }

    function brightness(hex) {
        const clean = hex.replace('#', '');
        const r = parseInt(clean.substr(0, 2), 16);
        const g = parseInt(clean.substr(2, 2), 16);
        const b = parseInt(clean.substr(4, 2), 16);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function applyBackground(colors) {
        const backgroundColor = getBackgroundColor(colors);
        document.documentElement.style.setProperty('--main-bg', backgroundColor);
        const textLight = brightness(colors.light) > 180;
        document.documentElement.style.setProperty('--text-main', textLight ? '#111' : '#fff');
        document.documentElement.style.setProperty('--text-muted', textLight ? '#333' : '#b0b0b0');
    }

    function populateBgOptions() {
        bgList.innerHTML = '';
        bgColors.forEach(item => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'bg-item';
            button.dataset.color = item.key;
            button.style.background = getBackgroundColor(item);
            button.addEventListener('click', () => {
                document.querySelectorAll('.bg-item').forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                applyBackground(item);
            });
            bgList.appendChild(button);
        });
        const first = bgList.querySelector('.bg-item');
        if (first) first.click();
    }

    function loadImage(src) {
        return new Promise(resolve => {
            const image = new Image();
            image.crossOrigin = 'anonymous';
            image.onload = () => resolve(image);
            image.onerror = () => resolve(null);
            image.src = src;
        });
    }

    async function downloadCurrentPreview() {
        const size = 520;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const activeButton = document.querySelector('.bg-item.active');
        const selected = bgColors.find(item => item.key === activeButton?.dataset.color) || bgColors[0];
        ctx.fillStyle = getBackgroundColor(selected);
        ctx.fillRect(0, 0, size, size);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(25, 0);
        ctx.lineTo(size - 25, 0);
        ctx.quadraticCurveTo(size, 0, size, 25);
        ctx.lineTo(size, size - 25);
        ctx.quadraticCurveTo(size, size, size - 25, size);
        ctx.lineTo(25, size);
        ctx.quadraticCurveTo(0, size, 0, size - 25);
        ctx.lineTo(0, 25);
        ctx.quadraticCurveTo(0, 0, 25, 0);
        ctx.closePath();
        ctx.clip();

        const visibleRects = [rakuImg, ...accessoryLayer.querySelectorAll('img')]
            .map(element => element.getBoundingClientRect())
            .filter(rect => rect.width > 0 && rect.height > 0);
        const bounds = visibleRects.reduce((area, rect) => ({
            left: Math.min(area.left, rect.left),
            top: Math.min(area.top, rect.top),
            right: Math.max(area.right, rect.right),
            bottom: Math.max(area.bottom, rect.bottom)
        }), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });

        const contentWidth = bounds.right - bounds.left;
        const contentHeight = bounds.bottom - bounds.top;
        const cropSize = Math.max(contentWidth, contentHeight) * 1.12;
        const cropLeft = bounds.left + contentWidth / 2 - cropSize / 2;
        const cropTop = bounds.top + contentHeight / 2 - cropSize / 2;
        const outputScale = size / cropSize;

        const raku = await loadImage(rakuImg.src);
        if (raku) {
            const rakuRect = rakuImg.getBoundingClientRect();
            ctx.drawImage(raku,
                (rakuRect.left - cropLeft) * outputScale,
                (rakuRect.top - cropTop) * outputScale,
                rakuRect.width * outputScale,
                rakuRect.height * outputScale
            );
        }

        const accessories = Array.from(accessoryLayer.querySelectorAll('img'));
        for (const accessory of accessories) {
            const asset = await loadImage(accessory.src);
            if (!asset) continue;
            const accessoryRect = accessory.getBoundingClientRect();
            ctx.drawImage(asset,
                (accessoryRect.left - cropLeft) * outputScale,
                (accessoryRect.top - cropTop) * outputScale,
                accessoryRect.width * outputScale,
                accessoryRect.height * outputScale
            );
        }

        ctx.restore();
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'Tu Raku.png';
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    finalizeBtn.addEventListener('click', downloadCurrentPreview);
    populateBgOptions();
    function showApp() {
        intro.classList.add('hidden');
        app.classList.remove('hidden');
        app.style.opacity = 0;
        requestAnimationFrame(() => {
            app.style.transition = 'opacity .36s ease';
            app.style.opacity = 1;
        });
    }

    if (introVideo && introVideo.readyState !== 0) {
        introVideo.addEventListener('ended', showApp);
        intro.addEventListener('click', () => { if (!intro.classList.contains('hidden')) showApp(); });
    } else {
        setTimeout(showApp, 800);
    }
    setRakuColor('magenta');
    initAddonButtons();
});