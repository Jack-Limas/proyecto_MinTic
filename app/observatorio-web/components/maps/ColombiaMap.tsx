"use client";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const GEO_URL =
  "https://gist.githubusercontent.com/john-guerra/43c7656821069d00dcbc/raw/be6a6e239cd5b5b803c6e7c2ec405b793a9064dd/colombia.geo.json";

export default function ColombiaMap() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = !mounted || theme === "dark";

  const fillColor    = isDark ? "#1E2235" : "#E2E8F0";
  const strokeColor  = isDark ? "#10B981" : "#10B981";
  const hoverColor   = isDark ? "#10B98133" : "#10B98144";

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ scale: 1800, center: [-74, 4] }}
      style={{ width: "100%", height: "auto" }}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }: { geographies: any[] }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={0.5}
              style={{
                default: { fill: fillColor,  outline: "none" },
                hover:   { fill: hoverColor, outline: "none" },
                pressed: { fill: strokeColor, outline: "none" },
              }}
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
}