// ===================================================
// 1. DỮ LIỆU & CẤU HÌNH (DATA & CONFIG)
// ===================================================

const universityData = {
    'khu1': [{name: 'Đại học Bách Khoa HN'}, {name: 'Đại học Kinh Tế Quốc Dân'}, {name: 'Đại học Xây Dựng'}],
    'khu2': [{name: 'Đại học Quốc Gia HN'}, {name: 'Đại học Sư Phạm HN'}, {name: 'Học viện Báo Chí'}],
    'khu3': [{name: 'Đại học Kiến Trúc HN'}, {name: 'Học viện Bưu Chính'}, {name: 'Học viện An Ninh'}],
    'khu4': [{name: 'Đại học Ngoại Thương'}, {name: 'Học viện Ngoại Giao'}, {name: 'Đại học Luật HN'}],
    'khu5': [{name: 'Trung tâm GDQP-AN'}, {name: 'Khu Đô thị ĐHQGHN'}, {name: 'ĐH Công Nghệ - CS2'}]
};

const qualityDB = {
    'Quán Ăn Vặt Bách Kinh Xây': { 
        score: 95, grade: 'A', color: '#27ae60', 
        certs: ['VSATTP', 'ISO 22000'], 
        criteria: { 'Vệ sinh bếp': 98, 'Nguồn gốc': 95, 'Quy trình': 92, 'Bảo quản': 96, 'Nhân viên': 94 }, 
        history: [{date: '01/11/2025', score: 95, who: 'ComSV Team'}] 
    },
    'Quán Ăn Cầu Giấy': { 
        score: 88, grade: 'B', color: '#2980b9', 
        certs: ['VSATTP'], 
        criteria: { 'Vệ sinh bếp': 85, 'Nguồn gốc': 90, 'Quy trình': 88, 'Bảo quản': 85, 'Nhân viên': 90 }, 
        history: [{date: '02/11/2025', score: 88, who: 'ComSV Team'}] 
    },
    'Quán Ngon Hà Đông': { 
        score: 92, grade: 'A', color: '#27ae60', 
        certs: ['VSATTP', 'Bếp Sạch'], 
        criteria: { 'Vệ sinh bếp': 90, 'Nguồn gốc': 95, 'Quy trình': 93, 'Bảo quản': 90, 'Nhân viên': 92 }, 
        history: [{date: '03/11/2025', score: 92, who: 'ComSV Team'}] 
    },
    'Quán Ngon Chùa Láng': { 
        score: 97, grade: 'A', color: '#27ae60', 
        certs: ['VSATTP', 'ISO', 'HACCP'], 
        criteria: { 'Vệ sinh bếp': 99, 'Nguồn gốc': 98, 'Quy trình': 96, 'Bảo quản': 97, 'Nhân viên': 95 }, 
        history: [{date: '05/11/2025', score: 97, who: 'Thanh Tra'}] 
    },
    'Canteen Xuân Phương': { 
        score: 96, grade: 'A', color: '#27ae60', 
        certs: ['VSATTP', 'HACCP'], 
        criteria: { 'Vệ sinh bếp': 95, 'Nguồn gốc': 98, 'Quy trình': 96, 'Bảo quản': 95, 'Nhân viên': 94 }, 
        history: [{date: '06/11/2025', score: 96, who: 'Ban QL KTX'}] 
    }
};

const GOOGLE_FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSfKJspug63Psk_8aWDM6EL1Y5cauUrde7-D7YOH3zeGv1JDTQ/viewform"; 

// ===================================================
// 2. CÁC HÀM TIỆN ÍCH
// ===================================================

function getAreaName(key) {
    if(key === 'khu1') return 'Khu 1 (Bách-Kinh-Xây)';
    if(key === 'khu2') return 'Khu 2 (Cầu Giấy)';
    if(key === 'khu3') return 'Khu 3 (Hà Đông)';
    if(key === 'khu4') return 'Khu 4 (Chùa Láng)';
    if(key === 'khu5') return 'Khu 5 (Xuân Phương)';
    return key;
}

function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const link = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if(link) link.classList.add('active');
    
    window.scrollTo(0, 0);
    
    if (pageId === 'menu') switchTab('khu1');
}

function switchTab(areaId) {
    document.querySelectorAll('.area-content').forEach(c => c.classList.remove('active'));
    document.getElementById(areaId).classList.add('active');
    
    document.querySelectorAll('.area-tab').forEach(t => t.classList.remove('active'));
    const tabs = document.querySelectorAll('.area-tab');
    
    if (areaId === 'khu1' && tabs[0]) tabs[0].classList.add('active');
    if (areaId === 'khu2' && tabs[1]) tabs[1].classList.add('active');
    if (areaId === 'khu3' && tabs[2]) tabs[2].classList.add('active');
    if (areaId === 'khu4' && tabs[3]) tabs[3].classList.add('active');
    if (areaId === 'khu5' && tabs[4]) tabs[4].classList.add('active');
}

