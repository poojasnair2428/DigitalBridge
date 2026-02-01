const userInput = document.getElementById('userInput');
const meterBar = document.getElementById('meterBar');
const meterStatus = document.getElementById('meterStatus');

// 1. Real-time Scale Logic
userInput.addEventListener('input', () => {
    const text = userInput.value.trim();
    if (!text) {
        meterBar.style.width = '0%';
        meterStatus.innerText = '🌿';
        return;
    }

    const words = text.split(/\s+/);
    const complexWords = words.filter(w => w.length > 8).length;
    const percentage = Math.min((complexWords / words.length) * 100 * 2, 100); 

    meterBar.style.width = percentage + '%';

    if (percentage < 30) {
        meterBar.style.background = '#22c55e'; // Green
        meterStatus.innerText = '🌿';
    } else if (percentage < 70) {
        meterBar.style.background = '#f59e0b'; // Amber
        meterStatus.innerText = '🧐';
    } else {
        meterBar.style.background = '#ef4444'; // Red
        meterStatus.innerText = '🚨';
    }
});

// 2. Fetch & Handle Voice
document.getElementById('processBtn').addEventListener('click', async () => {
    const text = userInput.value;
    const btn = document.getElementById('processBtn');
    if(!text) return;

    btn.innerText = "Processing...";
    btn.disabled = true;

    try {
        const response = await fetch('http://localhost:5000/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const data = await response.json();

        // Update English Textbox
        document.getElementById('outEn').value = data.simple_en;
        // Store Malayalam text hidden for the voice engine
        document.getElementById('outMl').innerText = data.simple_ml;
        
        document.getElementById('resultArea').style.display = 'block';
        document.getElementById('voiceBtn').style.display = 'flex';
    } catch (e) {
        alert("Check Flask Connection!");
    } finally {
        btn.innerText = "Simplify & Translate";
        btn.disabled = false;
    }
});

// 3. Voice Only Output
document.getElementById('voiceBtn').addEventListener('click', () => {
    const mlText = document.getElementById('outMl').innerText;
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(mlText)}&tl=ml&client=tw-ob`;
    new Audio(url).play();
});