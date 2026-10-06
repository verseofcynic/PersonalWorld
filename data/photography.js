// To add a photo: push/add an object, or add to the list below. Categories are generated automatically.
const _p = (n, category, location) => ({ id: "photo-" + String(n).padStart(3, "0"), title: "Sample photo " + n,
  image: `placeholder:YOUR_PHOTOGRAPH ${n}|${(n * 37) % 360}`, category, location, date: "YYYY-MM", description: "Replace with your photograph." });
DATA.photography = [
  ["Travel", "Goa"], ["Nature", "EDIT"], ["Architecture", "Jaipur"], ["Street", "EDIT"], ["Travel", "Hampi"], ["Cars", "EDIT"],
  ["People", "EDIT"], ["Events", "EDIT"], ["Nature", "EDIT"], ["Travel", "Madurai"], ["Street", "EDIT"], ["Architecture", "EDIT"],
  ["Travel", "EDIT"], ["Nature", "EDIT"]
].map(([c, l], i) => _p(i + 1, c, l));
