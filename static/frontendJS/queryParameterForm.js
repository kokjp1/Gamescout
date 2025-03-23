document.addEventListener("DOMContentLoaded", function () {
    const nextButtons = document.querySelectorAll(".nextButton");
    const formSteps = document.querySelectorAll(".form-step");
    let currentStep = 0;

    function handleNextButtonClick() {
        formSteps[currentStep].style.display = "none";
        currentStep += 1;

        if (currentStep < formSteps.length) {
            formSteps[currentStep].style.display = "block";
        }
    }

    nextButtons.forEach(button => {
        button.addEventListener("click", handleNextButtonClick);
    });


    // Release date range input code

    const rangeInput = document.getElementById("release_date");
    const releaseDateValue = document.getElementById("release_date_value");
    const noLimitCheckbox = document.getElementById("noLimit");

    rangeInput.addEventListener("input", updateTextContent);
    noLimitCheckbox.addEventListener("change", handleNoLimitToggle);

    function updateTextContent() {
        releaseDateValue.textContent = rangeInput.value;
    }

    function handleNoLimitToggle() {
        if (noLimitCheckbox.checked) {
            rangeInput.disabled = true;
            releaseDateValue.textContent = "2000 - 2025";
        } else {
            rangeInput.disabled = false;
            releaseDateValue.textContent = rangeInput.value;
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const genreTiles = document.querySelectorAll("#checkboxes article");
    genreTiles.forEach((genreTile, index) => {
        genreTile.style.animationDelay = `${index * 0.1}s`;
    });
});
// code van Copilot, anders moest ik 19 nth-of-type selectoren schrijven voor elke checkbox op de genre selector