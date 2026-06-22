const text = "Computer Science & Engineering (AI & ML) Graduate | Aspiring Data Engineer";
let index = 0;

function typeText() {
    if(index < text.length){
        document.getElementById("typing").innerHTML += text.charAt(index);
        index++;
        setTimeout(typeText, 20);
    }
}

typeText();

const reveals = document.querySelectorAll(".reveal");

function revealElements(){

    reveals.forEach((element)=>{

        const windowHeight = window.innerHeight;

        const elementTop =
            element.getBoundingClientRect().top;

        if(elementTop < windowHeight - 100){

            element.classList.add("active");
        }
    });

}

window.addEventListener("scroll", revealElements);

revealElements();