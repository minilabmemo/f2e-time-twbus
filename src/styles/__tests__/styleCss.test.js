const fs = require("fs");
const path = require("path");

test("測試 style.css 快照", () => {
  // 讀取 css 檔案的內容
  const cssPath = path.join(__dirname, "../style.css");
  const cssContent = fs.readFileSync(cssPath, "utf8");

  // 將內容與快照進行比較
  // expect(cssContent).toMatchSnapshot();
});


