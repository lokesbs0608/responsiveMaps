import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "@mui/material";
import karnatakaDistricts from "./FinalCopyTopo.json";

interface District {
  id: number;
  name: string;
  color: string;
  stroke: string;
}

const KarnatakaMap: React.FC = () => {
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);

  const handleDistrictHover = (district: District | null) => {
    setHoveredDistrict(district);
  };
  const handleGEO = (GEO: any) => {
    console.log(GEO);
    const htmlString = GEO?.properties?.description?.value;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const tds = doc.querySelectorAll("td");
    let KGISDistrictCode;

    tds.forEach((td: any) => {
      if (td.textContent === "KGISDistrictCode") {
        KGISDistrictCode = td?.nextElementSibling?.textContent;
      }
    });

    console.log(KGISDistrictCode, ">>>>>");
  };
  return (
    <ComposableMap
      projection="geoMercator"
      width={1650}
      height={2000}
      projectionConfig={{ center: [76.5074, 15.1278], scale: 15000 }}
    >
      <Geographies geography={karnatakaDistricts}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const district: District = {
              id: geo?.id,
              name: geo?.properties?.name,
              color: geo.properties.fill,
              stroke: geo?.properties?.stroke || "none",
            };
            return (
              <React.Fragment key={geo.rsmKey}>
                <Tooltip placement="top-start" title={district.name}>
                  <Geography
                    geography={geo}
                    fill={geo.properties.fill}
                    stroke={geo?.properties?.stroke || "none"}
                    strokeWidth={1}
                    onClick={() => handleGEO(geo)}
                    onMouseOver={() => handleDistrictHover(district)}
                    onMouseLeave={() => handleDistrictHover(null)}
                  />
                </Tooltip>
                {hoveredDistrict?.id === geo?.id && (
                  <React.Fragment>
                    <Geography
                      geography={geo}
                      fill="none"
                      stroke="#000000"
                      strokeWidth={3}
                    />
                  </React.Fragment>
                )}
              </React.Fragment>
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
};

export default KarnatakaMap;
