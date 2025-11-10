document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("searchInput").value.trim().toLowerCase();
  const validCities = {
    "jaipur": "cities/jaipur.html",
    "udaipur": "cities/udaipur.html",
    "jodhpur": "cities/jodhpur.html",
    "jaisalmer": "cities/jaisalmer.html",
    "ajmer": "cities/ajmer.html",
    "mount abu": "cities/mount-abu.html"
  };

  if (validCities[city]) {
    window.location.href = validCities[city];
  } else {
    alert("City not found. Try Jaipur, Udaipur, Jodhpur, etc.");
  }
});
