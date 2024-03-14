const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";

const updateImageCard = (imageDataArray) => {
    imageDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");
        const aiGenerateImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGenerateImg;
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGenerateImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        };
    });
};

const generateAiImages = async (userPrompt, userImageQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImageQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if (!response.ok) throw new Error("Failed to generate images please try again.");

        const { data } = await response.json();
        updateImageCard([...data]);
    } catch (error) {
        alert(error.message);
    }
};

const handleFormSubmission = (e) => {
    e.preventDefault();
    const userPrompt = generateForm.querySelector('.prompt-input').value;
    const userImageQuantity = generateForm.querySelector('.img-quantity').value;

    const imageCardMarkup = Array.from({ length: userImageQuantity }, () => `
        <div class="img-card loading">
            <img src="images/loader.svg" alt="image">
            <a href="#" class="download-btn">
                <img src="images/download.svg" alt="download icon">
            </a>
        </div>
    `).join("");

    imageGallery.innerHTML = imageCardMarkup;
    generateAiImages(userPrompt, userImageQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);
