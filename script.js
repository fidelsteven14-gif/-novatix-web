// ==========================================
// NOVATIX - COMBINED JAVASCRIPT LOGIC (script.js)
// ==========================================

let totalTicketsSold = 1240;
let totalRevenue = 4222400;
let orgTickets = 412;
let orgRev = 1850000;
let uploadedPosterUrl = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=700&q=80';

let selectedEventData = {
    title: '',
    date: '',
    venue: '',
    posterUrl: '',
    prices: { regular: 0, vip: 0, vvip: 0 }
};

let currentSelectedTier = 'Regular';
let currentTierPrice = 0;

/**
 * Switch views between Customer Posters, Package Selector, Organizer Portal, and Admin
 */
function switchTab(tabId) {
    document.getElementById('view-customer').classList.add('hidden');
    document.getElementById('view-packages').classList.add('hidden');
    document.getElementById('view-organizer').classList.add('hidden');
    document.getElementById('view-admin').classList.add('hidden');

    document.getElementById('nav-customer').className = "px-5 py-2 rounded-full font-bold text-sm transition-all hover:bg-white/20 text-white";
    document.getElementById('nav-organizer').className = "px-5 py-2 rounded-full font-bold text-sm transition-all hover:bg-white/20 text-white";
    document.getElementById('nav-admin').className = "px-5 py-2 rounded-full font-bold text-sm transition-all hover:bg-white/20 text-white";

    if(tabId === 'customer' || tabId === 'packages') {
        document.getElementById('nav-customer').className = "px-5 py-2 rounded-full font-bold text-sm transition-all bg-yellow-400 text-black shadow-md";
    } else {
        document.getElementById('nav-' + tabId).className = "px-5 py-2 rounded-full font-bold text-sm transition-all bg-yellow-400 text-black shadow-md";
    }

    document.getElementById('mob-nav-customer').className = "flex flex-col items-center text-gray-400";
    document.getElementById('mob-nav-organizer').className = "flex flex-col items-center text-gray-400";
    document.getElementById('mob-nav-admin').className = "flex flex-col items-center text-gray-400";

    if(tabId !== 'packages') {
        document.getElementById('mob-nav-' + tabId).className = "flex flex-col items-center text-yellow-400";
    } else {
        document.getElementById('mob-nav-customer').className = "flex flex-col items-center text-yellow-400";
    }

    document.getElementById('view-' + tabId).classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Open packages and buyer detail form when a customer taps an event poster
 */
function openEventPackages(title, date, venue, posterUrl, prices) {
    selectedEventData = { title, date, venue, posterUrl, prices };

    document.getElementById('pkg-event-title').innerText = title;
    document.getElementById('pkg-date-badge').innerText = date;
    document.getElementById('pkg-event-venue').innerText = "📍 " + venue;
    document.getElementById('package-banner').style.backgroundImage = `linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3)), url('${posterUrl}')`;

    document.getElementById('price-regular').innerText = "KES " + prices.regular.toLocaleString();
    document.getElementById('price-vip').innerText = "KES " + prices.vip.toLocaleString();
    document.getElementById('price-vvip').innerText = "KES " + prices.vvip.toLocaleString();

    selectPackageTier('Regular', prices.regular);

    document.getElementById('view-customer').classList.add('hidden');
    document.getElementById('view-packages').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToPosters() {
    switchTab('customer');
}

/**
 * Select ticket package tier (Regular, VIP, VVIP)
 */
function selectPackageTier(tierName, price) {
    currentSelectedTier = tierName;
    currentTierPrice = price;

    document.getElementById('tier-regular').className = "bg-black/60 border-2 border-white/10 p-6 rounded-2xl cursor-pointer transition space-y-3 shadow-xl";
    document.getElementById('tier-vip').className = "bg-black/60 border-2 border-white/10 p-6 rounded-2xl cursor-pointer transition space-y-3 shadow-xl";
    document.getElementById('tier-vvip').className = "bg-black/60 border-2 border-white/10 p-6 rounded-2xl cursor-pointer transition space-y-3 shadow-xl";

    if(tierName === 'Regular') {
        document.getElementById('tier-regular').className = "bg-black/80 border-2 border-yellow-400 p-6 rounded-2xl cursor-pointer transition space-y-3 shadow-2xl ring-4 ring-yellow-400/20";
    } else if(tierName === 'VIP') {
        document.getElementById('tier-vip').className = "bg-black/80 border-2 border-yellow-400 p-6 rounded-2xl cursor-pointer transition space-y-3 shadow-2xl ring-4 ring-yellow-400/20";
    } else if(tierName === 'VVIP') {
        document.getElementById('tier-vvip').className = "bg-black/80 border-2 border-yellow-400 p-6 rounded-2xl cursor-pointer transition space-y-3 shadow-2xl ring-4 ring-yellow-400/20";
    }

    document.getElementById('summary-tier').innerText = `${tierName} Package`;
    calculateTotal();
}

/**
 * Calculate total cost based on ticket quantity
 */
function calculateTotal() {
    const qty = parseInt(document.getElementById('buyer-qty').value) || 1;
    const total = qty * currentTierPrice;
    document.getElementById('summary-total').innerText = `Total: KES ${total.toLocaleString()}`;
}

/**
 * Process purchase, validate buyer information, and trigger simulated M-Pesa STK push
 */
function processCheckout() {
    const fullName = document.getElementById('buyer-name').value.trim();
    const email = document.getElementById('buyer-email').value.trim();
    const phone = document.getElementById('buyer-phone').value.trim();
    const qty = parseInt(document.getElementById('buyer-qty').value) || 1;

    if (!fullName || !email || !phone) {
        alert('⚠️ Please enter your Full Name, Email Address, and Phone Number before buying tickets.');
        return;
    }

    const totalCost = qty * currentTierPrice;

    totalTicketsSold += qty;
    totalRevenue += totalCost;
    orgTickets += qty;
    orgRev += totalCost;

    document.getElementById('admin-tickets').innerText = totalTicketsSold;
    document.getElementById('admin-revenue').innerText = "KES " + totalRevenue.toLocaleString();
    document.getElementById('org-tickets-sold').innerText = orgTickets;
    document.getElementById('org-revenue').innerText = "KES " + orgRev.toLocaleString();

    const logContainer = document.getElementById('transaction-log');
    const newLog = document.createElement('div');
    newLog.className = "p-3 bg-white/5 rounded-xl flex justify-between items-center text-sm animate-pulse";
    newLog.innerHTML = `<span>Ticket Purchased: <strong class="text-yellow-300">${selectedEventData.title} (${currentSelectedTier}) x${qty}</strong> by ${fullName} (KES ${totalCost.toLocaleString()})</span><span class="text-gray-400 text-xs">Just Now</span>`;
    logContainer.prepend(newLog);

    alert(`📲 M-Pesa STK Push sent to ${phone}!\n\nThank you ${fullName}! You have successfully bought ${qty}x ${currentSelectedTier} ticket(s) for "${selectedEventData.title}" worth KES ${totalCost.toLocaleString()}. Confirmation has been sent to ${email}.`);
    
    switchTab('customer');
}

/**
 * Handle poster uploads in organizer portal
 */
function previewPoster(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedPosterUrl = e.target.result;
            const imgTag = document.getElementById('poster-img-tag');
            imgTag.src = uploadedPosterUrl;
            imgTag.classList.remove('hidden');
            document.getElementById('poster-preview-text').classList.add('hidden');
        }
        reader.readAsDataURL(file);
    }
}

