// ==========================================
// NOVATIX - MAIN JAVASCRIPT LOGIC
// ==========================================

// Global state tracking for platform analytics
let totalTicketsSold = 1240;
let totalRevenue = 4222400;
let orgTickets = 412;
let orgRev = 1850000;
let uploadedPosterUrl = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=700&q=80';

// Object storing currently selected event details for package selection
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
 * Switch between application views (Customer Gallery, Package Booking, Organizer Portal, Admin Master)
 */
function switchTab(tabId) {
    // Hide all view containers
    document.getElementById('view-customer').classList.add('hidden');
    document.getElementById('view-packages').classList.add('hidden');
    document.getElementById('view-organizer').classList.add('hidden');
    document.getElementById('view-admin').classList.add('hidden');

    // Reset desktop navigation button styles
    document.getElementById('nav-customer').className = "px-5 py-2 rounded-full font-bold text-sm transition-all hover:bg-white/20 text-white";
    document.getElementById('nav-organizer').className = "px-5 py-2 rounded-full font-bold text-sm transition-all hover:bg-white/20 text-white";
    document.getElementById('nav-admin').className = "px-5 py-2 rounded-full font-bold text-sm transition-all hover:bg-white/20 text-white";

    // Highlight active desktop tab
    if(tabId === 'customer' || tabId === 'packages') {
        document.getElementById('nav-customer').className = "px-5 py-2 rounded-full font-bold text-sm transition-all bg-brandYellow text-black shadow-md";
    } else {
        document.getElementById('nav-' + tabId).className = "px-5 py-2 rounded-full font-bold text-sm transition-all bg-brandYellow text-black shadow-md";
    }

    // Reset mobile bottom nav icon colors
    document.getElementById('mob-nav-customer').className = "flex flex-col items-center text-gray-400";
    document.getElementById('mob-nav-organizer').className = "flex flex-col items-center text-gray-400";
    document.getElementById('mob-nav-admin').className = "flex flex-col items-center text-gray-400";

    // Highlight active mobile icon
    if(tabId !== 'packages') {
        document.getElementById('mob-nav-' + tabId).className = "flex flex-col items-center text-yellow-400";
    } else {
        document.getElementById('mob-nav-customer').className = "flex flex-col items-center text-yellow-400";
    }

    // Reveal target view and scroll smoothly to top
    document.getElementById('view-' + tabId).classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Triggered when a customer taps an event poster in the main gallery
 */
function openEventPackages(title, date, venue, posterUrl, prices) {
    selectedEventData = { title, date, venue, posterUrl, prices };

    // Update banner details
    document.getElementById('pkg-event-title').innerText = title;
    document.getElementById('pkg-date-badge').innerText = date;
    document.getElementById('pkg-event-venue').innerText = "📍 " + venue;
    document.getElementById('package-banner').style.backgroundImage = `linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3)), url('${posterUrl}')`;

    // Set prices for each tier
    document.getElementById('price-regular').innerText = "KES " + prices.regular.toLocaleString();
    document.getElementById('price-vip').innerText = "KES " + prices.vip.toLocaleString();
    document.getElementById('price-vvip').innerText = "KES " + prices.vvip.toLocaleString();

    // Default selection to Regular tier
    selectPackageTier('Regular', prices.regular);

    // Switch view to package tier selection
    document.getElementById('view-customer').classList.add('hidden');
    document.getElementById('view-packages').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Return back to the main poster gallery view
 */
function backToPosters() {
    switchTab('customer');
}

/**
 * Handle package tier selection (Regular, VIP, VVIP)
 */
function selectPackageTier(tierName, price) {
    currentSelectedTier = tierName;
    currentTierPrice = price;

    // Reset card highlight states
    document.getElementById('tier-regular').className = "bg-black/60 border-2 border-white/10 p-6 rounded-2xl cursor-pointer transition space-y-3 shadow-xl";
    document.getElementById('tier-vip').className = "bg-black/60 border-2 border-white/10 p-6 rounded-2xl cursor-pointer transition space-y-3 shadow-xl";
    document.getElementById('tier-vvip').className = "bg-black/60 border-2 border-white/10 p-6 rounded-2xl cursor-pointer transition space-y-3 shadow-xl";

    // Apply active ring to selected tier
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
 * Recalculate aggregate ticket costs based on quantity input
 */
function calculateTotal() {
    const qty = parseInt(document.getElementById('buyer-qty').value) || 1;
    const total = qty * currentTierPrice;
    document.getElementById('summary-total').innerText = `Total: KES ${total.toLocaleString()}`;
}

/**
 * Process secure checkout, simulate M-Pesa STK push, and update metrics
 */
function processCheckout() {
    const fullName = document.getElementById('buyer-name').value.trim();
    const email = document.getElementById('buyer-email').value.trim();
    const phone = document.getElementById('buyer-phone').value.trim();
    const qty = parseInt(document.getElementById('buyer-qty').value) || 1;

    // Validate form details
    if (!fullName || !email || !phone) {
        alert('⚠️ Please fill in all your contact details (Full Name, Email, and Phone Number) to complete checkout.');
        return;
    }

    const totalCost = qty * currentTierPrice;

    // Update global dashboard statistics
    totalTicketsSold += qty;
    totalRevenue += totalCost;
    orgTickets += qty;
    orgRev += totalCost;

    document.getElementById('admin-tickets').innerText = totalTicketsSold;
    document.getElementById('admin-revenue').innerText = "KES " + totalRevenue.toLocaleString();
    document.getElementById('org-tickets-sold').innerText = orgTickets;
    document.getElementById('org-revenue').innerText = "KES " + orgRev.toLocaleString();

    // Prepend new transaction to admin activity log
    const logContainer = document.getElementById('transaction-log');
    const newLog = document.createElement('div');
    newLog.className = "p-3 bg-white/5 rounded-xl flex justify-between items-center text-sm animate-pulse";
    newLog.innerHTML = `<span>Ticket Purchased: <strong class="text-yellow-300">${selectedEventData.title} (${currentSelectedTier}) x${qty}</strong> by ${fullName} (KES ${totalCost.toLocaleString()})</span><span class="text-gray-400 text-xs">Just Now</span>`;
    logContainer.prepend(newLog);

    // Simulate successful payment confirmation prompt
    alert(`📲 M-Pesa STK Push Sent to ${phone}!\n\nThank you ${fullName}! You have successfully bought ${qty}x ${currentSelectedTier} ticket(s) for "${selectedEventData.title}" worth KES ${totalCost.toLocaleString()}. Your digital ticket pass has been emailed to ${email}.`);
    
    // Return user to poster gallery view
    switchTab('customer');
}

/**
 * Handle poster image uploads by organizers
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
 * Create and publish a new event poster from the Organizer Portal
 */
function createNewEvent() {
    const title = document.getElementById('new-event-title').value.trim();
    const date = document.getElementById('new-event-date').value;
    const price = parseInt(document.getElementById('new-event-price').value);
    const venue = document.getElementById('new-event-venue').value.trim();

    if (!title || !date || !price || !venue) {
        alert('⚠️ Please fill in all event details before publishing.');
        return;
    }

    // Auto-calculate VIP and VVIP pricing tiers based on regular price
    const vipPrice = price * 2;
    const vvipPrice = price * 5;

    // Dynamically inject new poster card into customer gallery
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
        <div class="p-4 bg-black/80 text-center font-bold text-sm text-yellow-400 border-t border-white/10">
            Tap to View Packages & Book 🎫
        </div>
    `;
    galleryGrid.prepend(newPosterDiv);

    // Add entry to organizer tracked table
    const tableBody = document.getElementById('organizer-event-table');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td class="p-4 font-bold text-yellow-300">${title}</td>
        <td class="p-4 text-gray-300">${date}</td>
        <td class="p-4 text-gray-300">300</td>
        <td class="p-4 text-green-400 font-bold">0</td>
        <td class="p-4"><span class="bg-yellow-500/20 text-yellow-300 text-xs px-2.5 py-1 rounded-full border border-yellow-500/30">Just Launched</span></td>
    `;
    tableBody.prepend(newRow);

    alert(`🎉 Success! Your event "${title}" along with its custom poster has been successfully published to Novatix.`);
    
    // Clear input form fields
    document.getElementById('new-event-title').value = '';
    document.getElementById('new-event-date').value = '';
    document.getElementById('new-event-price').value = '';
    document.getElementById('new-event-venue').value = '';
}
