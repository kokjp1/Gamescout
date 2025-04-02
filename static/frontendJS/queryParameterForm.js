document.addEventListener("DOMContentLoaded", function () {
    const nextButtons = document.querySelectorAll(".nextButton");
    const prevButtons = document.querySelectorAll(".prevButton");
    const formSteps = document.querySelectorAll(".form-step");
    let currentStep = 0;

    // Initialize - show first step only
    formSteps.forEach((step, index) => {
        step.style.display = index === 0 ? "block" : "none";
    });

    function handleNextButtonClick() {
        formSteps[currentStep].style.display = "none";
        currentStep += 1;

        if (currentStep < formSteps.length) {
            formSteps[currentStep].style.display = "block";
        }
    }

    function handlePrevButtonClick() {
        formSteps[currentStep].style.display = "none";
        currentStep -= 1;

        if (currentStep >= 0) {
            formSteps[currentStep].style.display = "block";
        }
    }

    nextButtons.forEach(button => {
        button.addEventListener("click", handleNextButtonClick);
    });

    prevButtons.forEach(button => {
        button.addEventListener("click", handlePrevButtonClick);
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