function switchSubTab(subId, btnElement) {
    const parentArea = btnElement.closest('.area-content');
    parentArea.querySelectorAll('.sub-content').forEach(el => el.classList.remove('active'));
    document.getElementById(subId).classList.add('active');
    parentArea.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
}

// ===================================================
// 3. LOGIC GIỎ HÀNG
// ===================================================
let cart = [];

function addToCart(mealName, price, areaKey) {
    if (cart.length > 0 && cart[0].area !== areaKey) {
        let confirmSwitch = confirm(`Giỏ hàng đang có món của ${getAreaName(cart[0].area)}.\nBạn chỉ được đặt món cùng 1 khu vực.\n\nXóa giỏ hàng cũ để đặt món mới?`);
        if (confirmSwitch) {
            cart = []; 
        } else {
            return; 
        }
    }

    const existingItem = cart.find(item => item.name === mealName);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: mealName, price: price, area: areaKey, quantity: 1 });
    }
    
    updateCartCountUI();
    
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "✅ Đã thêm";
    btn.style.background = "#2ecc71";
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "#27ae60";
    }, 1000);
}

function updateCartCountUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').innerText = `(${totalCount})`;
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCartCountUI();
        openCartPage();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCountUI();
    openCartPage(); 
}

function openCartPage() {
    navigateTo('order');
    const container = document.getElementById('cartListContainer');
    const totalEl = document.getElementById('cartTotal');
    const areaSelect = document.getElementById('areaSelect');
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:2rem;">Giỏ hàng trống 😢 <br> <a href="#" onclick="navigateTo(\'menu\')" style="color:#27ae60; font-weight:bold;">Quay lại chọn món ngay</a></div>';
        totalEl.innerText = '0đ';
        areaSelect.value = "";
        loadUniversities(); 
    } else {
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            container.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <strong>${item.name}</strong>
                        <small>${item.price.toLocaleString()}đ</small>
                    </div>
                    <div class="quantity-controls">
                        <button class="btn-qty" onclick="changeQuantity(${index}, -1)">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="btn-qty" onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                    <div class="cart-item-remove" onclick="removeFromCart(${index})">&times;</div>
                </div>`;
        });
        totalEl.innerText = total.toLocaleString() + 'đ';
        areaSelect.value = cart[0].area;
        loadUniversities(); 
    }
}

function loadUniversities() {
    const areaKey = document.getElementById('areaSelect').value;
    const pickupSelect = document.getElementById('pickupSelect');
    
    pickupSelect.innerHTML = '<option value="">-- Chọn điểm nhận hàng --</option>';
    
    if (areaKey && universityData[areaKey]) {
        pickupSelect.disabled = false;
        universityData[areaKey].forEach(uni => {
            const opt = document.createElement('option');
            opt.value = uni.name;
            opt.innerText = uni.name;
            pickupSelect.appendChild(opt);
        });
    } else {
        pickupSelect.disabled = true;
        pickupSelect.innerHTML = '<option value="">-- Vui lòng chọn khu vực trước --</option>';
    }
}

// ===================================================
// 4. LOGIC THANH TOÁN & ĐẶT HÀNG
// ===================================================

function submitOrder() {
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const area = document.getElementById('areaSelect').value;
    const pickup = document.getElementById('pickupSelect').value;

    if (cart.length === 0) { alert('Giỏ hàng trống!'); return; }
    if (!name || !phone) { alert('Vui lòng nhập tên và SĐT!'); return; }
    
    if (cart.length > 0 && area !== cart[0].area) {
        alert(`Lỗi: Món ăn trong giỏ thuộc ${getAreaName(cart[0].area)}. Vui lòng chọn khu vực nhận hàng đúng!`);
        document.getElementById('areaSelect').value = cart[0].area;
        loadUniversities();
        return;
    }

    if (!pickup) { alert('Vui lòng chọn trường đại học cụ thể!'); return; }

    const modal = document.getElementById('paymentModal');
    if(modal) {
        modal.style.display = 'block';
        selectPaymentMethod('cash');
    } else {
        alert('Lỗi: Không tìm thấy modal thanh toán. Vui lòng kiểm tra lại file HTML.');
    }
}
let selectedPaymentMethod = 'cash';

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    document.getElementById('method-cash').classList.remove('active');
    document.getElementById('method-qr').classList.remove('active');
    document.getElementById(`method-${method}`).classList.add('active');
}

function processPaymentStep1() {
    document.getElementById('paymentModal').style.display = 'none';

    if (selectedPaymentMethod === 'cash') {
        processSuccessOrder();
    } else {
        openQRModal();
    }
}

function openQRModal() {
    const qrModal = document.getElementById('qrModal');
    const qrImg = document.getElementById('qrImage');
    const qrTotalDisplay = document.getElementById('qrTotalDisplay');

    qrModal.style.display = 'block';

    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    if (qrTotalDisplay) qrTotalDisplay.innerText = total.toLocaleString() + 'đ';

    const bankId = 'TCB'; 
    const accountNo = '19074755890019'; 
    const template = 'compact';
    const qrSource = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${total}&addInfo=Thanh toan ComSV&accountName=NGUYEN MINH QUANG`;

    if (qrImg) qrImg.src = qrSource;
}

