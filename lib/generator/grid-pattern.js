import pSBC from "../color/pSBC";
export function generateGridPattern(
  rows,
  cols,
  baseColor,
  frontColor = "#4c4e72",
  density = 0.5,
  fillChance = 0.5,
  gradient = true,
  strokeWidth = "0.001",
  opacityFillMode = false,
) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${cols} ${rows}`);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  // Create base rectangle with baseColor
  const baseRect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  baseRect.setAttribute("x", "0");
  baseRect.setAttribute("y", "0");
  baseRect.setAttribute("width", cols);
  baseRect.setAttribute("height", rows);

  svg.appendChild(baseRect);

  // Create grid group
  const grid = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.setAttribute("fill", baseColor);
  svg.appendChild(grid);

  // Create grid of rectangles
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", "1");
      rect.setAttribute("height", "1");
      if (Math.random() < density) {
        let cellColor;
        if (Math.random() < fillChance) {
          if (opacityFillMode) {
            cellColor = frontColor;
            rect.setAttribute("opacity", Math.random())
            console.log("Using opacity mode: ", opacityFillMode)
          }
          else {
            const randomPercent = (Math.random() * 0.6 - 0.9).toFixed(3);
            cellColor = pSBC(parseFloat(randomPercent), frontColor);
          }
        }
        rect.setAttribute("fill", cellColor);

        rect.setAttribute("stroke", frontColor);
        rect.setAttribute("stroke-width", strokeWidth);
      } else {
        rect.setAttribute("fill", "none");
      }
      grid.appendChild(rect);
    }
  }
  if (gradient) {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const radialGradient = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "radialGradient"
    );
    radialGradient.setAttribute("id", "cornerGradient");
    radialGradient.setAttribute("ry", "150");
    const stop1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "transparent");
    stop1.setAttribute("stop-opacity", "1");
    const stop2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", baseColor);
    stop2.setAttribute("stop-opacity", "1");
    radialGradient.appendChild(stop1);
    radialGradient.appendChild(stop2);
    defs.appendChild(radialGradient);
    svg.appendChild(defs);
    const gradientRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    gradientRect.setAttribute("x", "0");
    gradientRect.setAttribute("y", "0");
    gradientRect.setAttribute("width", cols);
    gradientRect.setAttribute("height", rows);
    gradientRect.setAttribute("fill", "url(#cornerGradient)");
    svg.appendChild(gradientRect);
  }

  const svgString = new XMLSerializer().serializeToString(svg);
  const encoded = btoa(svgString);
  return `background-image: url("data:image/svg+xml;base64,${encoded}");
background-size: cover;
background-position: center center;
background-repeat: repeat;
width: 100%;
height: 100%;`;
}
