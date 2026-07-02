import proj4 from "proj4";

// Define the EPSG:32644 projection (UTM Zone 44N, WGS84 datum)
proj4.defs(
  "EPSG:32644",
  "+proj=utm +zone=44 +datum=WGS84 +units=m +no_defs"
);

// Define EPSG:4326 (WGS84 Lat/Lon) - Proj4 has this built-in, but we register it explicitly for clarity
proj4.defs(
  "EPSG:4326",
  "+proj=longlat +datum=WGS84 +no_defs"
);

/**
 * Parses a Well-Known Text (WKT) LINESTRING from EPSG:32644 projection
 * and returns an array of LatLng pairs [latitude, longitude] suitable for React-Leaflet.
 * 
 * Example input: "LINESTRING (400000 700000, 400100 700100)"
 * Example output: [[lat1, lon1], [lat2, lon2]]
 */
export const parseAndProjectWktLineString = (wkt: string): [number, number][] => {
  if (!wkt) return [];

  try {
    // Extract everything between the outermost parentheses
    const coordsStart = wkt.indexOf("(");
    const coordsEnd = wkt.lastIndexOf(")");
    if (coordsStart === -1 || coordsEnd === -1) {
      console.warn("Invalid WKT LineString format:", wkt);
      return [];
    }

    const coordsString = wkt.substring(coordsStart + 1, coordsEnd);
    // Split by commas to get individual points
    const points = coordsString.split(",");

    const projectedPoints: [number, number][] = [];

    for (const pt of points) {
      const trimmedPt = pt.trim();
      if (!trimmedPt) continue;

      // Split by whitespace
      const coords = trimmedPt.split(/\s+/);
      if (coords.length < 2) continue;

      const x = parseFloat(coords[0]);
      const y = parseFloat(coords[1]);

      if (isNaN(x) || isNaN(y)) continue;

      // Project: EPSG:32644 returns [longitude, latitude] in proj4
      const [lon, lat] = proj4("EPSG:32644", "EPSG:4326", [x, y]);
      
      // Leaflet expects [latitude, longitude]
      projectedPoints.push([lat, lon]);
    }

    return projectedPoints;
  } catch (error) {
    console.error("Failed to parse WKT LineString:", error);
    return [];
  }
};