/**
 * Publish a new event poster
 */
function createNewEvent() {
    const title = document.getElementById('new-event-title').value.trim();
    const date = document.getElementById('new-event-date').value;
    const price = parseInt(document.getElementById('new-event-price').value);
    const venue = document.getElementById('new-event-venue').value.trim();

    if (!title || !date || !price || !venue) {
        alert('⚠️ Please fill in all event fields before publishing.');
        return;
    }

    const vipPrice = price * 2;
    const vvipPrice = price * 5;

    const galleryGrid = document.getElementById('poster-gallery-grid');
    const newPosterDiv = document.createElement('div');
    newPosterDiv.onclick = function() {
        openEventPackages(title, date, venue, uploadedPosterUrl, {regular: price, vip: vipPrice, vvip: vvipPrice});
    };
    newPosterDiv.className = "group bg-black/60 rounded-3xl overflow-hidden border-2 border-white/10 hover:border-yellow-400 transition-all cursor-pointer shadow-2xl flex flex-col transform hover:-translate-y-2";
    newPosterDiv.innerHTML = `
        <div class="h-96 relative bg-cover bg-center overflow-hidden" style="background-image: url('${uploadedPosterUrl}')">
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div class="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-black px-3 py-1.5 rounded-full shadow-lg">${date}</div>
            <div class="absolute bottom-4 left-4 right-4 space-y-1">
                <span class="text-xs uppercase tracking-widest text-green-400 font-bold">New Festival</span>
                <h3 class="text-3xl font-black text-white group-hover:text-yellow-300 transition">${title}</h3>
                <p class="text-sm text-gray-300">📍 ${venue}</p>
            </div>
        </div>
        <div class="p-4 bg-black/90 text-center font-bold text-sm text-yellow-400 border-t border-white/10">
            Tap to View Packages & Buy Tickets 🎫
        </div>
    `;
    galleryGrid.prepend(newPosterDiv);

    alert(`🎉 Success! Your event "${title}" poster has been published live.`);
    
    document.getElementById('new-event-title').value = '';
    document.getElementById('new-event-date').value = '';
    document.getElementById('new-event-price').value = '';
    document.getElementById('new-event-venue').value = '';
}
