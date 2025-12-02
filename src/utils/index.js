export function getDiameterRanges(min, max, label, spacing) {
  let diameterRanges = [];
  while (label <= 100) {
    diameterRanges.push({ min, max, label });
    min += spacing;
    max += spacing;
    label += spacing;
  }

  return diameterRanges;
}

// 封装径阶整合的函数
export function calculateDiameterRange(data, diameterRanges, area) {
  // 结果存储（树种 -> 径阶 -> 株数）
  let result = {};

  data.forEach((row) => {
    let treeType = row["树种"];
    let diameter = parseFloat(row["胸径"]);

    // 确保该树种的径阶初始化
    diameterRanges.forEach((range) => {
      if (!result[treeType]) {
        result[treeType] = {}; // 初始化树种
      }
      if (!result[treeType][range.label]) {
        result[treeType][range.label] = { 株数: 0 }; // 初始化径阶
      }
    });

    // 确定该胸径属于哪个区间，并更新株数
    for (let range of diameterRanges) {
      if (diameter >= range.min && diameter < range.max) {
        result[treeType][range.label].株数 += 1;
        break;
      }
    }
  });

  // 转换成表格格式 [{ 树种, 径阶, 株数 }]
  let formattedResult = [];
  for (let treeType in result) {
    for (let label in result[treeType]) {
      formattedResult.push({
        树种: treeType,
        径阶: label,
        株数: result[treeType][label].株数,
        //每公顷株数: result[treeType][label].株数 / (area / 10000), // 每公顷株数
      });
    }
  }

  return formattedResult;
}
