const paginas = [
  'https://google.com',
  'https://openai.com',
  'https://github.com',
  'https://youtu.be/dQw4w9WgXcQ',
];

const boton = document.getElementById('randomBtn');
const clickSound = new Audio('assets/click.mp3');
const fondoMusica = new Audio('assets/fondo.mp3');
fondoMusica.loop = true;
fondoMusica.volume = 0.3;

let musicaIniciada = false;

boton.addEventListener('click', () => {
  if (!musicaIniciada) {
    fondoMusica.play().catch(e => console.log("AutoPlay bloqueado"));
    musicaIniciada = true;
  }

  clickSound.play();

  setTimeout(() => {
    const randomURL = paginas[Math.floor(Math.random() * paginas.length)];
    window.location.href = randomURL;
  }, 300);
});

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let repel = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('click', () => {
  repel = true;
  setTimeout(() => { repel = false; }, 300);
});

window.addEventListener('deviceorientation', e => {
  const tiltX = e.gamma;
  const tiltY = e.beta;
  mouse.x = window.innerWidth / 2 + tiltX * 15;
  mouse.y = window.innerHeight / 2 + tiltY * 15;
}, true);

for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 200;

    if (distance < maxDist) {
      const angle = Math.atan2(dy, dx);
      const force = (maxDist - distance) / maxDist;

      if (repel) {
        p.x -= Math.cos(angle) * force * 10;
        p.y -= Math.sin(angle) * force * 10;
      } else {
        p.x += Math.cos(angle) * force * 1.5;
        p.y += Math.sin(angle) * force * 1.5;
      }
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();
