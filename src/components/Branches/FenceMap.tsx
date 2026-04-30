import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, Polygon, Circle } from "@react-google-maps/api";
import { Box } from "@mui/material";

export type ShapeType = "circle" | "rectangle" | "polygon";

interface Point {
  lat: string;
  lng: string;
}

interface Props {
  shape: ShapeType;
  points?: Point[];
  center?: { lat: string; lng: string; radius?: string };
  editable?: boolean;
  onPointsChange?: (points: Point[]) => void;
  onCenterChange?: (center: { lat: string; lng: string; radius?: string }) => void;
  height?: string;
  zoom?: number;
  open?: boolean;
  tab?: "manual" | "draw";
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const FenceMap: React.FC<Props> = ({
  shape,
  points = [],
  center,
  editable = true,
  onPointsChange,
  onCenterChange,
  height = "100%",
  zoom = 15,
  open,
  tab,
}) => {
  const [localPoints, setLocalPoints] = useState<Point[]>(points);
  const [localCenter, setLocalCenter] = useState(center);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => setUserLocation(indiaCenter) // fallback
    );
  } else {
    setUserLocation(indiaCenter);
  }
}, []);

  useEffect(() => setLocalPoints(points), [points]);
  useEffect(() => setLocalCenter(center), [center]);

  const indiaCenter = { lat: 20.5937, lng: 78.9629 };

  const defaultCenter =
  shape === "circle" && localCenter?.lat && localCenter?.lng
    ? { lat: parseFloat(localCenter.lat), lng: parseFloat(localCenter.lng) }
    : localPoints.length > 0
    ? { lat: parseFloat(localPoints[0].lat), lng: parseFloat(localPoints[0].lng) }
    : userLocation || indiaCenter;

  // 🔁 Trigger resize when modal opens or tab changes
  useEffect(() => {
    if (mapInstance) {
      setTimeout(() => {
        window.google.maps.event.trigger(mapInstance, "resize");
        mapInstance.setCenter(defaultCenter);
      }, 300);
    }
  }, [mapInstance, open, tab, defaultCenter]);

  return (
    <Box sx={{ width: "100%", height }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={zoom}
        onLoad={(map) => setMapInstance(map)}
        onClick={(e) => {
          if (!editable) return;
          const clickedPoint = {
            lat: e.latLng?.lat().toString() || "",
            lng: e.latLng?.lng().toString() || "",
          };
        
          if (shape === "circle") {
            const newCenter = { ...clickedPoint, radius: localCenter?.radius || "0" };
            setLocalCenter(newCenter);
            onCenterChange?.(newCenter);
          } else if (shape === "polygon" || shape === "rectangle") {
            const emptyIndex = localPoints.findIndex((p) => !p.lat || !p.lng);
            let updatedPoints;
        
            if (emptyIndex !== -1) {
              // Fill first empty slot (A1, A2, A3, A4)
              updatedPoints = [...localPoints];
              updatedPoints[emptyIndex] = clickedPoint;
            } else {
              // Otherwise, append a new one (for polygons)
              updatedPoints = [...localPoints, clickedPoint];
            }
        
            setLocalPoints(updatedPoints);
            onPointsChange?.(updatedPoints);
          }
        }}        
      >
        {shape === "circle" && localCenter?.lat && localCenter?.lng && (
          <>
            <Circle
              center={{
                lat: parseFloat(localCenter.lat),
                lng: parseFloat(localCenter.lng),
              }}
              radius={parseFloat(localCenter.radius || "0")}
              options={{
                fillColor: "#1976d2",
                fillOpacity: 0.3,
                strokeWeight: 2,
              }}
            />
            <Marker
              position={{
                lat: parseFloat(localCenter.lat),
                lng: parseFloat(localCenter.lng),
              }}
              draggable={editable}
              onDragEnd={(e) => {
                const newCenter = {
                  lat: e.latLng?.lat().toString() || "",
                  lng: e.latLng?.lng().toString() || "",
                  radius: localCenter.radius,
                };
                setLocalCenter(newCenter);
                onCenterChange?.(newCenter);
              }}
            />
          </>
        )}

        {(shape === "polygon" || shape === "rectangle") && localPoints.length > 0 && (
          <>
            <Polygon
              paths={localPoints.map((p) => ({
                lat: parseFloat(p.lat),
                lng: parseFloat(p.lng),
              }))}
              options={{
                fillColor: "#1976d2",
                fillOpacity: 0.3,
                strokeColor: "#1976d2",
                strokeWeight: 2,
              }}
            />
            {localPoints.map((p, idx) => (
              <Marker
                key={idx}
                position={{
                  lat: parseFloat(p.lat),
                  lng: parseFloat(p.lng),
                }}
                draggable={editable}
                onDragEnd={(e) => {
                  const updated = [...localPoints];
                  updated[idx] = {
                    lat: e.latLng?.lat().toString() || "",
                    lng: e.latLng?.lng().toString() || "",
                  };
                  setLocalPoints(updated);
                  onPointsChange?.(updated);
                }}
              />
            ))}
          </>
        )}
      </GoogleMap>
    </Box>
  );
};

export default FenceMap;
