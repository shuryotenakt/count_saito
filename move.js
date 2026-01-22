const GAS_URL = "https://script.google.com/macros/s/AKfycbxhLQNTkg8TqDoJjyQoqqRyGFfjgUwxG6YD0OTl-iXW3IWgc5HdId8dC5GxXANM4hhFeQ/exec";

document.getElementById('attendance-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerText = "RECORDING...";
    submitBtn.disabled = true;

    const formData = new FormData(this);
    const category = formData.get('category'); // ラジオボタンでも同じように取得できる

    fetch(`${GAS_URL}?category=${encodeURIComponent(category)}`, {
        method: 'POST'
    })
    .then(response => {
        document.querySelector('.registration-area').style.display = 'none';
        document.getElementById('survey-area').style.display = 'block';
    })
    .catch(error => {
        alert("送信に失敗しました。再度お試しください。");
        submitBtn.innerText = "来場を記録する";
        submitBtn.disabled = false;
    });
});