function processPaymentStep2() {
    document.getElementById('qrModal').style.display = 'none';

    setTimeout(() => {
        alert("✅ THANH TOÁN THÀNH CÔNG!\n\nHệ thống đã nhận được tiền chuyển khoản.\nNhấn OK để hoàn tất đơn hàng.");
        processSuccessOrder();
    }, 100);
}

function processSuccessOrder() {
    try {
        document.getElementById('paymentModal').style.display = 'none';
        document.getElementById('qrModal').style.display = 'none';
        
        const overlay = document.getElementById('successOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.zIndex = '99999';
        } 
        const pickupSelect = document.getElementById('pickupSelect');
        const trackingId = document.getElementById('trackingOrderId');
        const trackingLoc = document.getElementById('trackingLocation');

        if (trackingId) trackingId.textContent = '#SV' + Math.floor(Math.random() * 10000);
        if (trackingLoc && pickupSelect) trackingLoc.textContent = pickupSelect.value;

        setTimeout(() => {
            finalizeOrder();
        }, 2500);

    } catch (e) {
        console.error("Lỗi trong processSuccessOrder:", e);
        finalizeOrder();
    }
}

function finalizeOrder() {
    const overlay = document.getElementById('successOverlay');
    if(overlay) overlay.style.display = 'none';

    cart = []; 
    updateCartCountUI();
    
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('customerPhone');
    if(nameInput) nameInput.value = '';
    if(phoneInput) phoneInput.value = '';
    
    navigateTo('tracking');
    startTrackingSimulation();
}

// ===================================================
// 5. TRACKING, FEEDBACK & MODALS
// ===================================================

function startTrackingSimulation() {
    const steps = ['track-step-1', 'track-step-2', 'track-step-3', 'track-step-4'];
    let current = 0;
    
    steps.forEach(id => { const el = document.getElementById(id); el.classList.remove('active', 'completed'); });
    document.getElementById(steps[0]).classList.add('active');
    
    const actions = document.getElementById('trackingActions');
    if(actions) actions.style.display = 'none';

    const interval = setInterval(() => {
        current++;
        if (current < steps.length) {
            document.getElementById(steps[current-1]).classList.remove('active');
            document.getElementById(steps[current-1]).classList.add('completed');
            document.getElementById(steps[current]).classList.add('active');
        } else {
            document.getElementById(steps[current-1]).classList.remove('active');
            document.getElementById(steps[current-1]).classList.add('completed');
            
            if(actions) actions.style.display = 'flex';
            
            clearInterval(interval);
        }
    }, 2000); 
}

function openFeedback() {
    window.open(GOOGLE_FORM_LINK, '_blank');
    resetApp();
}

function resetApp() {
    cart = [];
    updateCartCountUI();
    navigateTo('home');
}

function openQualityModal(name, type) {
    const data = qualityDB[name];
    if(!data) {
        console.error("Không tìm thấy dữ liệu quán: " + name);
        return;
    }
    
    document.getElementById('modalTitle').innerText = name;
    document.getElementById('modalScoreVal').innerText = data.score;
    document.getElementById('modalScoreCircle').style.background = data.color;
    document.getElementById('modalGrade').innerText = 'Hạng ' + data.grade;
    document.getElementById('modalGrade').style.color = data.color;
    
    const certsHTML = data.certs.map(c => `<span class="cert-tag"> 📜  ${c}</span>`).join('');
    document.getElementById('modalCerts').innerHTML = certsHTML;
    
    let criteriaHTML = '';
    for (const [key, val] of Object.entries(data.criteria)) {
        criteriaHTML += `<div class="criteria-item"><div class="criteria-top"><span>${key}</span><span>${val}/100</span></div><div class="progress-bg"><div class="progress-fill" style="width:${val}%; background:${data.color}"></div></div></div>`;
    }
    document.getElementById('modalCriteriaList').innerHTML = criteriaHTML;
    
    const histHTML = data.history.map(h => `<div class="history-item" style="border-left-color: ${data.color}"><div><strong>${h.date}</strong></div><div style="color:${data.color}; font-weight:bold;">${h.score} điểm</div><div style="color:#666;">${h.who}</div></div>`).join('');
    document.getElementById('modalHistory').innerHTML = histHTML;
    
    document.getElementById('qualityModal').style.display = 'block';
}

function closePaymentModal() { document.getElementById('paymentModal').style.display = 'none'; }
function closeQRModal() { document.getElementById('qrModal').style.display = 'none'; }
function closeQualityModal() { document.getElementById('qualityModal').style.display = 'none'; }

window.onclick = function(event) {
    if (event.target == document.getElementById('qualityModal')) closeQualityModal();
    if (event.target == document.getElementById('paymentModal')) closePaymentModal();
    if (event.target == document.getElementById('qrModal')) closeQRModal();
}
