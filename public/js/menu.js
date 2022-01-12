const moboMenu = document.getElementById("mobo");
const close_nav = document.getElementById("close_nav");
const mobo_menu = document.getElementById("mobo_menu");
const logo = document.querySelector(".logo");

moboMenu.addEventListener('click', e => {
    mobo_menu.style.display = "block";
    mobo_menu.style.position="fixed";
    document.querySelector('body').style.overflow = "hidden";
    if (window.innerWidth <= 500) {
        logo.style.display = 'none';
    }
});

close_nav.addEventListener('click', e => {
    mobo_menu.style.display = "none";
    document.querySelector('body').style.overflow = "scroll";
    if (window.innerWidth <= 500) {
        logo.style.display = 'block';
    }
});

// window.onresize=function(){
//     window.location.href='/de
window.addEventListener('orientationchange', e => {
    console.log('i\'m from orientation');
    window.location.href = window.location.href;

})