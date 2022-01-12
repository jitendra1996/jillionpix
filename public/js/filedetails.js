const imgdetails = document.getElementById("image");
imgdetails.addEventListener('change', e => {
  e.preventDefault();
  if(e.target.files[0].size > 500000){
      alert("file size must be less than 500kb.");
      imgdetails.value = "";
  }
});

const pixels = document.getElementById("pixels");

pixels.addEventListener("change" , e =>{
  e.preventDefault();
  if(isPrime(e.target.value)){
    alert('pixels should not be prime number. choose another number');
    pixels.value = "";   
  }
});


function isPrime(num){
  for(let i = 2 ; i < num ; i++){
      if(num % i === 0){
          return false;
      }
  }
  return true;
}
