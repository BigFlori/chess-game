class SVGLoader {
  constructor(svgPath) {
    this.svgPath = svgPath;
  }

  async loadSVG() {
    try {
      const response = await fetch(this.svgPath);

      if (!response.ok) {
        throw new Error(`Failed to load SVG. Status: ${response.status}`);
      }

      const svgText = await response.text();
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

      return svgDoc.documentElement;
    } catch (error) {
      console.error("Error loading SVG:", error);
      return null;
    }
  }
}

export default SVGLoader;
