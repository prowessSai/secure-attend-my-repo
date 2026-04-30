import { useRef, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { GoogleMap, Circle, Polygon, Marker, InfoWindow, OverlayView } from "@react-google-maps/api";
import gpsIcon from "../../src/assets/images/Gps.svg";
import satelliteIcon from "../../src/assets/images/Satellite.svg";
import { IBranchMonitoringDTO, ILiveEmployeeDetailsDTO } from "../interfaces/Branches";
import { IEmployeeMonitoringDTO } from "../interfaces/User";

const containerStyle = { width: "100%", height: "100%" };
interface TrackingProps {
  branches: IBranchMonitoringDTO[];
  employees: IEmployeeMonitoringDTO[];
  onEmployeeClick?: (empId: string) => void;
  selectedEmployee?: ILiveEmployeeDetailsDTO | null;
  onInfoWindowClose?: () => void;
}
const cleanMapStyle = [
  { featureType: "poi", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ lightness: 50 }] },
  { featureType: "administrative", elementType: "labels", stylers: [{ visibility: "off" }] },
];
const parseWKTPolygon = (wkt?: string) => {
  if (!wkt) return [];

  return wkt
    .replace("POLYGON((", "")
    .replace("))", "")
    .split(",")
    .map((pair) => {
      const [lng, lat] = pair.trim().split(" ");
      return { lat: Number(lat), lng: Number(lng) };
    });
};

const fenceFill = "rgba(107,114,128,0.25)";
const fenceBorder = "#1967d2";


const LiveTrackingMap = ({ branches, employees, onEmployeeClick, selectedEmployee, onInfoWindowClose }: TrackingProps) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  // Create a unique key based on branch IDs to force remount when branches change
  const mapKey = useMemo(() => {
    return branches.map(b => b.id).sort().join('-') || 'no-branches';
  }, [branches]);

  useEffect(() => {
    if (mapRef.current && branches.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      branches.forEach((branch) => {
        if (branch.fenceType === "CIRCLE" && branch.centerLatitude && branch.centerLongitude) {
          bounds.extend({ lat: Number(branch.centerLatitude), lng: Number(branch.centerLongitude) });
        } else if (branch.coordinates) {
          const path = parseWKTPolygon(branch.coordinates);
          path.forEach((point) => bounds.extend(point));
        }
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [branches]);

  return (
    <Box sx={{ width: "100%", height: "100%", minHeight: "500px" }}>
      <GoogleMap
    key={mapKey}
    mapContainerStyle={containerStyle}
    zoom={12}
    options={{
      fullscreenControl: false,
      disableDefaultUI: true,
      styles: cleanMapStyle,
    }}
    onLoad={(map) => {
      mapRef.current = map;
      mapRef.current.setCenter({ lat: 17.72, lng: 83.27 });
    }}
  >

    {/* 🟣 DRAW BRANCH FENCES */}
    {branches.map((branch) => {
      // 🟢 Circle fence
      if (branch.fenceType === "CIRCLE" && branch.radius) {
        const center = {
          lat: Number(branch.centerLatitude),
          lng: Number(branch.centerLongitude),
        };
        const displayRadius = branch.radius - 50;
        
        return (
          <>
            <Circle
              key={`circle-${branch.id}`}
              center={center}
              radius={displayRadius}
              options={{
                fillColor: fenceFill,
                fillOpacity: 1,
                strokeColor: fenceBorder,
                strokeWeight: 2,
                clickable: false,
              }}
            />
            <OverlayView
              key={`label-${branch.id}`}
              position={center}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div style={{ 
                fontSize: "0.75rem", 
                fontWeight: 600, 
                color: "#666",
                transform: "translate(-50%, -50%)",
                whiteSpace: "nowrap"
              }}>
                {branch.name}
              </div>
            </OverlayView>
          </>
        );
      }

      // 🟠 Polygon / Rectangle fence
      if (branch.fenceType === "RECTANGLE" && branch.coordinates) {
        const path = parseWKTPolygon(branch.coordinates);
        const center = {
          lat: path.reduce((sum, p) => sum + p.lat, 0) / path.length,
          lng: path.reduce((sum, p) => sum + p.lng, 0) / path.length,
        };

        return (
          <>
            <Polygon
              key={`polygon-${branch.id}`}
              paths={path}
              options={{
                fillColor: fenceFill,
                fillOpacity: 1,
                strokeColor: fenceBorder,
                strokeWeight: 2,
                clickable: false,
              }}
            />
            <OverlayView
              key={`label-${branch.id}`}
              position={center}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div style={{ 
                fontSize: "0.75rem", 
                fontWeight: 600, 
                color: "#666",
                transform: "translate(-50%, -50%)",
                whiteSpace: "nowrap"
              }}>
                {branch.name}
              </div>
            </OverlayView>
          </>
        );
      }

      return null;
    })}

    {/* 👨‍💼 EMPLOYEE MARKERS */}
    {employees.map((emp) => (
      <Marker
        key={emp.empId}
        position={{
          lat: emp.currentLatitude,
          lng: emp.currentLongitude,
        }}
        icon={{
          url: emp.currentStatus === "INSIDE_OFFICE" ? satelliteIcon : gpsIcon,
          scaledSize: new google.maps.Size(40, 60),
          anchor: new google.maps.Point(15, 60),
        }}
        onClick={() => onEmployeeClick?.(emp.empId)}
      >
        {selectedEmployee?.employeeId === emp.empId && (
          <InfoWindow onCloseClick={onInfoWindowClose}>
            <div style={{ padding: "2px" }}>
              <div style={{ marginBottom: "6px" }}>
                <span style={{ fontWeight: 600 }}>Emp ID: </span>
                <span style={{ color: "#000" }}>{selectedEmployee.employeeId}</span>
              </div>
              <div style={{ marginBottom: "6px" }}>
                <span style={{ fontWeight: 600 }}>Emp Name: </span>
                <span style={{ color: "#000" }}>{selectedEmployee.employeeName}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Branch: </span>
                <span style={{ color: "#000" }}>{selectedEmployee.branchName}</span>
              </div>
            </div>
          </InfoWindow>
        )}
      </Marker>
    ))}
  </GoogleMap>
    </Box>
  );
};

export default LiveTrackingMap;
