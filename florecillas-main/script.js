// Configuración Inicial de la Escena 3D
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020208, 0.0015);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 300, 600);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 600;
controls.minDistance = 20;

// Textura 1: Flor Amarilla (Girasol/Flor detallada)
function createFlowerTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    const cx = 64, cy = 64;
    const petals = 12;
    
    // Dibujar Pétalos
    ctx.fillStyle = '#FFD700';
    for (let i = 0; i < petals; i++) {
        const angle = (i * Math.PI * 2) / petals;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, 35, 10, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    // Centro de la Flor
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
}

// Textura 2: Carteles con Textos Bonitos
const mensajes = ["Te amo ❤️", "Eres mi vida 🌻", "Te quiero ✨", "Mi persona favorita 💖", "Siempre juntos 💛", "Eres increíble 🌸", "Mi lugar feliz 🌟"];

function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.font = 'Bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Sombra brillante
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, 128, 32);

    return new THREE.CanvasTexture(canvas);
}

const flowerTexture = createFlowerTexture();

// 1. GALAXIA DE FLORES AMARILLAS
const particleCount = 2000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    const radius = Math.random() * 350 + 10;
    const spinAngle = radius * 0.015;
    const branchAngle = ((i % 5) * Math.PI * 2) / 5;

    const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 40;
    const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 40;
    const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 40;

    positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i * 3 + 1] = randomY;
    positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
    size: 16,
    map: flowerTexture,
    transparent: true,
    alphaTest: 0.1,
    depthWrite: false
});

const galaxy = new THREE.Points(geometry, material);
scene.add(galaxy);

// 2. TEXTOS FLOTANTES SOBRE LAS FLORES
const textGroup = new THREE.Group();

for (let i = 0; i < 60; i++) {
    const randomText = mensajes[Math.floor(Math.random() * mensajes.length)];
    const textTex = createTextTexture(randomText);
    const spriteMat = new THREE.SpriteMaterial({ map: textTex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);

    const radius = Math.random() * 300 + 20;
    const angle = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 80;

    sprite.position.set(Math.cos(angle) * radius, y + 15, Math.sin(angle) * radius);
    sprite.scale.set(30, 7.5, 1);

    textGroup.add(sprite);
}
scene.add(textGroup);

// Animación de Entrada
let introProgress = 0;
const targetCameraPosition = new THREE.Vector3(0, 50, 160);

function animate() {
    requestAnimationFrame(animate);

    if (introProgress < 1) {
        introProgress += 0.008;
        camera.position.lerp(targetCameraPosition, 0.02);
    } else {
        controls.update();
    }

    // Rotación suave de la galaxia y textos
    galaxy.rotation.y += 0.001;
    textGroup.rotation.y += 0.001;

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function toggleLetter() {
    const modal = document.getElementById('letter-modal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

function toggleMusic() {
    if (music.paused) {
        music.play();
        musicBtn.innerText = '⏸️ Pausar Música';
    } else {
        music.pause();
        musicBtn.innerText = '🎵 Reproducir Música';
    }
}

function startExperience() {
    const welcomeScreen = document.getElementById('welcome-screen');
    
    welcomeScreen.style.opacity = '0';
    welcomeScreen.style.visibility = 'hidden';

    music.play().then(() => {
        musicBtn.innerText = '⏸️ Pausar Música';
    }).catch(e => console.log("Error de reproducción de audio:", e));
}