// =====================================================================
// dynamicBackground.js
// Infinite Continuous Landscape Background (Sharp & Smooth)
// خلفية جبال SVG متحركة ومتصلة (موجات Sine/Cosine) بألوان الهوية
// =====================================================================

/**
 * دالة لتوليد قيمة متصلة باستخدام موجات الجيب (Sine Waves)
 * دمج أكثر من موجة (Sine + Cosine) بيعطي شكل جبلي طبيعي وما بيتكرر بسرعة
 */
function calculateY(x, offset, frequency, amplitude, center) {
  const wave1 = Math.sin(x * frequency + offset) * amplitude;
  const wave2 = Math.cos(x * frequency * 0.5 + offset * 1.2) * (amplitude * 0.5);
  const wave3 = Math.sin(x * frequency * 2 + offset * 0.8) * (amplitude * 0.2);
  return center - (wave1 + wave2 + wave3);
}

function updateContinuousMountain(svg, polygon, layerData, timeOffset) {
  polygon.points.clear();

  let point = svg.createSVGPoint();
  point.x = 0;
  point.y = 100;
  polygon.points.appendItem(point);

  const resolution = 2; // كل ما قل الرقم، زادت الدقة (2 ممتاز)
  for (let x = 0; x <= 100; x += resolution) {
    point = svg.createSVGPoint();
    point.x = x;
    point.y = calculateY(x, timeOffset * layerData.speed, layerData.frequency, layerData.amplitude, layerData.center);
    polygon.points.appendItem(point);
  }

  point = svg.createSVGPoint();
  point.x = 100;
  point.y = 100;
  polygon.points.appendItem(point);
}

/**
 * يشغّل الخلفية المتحركة. لازم تُستدعى بعد ما الـ DOM يجهز (وعنصر
 * #landscape يكون موجود بالصفحة).
 */
export function initDynamicBackground() {
  const svg = document.getElementById("landscape");
  if (!svg) return;

  const polygons = {
    kick: document.getElementById("mountain-1"),
    bass: document.getElementById("mountain-2"),
    drums: document.getElementById("mountain-3"),
    lead: document.getElementById("mountain-4"),
  };

  const themeColors = [
    "rgba(255, 251, 247, 0.9)",
    "rgba(255, 237, 213, 0.8)",
    "rgba(249, 115, 22, 0.7)",
    "rgba(194, 65, 12, 1)",
  ];

  const layers = ["kick", "bass", "drums", "lead"];
  layers.forEach((layer, index) => {
    polygons[layer].style.fill = themeColors[index];
  });

  // إعدادات كل طبقة (السرعة، التردد، الارتفاع، والمركز)
  // Layer 0 (الخلفية) أبطأ، Layer 3 (الأمامية) أسرع لإعطاء عمق (Parallax)
  const layerSettings = [
    { speed: 0.001, frequency: 0.05, amplitude: 10, center: 70 },
    { speed: 0.002, frequency: 0.08, amplitude: 15, center: 80 },
    { speed: 0.004, frequency: 0.12, amplitude: 20, center: 90 },
    { speed: 0.007, frequency: 0.18, amplitude: 25, center: 100 },
  ];

  let globalTime = 0;
  function animate() {
    globalTime += 1;

    updateContinuousMountain(svg, polygons.kick, layerSettings[0], globalTime);
    updateContinuousMountain(svg, polygons.bass, layerSettings[1], globalTime);
    updateContinuousMountain(svg, polygons.drums, layerSettings[2], globalTime);
    updateContinuousMountain(svg, polygons.lead, layerSettings[3], globalTime);

    requestAnimationFrame(animate);
  }

  animate();
}