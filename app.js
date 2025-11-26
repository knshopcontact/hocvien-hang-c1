const KM_PHAI_CHAY = 825; // Số km phải chạy

let hocvienArr = JSON.parse(localStorage.getItem('hocvien_hangc1')) || [];
let undoStack = [];

function saveData() {
  localStorage.setItem('hocvien_hangc1', JSON.stringify(hocvienArr));
}

function renderTable() {
  const tbody = document.querySelector('#table tbody');
  tbody.innerHTML = hocvienArr.map((hv, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${hv.ngaythang}</td>
      <td>${hv.ms}</td>
      <td>${hv.ten}</td>
      <td>${KM_PHAI_CHAY}</td>
      <td>
        <input type="number" min="0" max="${KM_PHAI_CHAY}" value="${hv.ngay1}" ${hv.locked ? 'readonly' : ''} onchange="updateKm(${idx},'ngay1',this)">
      </td>
      <td>
        <input type="number" min="0" max="${KM_PHAI_CHAY}" value="${hv.ngay2}" ${hv.locked ? 'readonly' : ''} onchange="updateKm(${idx},'ngay2',this)">
      </td>
      <td>
        <input type="number" min="0" max="${KM_PHAI_CHAY}" value="${hv.bandem}" ${hv.locked ? 'readonly' : ''} onchange="updateKm(${idx},'bandem',this)">
      </td>
      <td>${KM_PHAI_CHAY - (hv.ngay1 + hv.ngay2 + hv.bandem)}</td>
      <td>
        <input type="checkbox" ${hv.hoanThanhDem ? 'checked' : ''} ${hv.locked ? 'disabled' : ''} onchange="updateCheckbox(${idx},this)">
      </td>
      <td style="color:${isDat(hv) ? 'green':'red'}; font-weight:bold">
        ${isDat(hv) ? 'ĐẠT' : ''}
      </td>
      <td>
        <button onclick="deleteHv(${idx})">Xóa</button>
      </td>
    </tr>
  `).join('');
}

function isDat(hv) {
  return (hv.ngay1 + hv.ngay2 + hv.bandem >= KM_PHAI_CHAY) && hv.hoanThanhDem;
}

document.getElementById('form-add').onsubmit = function(e) {
  e.preventDefault();
  let ms = document.getElementById('ms').value.trim();
  let ten = document.getElementById('ten').value.trim();
  let ngaythang = document.getElementById('ngaythang').value;
  if(!ms || !ten || !ngaythang) return;
  hocvienArr.push({ ms, ten, ngaythang, ngay1:0, ngay2:0, bandem:0, hoanThanhDem:false, locked:false });
  saveData();
  renderTable();
  this.reset();
};

window.updateKm = function(idx, field, input) {
  hocvienArr[idx][field] = Number(input.value);
  if(isDat(hocvienArr[idx])){
    hocvienArr[idx].locked = true;
  }
  saveData();
  renderTable();
};

window.updateCheckbox = function(idx, input) {
  hocvienArr[idx].hoanThanhDem = input.checked;
  if(isDat(hocvienArr[idx])){
    hocvienArr[idx].locked = true;
  }
  saveData();
  renderTable();
};

window.deleteHv = function(idx) {
  undoStack.push(Object.assign({}, hocvienArr[idx]));
  hocvienArr.splice(idx,1);
  saveData();
  renderTable();
};

function printReport() {
  let win = window.open('', '_blank');
  let html = `
    <h2>BÁO CÁO HỌC VIÊN HẠNG C1</h2>
    <table border="1" cellpadding="6" cellspacing="0">
      <tr>
        <th>STT</th><th>Ngày tháng</th><th>MS</th><th>Tên</th><th>Tổng KM</th><th>Hoàn thành đêm</th><th>Trạng thái</th>
      </tr>
      ${hocvienArr.map((hv,i)=>`
        <tr>
          <td>${i + 1}</td>
          <td>${hv.ngaythang}</td>
          <td>${hv.ms}</td>
          <td>${hv.ten}</td>
          <td>${hv.ngay1 + hv.ngay2 + hv.bandem}</td>
          <td>${hv.hoanThanhDem ? '✔' : ''}</td>
          <td style="color:${isDat(hv)?'green':'red'}; font-weight:bold">${isDat(hv)?'ĐẠT':''}</td>
        </tr>`).join('')}
    </table>`;
  win.document.write(html);
  win.print();
}

// Tự động render mỗi lần tải trang
renderTable();
