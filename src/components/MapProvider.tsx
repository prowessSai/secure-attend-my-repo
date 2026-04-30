// MapsProvider.tsx
import React, { ReactNode } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAP_ACCESS_TOKEN } from "../config/Constants";

type MapsProviderProps = {
  children: ReactNode;
};
const libraries: ("places" | "maps")[] = ["places", "maps"];
const MapsProvider: React.FC<MapsProviderProps> = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAP_ACCESS_TOKEN, 
    libraries,
    version: "weekly",     
  });

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return <>{children}</>;
};

export default MapsProvider;
