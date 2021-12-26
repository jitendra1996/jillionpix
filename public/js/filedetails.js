const imgdetails = document.getElementById("image");
imgdetails.addEventListener('change', e => {
  e.preventDefault();
  if(e.target.files[0].size > 500000){
      alert("file size must be less than 500kb.");
      imgdetails.value = "";
  }
});

