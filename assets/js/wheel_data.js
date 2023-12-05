const data = {
  "colorArray": ["#364C62", "#F1C40F", "#E67E22", "#E74C3C", "#ECF0F1", "#95A5A6", "#16A085", "#27AE60", "#2980B9", "#8E44AD", "#2C3E50", "#F39C12", "#D35400", "#C0392B", "#BDC3C7", "#1ABC9C", "#2ECC71", "#E87AC2", "#3498DB", "#9B59B6", "#7F8C8D"],

  "segmentValuesArray": [
    { "type": "image", "value": require("@/components/winwheel/media/tip_star.svg"), "win": true, "resultText": "A STAR" },
    { "type": "image", "value": require("@/components/winwheel/media/tip_sqr.svg"), "win": true, "resultText": "A SQUARE" },
    { "type": "image", "value": require("@/components/winwheel/media/tip_oct.svg"), "win": true, "resultText": "AN OCTAGON" },
    { "type": "image", "value": require("@/components/winwheel/media/tip_triangle.svg"), "win": true, "resultText": "A TRIANGLE" },
    { "type": "image", "value": require("@/components/winwheel/media/tip_circle.svg"), "win": true, "resultText": "A CIRCLE" },
    { "type": "image", "value": require("@/components/winwheel/media/tip_hex.svg"), "win": true, "resultText": "A HEXAGON" },
    // { "type": "string", "value": "LOSE ALL", "win": true, "resultText": "LOSE ALL" }
  ],

  "svgWidth": 1024,
  "svgHeight": 728,
  "wheelStrokeColor": "#ff8200",
  "wheelStrokeWidth": 18,
  "wheelSize": 500,  // Se redujo el tamaño del círculo a 400
  "wheelTextOffsetY": 50,
  "wheelTextColor": "#EDEDED",
  "wheelTextSize": "1.2rem",
  "wheelImageOffsetY": 30,
  "wheelImageSize": 18,
  "centerCircleSize": 160,
  "centerCircleStrokeColor": "#ff8200",
  "centerCircleStrokeWidth": 12,
  "centerCircleFillColor": "#EDEDED",
  "segmentStrokeColor": "#ff8200",
  "segmentStrokeWidth": 4,
  "centerX": 512,  // Ajustado el centro X para centrar el círculo más pequeño
  "centerY": 384,  // Ajustado el centro Y para centrar el círculo más pequeño
  "hasShadows": false,
  "numSpins": 10000,
  "spinDestinationArray": [],
  "minSpinDuration": 12,
  "gameOverText": "THANK YOU FOR PLAYING SPIN2WIN WHEEL. COME AND PLAY AGAIN SOON!",
  "invalidSpinText": "INVALID SPIN. PLEASE SPIN AGAIN.",
  "introText": "YOU HAVE TO<br>SPIN IT <span style='color:#F282A9;'>1</span> WIN IT!",
  "hasSound": false,
  "gameId": "9a0232ec06bc431114e2a7f3aea03bbe2164f1aa",
  "clickToSpin": true
}

export default data
