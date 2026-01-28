const GAS_URL = "https://script.google.com/macros/s/AKfycbxhLQNTkg8TqDoJjyQoqqRyGFfjgUwxG6YD0OTl-iXW3IWgc5HdId8dC5GxXANM4hhFeQ/exec";

// --- タイピング演出 ---
const titleElement = document.getElementById('typing-title');
const lines = ["THANKS", "FOR", "VISITING"];
let lineIdx = 0; let charIdx = 0;

function typeLine() {
    if (lineIdx < lines.length) {
        if (charIdx < lines[lineIdx].length) {
            titleElement.innerHTML += lines[lineIdx].charAt(charIdx); charIdx++;
            setTimeout(typeLine, 120);
        } else {
            titleElement.innerHTML += "<br>"; lineIdx++; charIdx = 0;
            setTimeout(typeLine, 600);
        }
    }
}
window.addEventListener('load', typeLine);

// --- ラジオボタン制御ロジック ---
const categoryRadios = document.getElementsByName('category');
const collegeSection = document.getElementById('college-section');
const collegeGuide = document.getElementById('college-guide');
const collegeRadios = document.getElementsByName('college');
const generalSection = document.getElementById('general-section');
const generalRadios = document.getElementsByName('generalDetail');

categoryRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        const needsCollege = ['在校生', '卒業生', '入学予定・受験予定', '保護者'].includes(radio.value);
        const isGeneral = (radio.value === '一般');
        if (needsCollege) {
            collegeSection.style.display = 'block';
            collegeRadios.forEach(r => r.required = true);
            if (radio.value === '在校生') collegeGuide.innerHTML = "所属カレッジを<br>選択してください";
            if (radio.value === '卒業生') collegeGuide.innerHTML = "卒業したときの<br>カレッジを選択してください";
            if (radio.value === '入学予定・受験予定') collegeGuide.innerHTML = "これから入学したいと考えてる<br>カレッジを選択してください";
            if (radio.value === '保護者') collegeGuide.innerHTML = "お子様の在籍カレッジを<br>選択してください";
        } else {
            collegeSection.style.display = 'none';
            collegeRadios.forEach(r => { r.checked = false; r.required = false; });
        }
        if (isGeneral) {
            generalSection.style.display = 'block';
            generalRadios.forEach(r => r.required = true);
        } else {
            generalSection.style.display = 'none';
            generalRadios.forEach(r => { r.checked = false; r.required = false; });
        }
    });
});

// --- 送信ロジック（爆速仕様） ---
document.getElementById('attendance-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerText = "RECORDING...";
    submitBtn.disabled = true;

    const formData = new FormData(this);
    const category = formData.get('category');
    const college = formData.get('college') || "";
    const generalDetail = formData.get('generalDetail') || "";
    const url = `${GAS_URL}?category=${encodeURIComponent(category)}&college=${encodeURIComponent(college)}&generalDetail=${encodeURIComponent(generalDetail)}`;

    fetch(url, { method: 'POST', mode: 'no-cors' }).catch(err => console.error(err));

    const popup = document.getElementById('cert-popup');
    popup.style.display = 'flex'; popup.style.opacity = '1';
    initFireworks();

    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
            document.querySelector('.registration-area').style.display = 'none';
            document.getElementById('survey-area').style.display = 'block';
        }, 500);
    }, 3000); 
});

document.getElementById('cert-tap-area').addEventListener('click', () => {
    document.getElementById('image-modal').style.display = 'flex';
});
document.getElementById('close-image-modal').addEventListener('click', () => {
    document.getElementById('image-modal').style.display = 'none';
});

// --- 花火の演出 ---
function initFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    let particles = []; const colors = ['#00ff41', '#ffffff', '#adff2f'];
    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y; this.color = color;
            this.velocity = { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 };
            this.alpha = 1; this.friction = 0.95;
        }
        draw() {
            ctx.globalAlpha = this.alpha; ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill();
        }
        update() {
            this.velocity.x *= this.friction; this.velocity.y *= this.friction;
            this.x += this.velocity.x; this.y += this.velocity.y;
            this.alpha -= 0.01;
        }
    }
    function animate() {
        if (document.getElementById('cert-popup').style.display === 'none') return;
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (Math.random() < 0.1) {
            const x = Math.random() * canvas.width; const y = Math.random() * canvas.height * 0.5;
            for (let i = 0; i < 30; i++) particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
        }
        particles.forEach((p, i) => { if (p.alpha > 0) { p.update(); p.draw(); } else { particles.splice(i, 1); } });
    }
    animate();
}