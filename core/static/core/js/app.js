async function findNearest(lat, lng){
  const url = `/nearest/?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`;
  const res = await fetch(url);
  if(!res.ok){
    const err = await res.json().catch(()=>({error:'Error desconocido'}));
    document.getElementById('result').innerText = '❌ '+(err.error||res.statusText);
    return null;
  }
  return await res.json();
}

function showResult(data){
  const r = document.getElementById('result');
  r.innerHTML = `✅ <strong>${data.name}</strong><br>
  Distancia: ${data.distance_km} km<br>
  Tel: <a href="tel:${data.phone}">${data.phone}</a>`;
}

function initMap(){
  const map = L.map('map').setView([-12.046, -77.042], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {maxZoom:19,attribution:'© OpenStreetMap'}).addTo(map);
  return map;
}

const map = initMap();
let markers = [];
function clearMarkers(){ markers.forEach(m=>map.removeLayer(m)); markers=[] }
function addMarker(lat,lng,label){
  const m = L.marker([lat,lng]).addTo(map).bindPopup(label);
  markers.push(m);
}

document.getElementById('gpsBtn').addEventListener('click', ()=>{
  if(!navigator.geolocation){ alert('Geolocalización no soportada'); return }
  navigator.geolocation.getCurrentPosition(async pos=>{
    const {latitude:lat, longitude:lng} = pos.coords;
    const data = await findNearest(lat,lng);
    if(data){
      showResult(data);
      clearMarkers();
      addMarker(lat,lng,'📍 Emergencia');
      addMarker(data.lat, data.lng, `🚑 ${data.name}`);
      map.setView([lat,lng], 13);
    }
  }, err=> alert('No se pudo obtener ubicación: '+err.message));
});

document.getElementById('findBtn').addEventListener('click', async ()=>{
  const lat = parseFloat(document.getElementById('lat').value.trim());
  const lng = parseFloat(document.getElementById('lng').value.trim());
  if(isNaN(lat)||isNaN(lng)){ alert('Ingresa lat y lng válidos'); return }
  const data = await findNearest(lat,lng);
  if(data){
    showResult(data);
    clearMarkers();
    addMarker(lat,lng,'📍 Emergencia');
    addMarker(data.lat, data.lng, `🚑 ${data.name}`);
    map.setView([lat,lng], 13);
  }
});
