// THAY ĐÚNG LINK CSV xuất bản của bạn!
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vStyN6d-6DBk5Dnje2W4zKw7pCowvOGnSI6NG6NSTbyXO2hIbLtdmuXCTKNFx5wiM638fUikKUUnD77/pub?gid=0&single=true&output=csv"; // Copy từ Google Sheets của bạn

function isDat(row) {
  // Kiểm tra trạng thái "Đạt"
  let kmTotal = Number(row["Ngày 1"]) + Number(row["Ngày 2"]) + Number(row["Ban đêm"]);
  let hoanThanhDem = row["Hoàn thành ban đêm"] === "true" || row["Hoàn thành ban đêm"] === "1" || row["Hoàn thành ban đêm"] === "✔";
  return (kmTotal >= 825) && hoanThanhDem;
}

function renderTable(rows) {
  const tbody = document.querySelector('#table tbody');
  tbody.innerHTML = rows.map((row, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${row["NGÀY THÁNG"] || row["Ngày tháng"] || ""}</td>
      <td>${row["MÃ SỐ"] || row["MS Học viên"] || ""}</td>
      <td>${row["TÊN HỌC VIÊN SỐ KM"] || row["Tên Học viên"] || ""}</td>
      <td>${row["Số km phải chạy"] || ""}</td>
      <td>${row["Ngày 1"] || ""}</td>
      <td>${row["Ngày 2"] || ""}</td>
      <td>${row["Ban đêm"] || ""}</td>
      <td>${row["Số km còn lại"] || ""}</td>
      <td>${row["Hoàn thành ban đêm"] || ""}</td>
      <td style="color:${isDat(row) ? 'green':'red'}; font-weight:bold">${isDat(row) ? 'ĐẠT' : ''}</td>
    </tr>
  `).join('');
}

// Đọc Google Sheets CSV và render bảng
Papa.parse(SHEET_CSV_URL, {
  download: true,
  header: true,
  complete: function(results) {
    let rows = results.data.filter(r => r["MS Học viên"] || r["MÃ SỐ"]); // Lọc dòng có dữ liệu
    renderTable(rows);
  }
});
