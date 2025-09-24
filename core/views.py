from django.shortcuts import render
from django.http import JsonResponse
import math

def index(request):
    return render(request, 'core/index.html')

def nearest_ambulance(request):
    # 🚑 Ambulancias de ejemplo
    ambulancias = [
        {"nombre": "Ambulancia Centro", "lat": -12.0464, "lng": -77.0428, "tel": "999-111-222"},
        {"nombre": "Ambulancia Norte", "lat": -12.0000, "lng": -77.0500, "tel": "999-222-333"},
        {"nombre": "Ambulancia Sur", "lat": -12.1000, "lng": -77.0300, "tel": "999-333-444"},
    ]

    try:
        lat = float(request.GET.get("lat"))
        lng = float(request.GET.get("lng"))
    except (TypeError, ValueError):
        return JsonResponse({"error": "Coordenadas inválidas"}, status=400)

    # fórmula de distancia aproximada (Haversine)
    def distancia_km(lat1, lon1, lat2, lon2):
        R = 6371  # radio de la Tierra en km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return R * c

    # elegir la más cercana
    for amb in ambulancias:
        amb["distancia"] = round(distancia_km(lat, lng, amb["lat"], amb["lng"]), 2)

    cercana = min(ambulancias, key=lambda a: a["distancia"])

    return JsonResponse({
    "name": cercana["nombre"],
    "lat": cercana["lat"],
    "lng": cercana["lng"],
    "phone": cercana["tel"],
    "distance_km": cercana["distancia"]
})



