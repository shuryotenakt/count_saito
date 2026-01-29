// ★ここにあなたのGASのURLを貼り付ける
const GAS_URL = "https://script.google.com/macros/s/AKfycbxhLQNTkg8TqDoJjyQoqqRyGFfjgUwxG6YD0OTl-iXW3IWgc5HdId8dC5GxXANM4hhFeQ/exec";

// --- タイピング演出 ---
const titleElement = document.getElementById('typing-title');
const lines = ["THANKS", "FOR", "VISITING"];
let lineIdx = 0, charIdx = 0;
function typeLine() {
    if (lineIdx < lines.length) {
        if (charIdx < lines[lineIdx].length) {
            titleElement.innerHTML += lines[lineIdx].charAt(charIdx++);
            setTimeout(typeLine, 120);
        } else {
            titleElement.innerHTML += "<br>"; lineIdx++; charIdx = 0;
            setTimeout(typeLine, 600);
        }
    }
}
window.addEventListener('load', typeLine);

// --- 必須項目チェック（ボタン有効化） ---
const submitBtn = document.getElementById('submit-btn');
const form = document.getElementById('attendance-form');
function checkFormValidity() {
    const formData = new FormData(form);
    const category = formData.get('category');
    const college = formData.get('college');
    const generalDetail = formData.get('generalDetail');
    let isValid = false;
    if (category) {
        if (['在校生', '卒業生', '入学予定・受験予定', '保護者'].includes(category)) isValid = !!college;
        else if (category === '一般') isValid = !!generalDetail;
        else isValid = true;
    }
    submitBtn.disabled = !isValid;
}
form.addEventListener('change', checkFormValidity);

// --- 表示切り替え ---
const categoryRadios = document.getElementsByName('category');
const collegeSection = document.getElementById('college-section');
const collegeGuide = document.getElementById('college-guide');
const generalSection = document.getElementById('general-section');
const collegeRadios = document.getElementsByName('college');
const generalRadios = document.getElementsByName('generalDetail');

categoryRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        const val = radio.value;
        const needsCollege = ['在校生', '卒業生', '入学予定・受験予定', '保護者'].includes(val);
        
        collegeSection.style.display = needsCollege ? 'block' : 'none';
        if (needsCollege) {
            const guides = {
                '在校生': "所属カレッジを選択してください",
                '卒業生': "卒業したときのカレッジを<br>選択してください",
                '入学予定・受験予定': "これから入学したいと考えてる<br>カレッジを選択してください",
                '保護者': "お子様の在籍カレッジを<br>選択してください"
            };
            collegeGuide.innerHTML = guides[val];
        } else {
            collegeRadios.forEach(r => r.checked = false);
        }

        generalSection.style.display = (val === '一般') ? 'block' : 'none';
        if (val !== '一般') generalRadios.forEach(r => r.checked = false);
    });
});

// --- 送信処理 ---
form.addEventListener('submit', function(e) {
    e.preventDefault();
    submitBtn.innerText = "RECORDING..."; submitBtn.disabled = true;
    const formData = new FormData(this);
    const url = `${GAS_URL}?category=${encodeURIComponent(formData.get('category'))}&college=${encodeURIComponent(formData.get('college')||"")}&generalDetail=${encodeURIComponent(formData.get('generalDetail')||"")}`;
    fetch(url, { method: 'POST', mode: 'no-cors' }).catch(console.error);
    const popup = document.getElementById('cert-popup');
    popup.style.display = 'flex';
    initFireworks();
    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
            document.querySelector('.registration-area').style.display = 'none';
            document.getElementById('survey-area').style.display = 'block';
        }, 500);
    }, 4000);
});

document.getElementById('cert-tap-area').addEventListener('click', () => document.getElementById('image-modal').style.display = 'flex');
document.getElementById('close-image-modal').addEventListener('click', () => document.getElementById('image-modal').style.display = 'none');

// --- 花火 ---
function initFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    let particles = [];
    function animate() {
        if (document.getElementById('cert-popup').style.display === 'none') return;
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (Math.random() < 0.1) {
            const x = Math.random() * canvas.width, y = Math.random() * canvas.height * 0.5;
            for (let i = 0; i < 30; i++) particles.push(new (function(){
                this.x=x; this.y=y; this.color=['#00ff41','#ffffff','#adff2f'][Math.floor(Math.random()*3)];
                this.vx=(Math.random()-0.5)*10; this.vy=(Math.random()-0.5)*10; this.alpha=1;
                this.update=function(){this.vx*=0.95;this.vy*=0.95;this.x+=this.vx;this.y+=this.vy;this.alpha-=0.01;}
                this.draw=function(){ctx.globalAlpha=this.alpha;ctx.beginPath();ctx.arc(this.x,this.y,2,0,Math.PI*2);ctx.fillStyle=this.color;ctx.fill();}
            })());
        }
        particles.forEach((p, i) => { p.alpha > 0 ? (p.update(), p.draw()) : particles.splice(i, 1); });
    }
    animate();
}