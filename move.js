// ここに発行されたURLを設定
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxhLQNTkg8TqDoJjyQoqqRyGFfjgUwxG6YD0OTl-iXW3IWgc5HdId8dC5GxXANM4hhFeQ/exec';

const form = document.getElementById('surveyForm');
const categorySelect = document.getElementById('category');
const submitBtn = document.getElementById('submitBtn');

function updateFormDisplay() {
    const selectedCategory = categorySelect.value;
    
    // 全て一旦非表示
    document.querySelectorAll('.conditional-section').forEach(el => {
        el.style.display = 'none';
    });

    if (selectedCategory) {
        // 満足度は必ず出す
        document.getElementById('section-satisfaction').style.display = 'block';

        // 区分別質問があれば出す
        const specificSection = document.getElementById('section-' + selectedCategory);
        if (specificSection) {
            specificSection.style.display = 'block';
        }
    }
    validateForm();
}

function validateForm() {
    const category = categorySelect.value;
    if (!category) {
        submitBtn.disabled = true;
        return;
    }

    const satisfaction = document.querySelector('[name="satisfaction"]').value;
    
    let isSpecificValid = true;
    // 高校生・企業・在校生の場合は追加の質問回答が必要
    if (['highschool', 'company', 'student'].includes(category)) {
        const specificInput = document.querySelector(`[name="${category}_info"]`);
        isSpecificValid = specificInput && specificInput.value !== "";
    }

    // 両方の条件を満たせばボタンを活性化
    submitBtn.disabled = !(satisfaction !== "" && isSpecificValid);
}

// フォーム内のすべての入力変化を監視
form.addEventListener('change', validateForm);

form.onsubmit = async function(e) {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.innerText = '送信中...';

    const formData = new FormData(this);
    const payload = Object.fromEntries(formData.entries());

    try {
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(payload)
        });

        // 完了表示
        document.getElementById('form-container').style.display = 'none';
        document.getElementById('thanks-message').style.display = 'block';
        
    } catch (error) {
        alert('エラーが発生しました。');
        submitBtn.disabled = false;
        submitBtn.innerText = '回答を送信する';
    }
};