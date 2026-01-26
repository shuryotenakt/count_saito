const GAS_URL = "https://script.google.com/macros/s/AKfycbxhLQNTkg8TqDoJjyQoqqRyGFfjgUwxG6YD0OTl-iXW3IWgc5HdId8dC5GxXANM4hhFeQ/exec";

const categoryRadios = document.getElementsByName('category');
const collegeSection = document.getElementById('college-section');
const collegeRadios = document.getElementsByName('college');

categoryRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        // 在校生・卒業生に加えて「入学予定・受験予定」も対象にする
        const isCollegeRequired = (radio.value === '在校生' || radio.value === '卒業生' || radio.value === '入学予定・受験予定');
        
        if (isCollegeRequired) {
            collegeSection.style.display = 'block';
            collegeRadios.forEach(r => r.required = true);
        } else {
            collegeSection.style.display = 'none';
            collegeRadios.forEach(r => {
                r.checked = false;
                r.required = false;
            });
        }
    });
});

document.getElementById('attendance-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerText = "RECORDING...";
    submitBtn.disabled = true;

    const formData = new FormData(this);
    const category = formData.get('category');
    const college = formData.get('college') || "";

    const url = `${GAS_URL}?category=${encodeURIComponent(category)}&college=${encodeURIComponent(college)}`;

    fetch(url, {
        method: 'POST',
        mode: 'no-cors'
    })
    .then(() => {
        document.querySelector('.registration-area').style.display = 'none';
        document.getElementById('survey-area').style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        alert("送信に失敗しました。再度お試しください。");
        submitBtn.innerText = "来場を記録する";
        submitBtn.disabled = false;
    });
});