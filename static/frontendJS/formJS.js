document.addEventListener("DOMContentLoaded", function() {
    const nextBtns = document.querySelectorAll(".nextButton");
    const formSteps = document.querySelectorAll(".form-step");
    let currentStep = 0;

    nextBtns.forEach(button => {
        button.addEventListener("click", () => {
            // Hide the current step
            formSteps[currentStep].style.display = "none";
            // Show the next step
            currentStep++;
            if (currentStep < formSteps.length) {
                formSteps[currentStep].style.display = "block";
            }
        });
    });
    
    // Update the range value display as the user adjusts it
    const rangeInput = document.getElementById('release_date');
    const releaseDateValue = document.getElementById('release_date_value');
    
    rangeInput.addEventListener('input', () => {
        releaseDateValue.textContent = rangeInput.value;
    });
});



console.log("hello from formJS");