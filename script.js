// Navigation Functions
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById('home').classList.add('hidden');
    document.getElementById(pageId).classList.remove('hidden');
}

function goHome() {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById('home').classList.remove('hidden');
    resetFields();
}

function showEncryptPage() { showPage('encryptPage'); resetFields(); }
function showDecryptPage() { showPage('decryptPage'); resetFields(); }
function showImageEncrypt() { showPage('imageEncryptPage'); resetFields(); }
function showTextEncrypt() { showPage('textEncryptPage'); resetFields(); }
function showImageDecrypt() { showPage('imageDecryptPage'); resetFields(); }
function showTextDecrypt() { showPage('textDecryptPage'); resetFields(); }

// Reset Fields
function resetFields() {
    document.getElementById('imageInput').value = "";
    document.getElementById('textInput').value = "";
    document.getElementById('imagePasskey').textContent = "";
    document.getElementById('textPasskey').textContent = "";
    document.getElementById('imageKeyInput').value = "";
    document.getElementById('textKeyInput').value = "";
    document.getElementById('imageError').textContent = "";
    document.getElementById('textError').textContent = "";
    document.getElementById('decryptedImage').classList.add('hidden');
    document.getElementById('decryptedText').textContent = "";
}

// Storage for encrypted data
let encryptedData = {};

// Generate Unique Passkey
function generatePasskey() {
    return Math.random().toString(36).slice(2, 10).toUpperCase();
}

// Encrypt Image
function encryptImage() {
    let file = document.getElementById('imageInput').files[0];
    if (!file) {
        showPopupMessage("❌ No image selected!");
        return;
    }

    let passkey = generatePasskey();
    let reader = new FileReader();

    reader.onload = function(event) {
        const encoded = event.target.result; // Base64 encoded image

        encryptedData[passkey] = { type: 'image', data: encoded };

        document.getElementById('imagePasskey').innerHTML = `
            <span class="green-text">Passkey: ${passkey}</span><br>
            <textarea readonly rows="4" style="width:90%; margin-top:10px;">${encoded}</textarea>
        `;
        showPopupMessage("✅ Image Encrypted!");
    };

    reader.readAsDataURL(file);
}

// Encrypt Text
function encryptText() {
    let text = document.getElementById('textInput').value;
    if (!text) {
        showPopupMessage("❌ No text entered!");
        return;
    }

    let passkey = generatePasskey();
    const encoded = btoa(text); // Base64 encoding

    encryptedData[passkey] = { type: 'text', data: text };

    document.getElementById('textPasskey').innerHTML = `
        <span class="green-text">Passkey: ${passkey}</span><br>
        <textarea readonly rows="4" style="width:90%; margin-top:10px;">${encoded}</textarea>
    `;
    showPopupMessage("✅ Text Encrypted!");
}

// Decrypt Image
function decryptImage() {
    let passkey = document.getElementById('imageKeyInput').value;

    if (encryptedData[passkey] && encryptedData[passkey].type === 'image') {
        document.getElementById('decryptedImage').src = encryptedData[passkey].data;
        document.getElementById('decryptedImage').classList.remove('hidden');
        document.getElementById('imageError').textContent = "";

        delete encryptedData[passkey];
        showPopupMessage("✅ Image Decrypted!");
    } else {
        document.getElementById('imageError').textContent = "❌ Wrong Passkey!";
        document.getElementById('decryptedImage').classList.add('hidden');
    }
}

// Decrypt Text
function decryptText() {
    let passkey = document.getElementById('textKeyInput').value;

    if (encryptedData[passkey] && encryptedData[passkey].type === 'text') {
        document.getElementById('decryptedText').textContent = encryptedData[passkey].data;
        document.getElementById('textError').textContent = "";

        delete encryptedData[passkey];
        showPopupMessage("✅ Text Decrypted!");
    } else {
        document.getElementById('textError').textContent = "❌ Wrong Passkey!";
        document.getElementById('decryptedText').textContent = "";
    }
}

// Show Popup Messages
function showPopupMessage(message) {
    let popup = document.createElement("div");
    popup.className = "popup-message";
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 2000);
}
