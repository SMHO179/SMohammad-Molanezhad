const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-8px) rotateX(4deg)";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) rotateX(0)";
    });
});