const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    formStatus.textContent = "Thank you for your message! We will get back to you shortly.";
    contactForm.reset();

    setTimeout(function () {
        formStatus.textContent = "";
    }, 6000);
});