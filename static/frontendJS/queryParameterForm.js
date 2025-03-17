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

console.log("hello from formJS");
