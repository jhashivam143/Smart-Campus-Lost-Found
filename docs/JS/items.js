const API_URL = "http://localhost:8080";


// ===============================
// GET TOKEN
// ===============================

function getToken() {
    return localStorage.getItem("token");
}


// ===============================
// API REQUEST HELPER
// ===============================

async function apiRequest(url, options = {}) {

    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_URL}${url}`,
        {
            ...options,
            headers: headers
        }
    );

    if (response.status === 401 || response.status === 403) {
        alert("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        window.location.href = "login.html";
        return null;
    }

    if (!response.ok) {

        let message = "Something went wrong.";

        try {
            message = await response.text();
        } catch (error) {
            console.log(error);
        }

        throw new Error(message);
    }

    return response.json();
}


// ===============================
// CATEGORY ICON
// ===============================

function getIcon(category) {

    const icons = {

        Electronics: "🎧",
        Books: "📚",
        Bag: "🎒",
        Bags: "🎒",
        Clothing: "👕",
        Documents: "📄",
        Keys: "🔑",
        Accessories: "⌚",
        Other: "📦"

    };

    return icons[category] || "📦";
}


// ===============================
// POST ITEM
// ===============================

const itemForm =
    document.getElementById("itemForm");

if (itemForm) {

    itemForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const selectedType =
                document.querySelector(
                    'input[name="type"]:checked'
                );

            if (!selectedType) {
                alert("Please select LOST or FOUND.");
                return;
            }

            const type = selectedType.value;

            const itemData = {

                title:
                    document.getElementById("title").value.trim(),

                description:
                    document.getElementById("description").value.trim(),

                category:
                    document.getElementById("category").value,

                location:
                    document.getElementById("location").value.trim(),

                keywords:
                    document.getElementById("keywords").value.trim(),

                type: type
            };

            try {

                await apiRequest(
                    "/api/items",
                    {
                        method: "POST",
                        body: JSON.stringify(itemData)
                    }
                );

                alert(
                    type === "LOST"
                        ? "Lost item reported successfully!"
                        : "Found item reported successfully!"
                );

                window.location.href =
                    "dashboard.html";

            } catch (error) {

                console.error(error);

                alert(
                    "Unable to post item. Please try again."
                );

            }

        }
    );

}


// ===============================
// DISPLAY ITEMS
// ===============================

function displayItems(items, containerId) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    if (!items || items.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No items found</h3>
                <p>Try changing your search filters.</p>
            </div>
        `;

        return;
    }

    items.forEach(item => {

        const icon =
            getIcon(item.category);

        container.innerHTML += `

            <div class="item-card">

                <div class="item-image">
                    ${icon}
                </div>

                <div class="item-content">

                    <h3>
                        ${item.title}
                    </h3>

                    <p>
                        📍 ${item.location}
                    </p>

                    <p>
                        🏷️ ${item.category}
                    </p>

                    <p>
                        ${item.description}
                    </p>

                    <div class="item-footer">

                        <span class="status ${item.type.toLowerCase()}">
                            ${item.type}
                        </span>

                        <span class="status ${item.status.toLowerCase()}">
                            ${item.status}
                        </span>

                    </div>

                </div>

            </div>

        `;

    });

}


// ===============================
// LOAD DASHBOARD ITEMS
// ===============================

async function loadDashboardItems() {

    const dashboardContainer =
        document.getElementById("itemContainer");

    if (!dashboardContainer) return;

    try {

        const items =
            await apiRequest("/api/items");

        if (!items) return;

        displayItems(
            items.slice(-6).reverse(),
            "itemContainer"
        );

        updateDashboardStats(items);

    } catch (error) {

        console.error(error);

        dashboardContainer.innerHTML = `
            <div class="empty-state">
                <h3>Unable to load items</h3>
                <p>Please make sure the backend is running.</p>
            </div>
        `;

    }

}


// ===============================
// DASHBOARD STATS
// ===============================

function updateDashboardStats(items) {

    const lost =
        items.filter(
            item => item.type === "LOST"
        ).length;

    const found =
        items.filter(
            item => item.type === "FOUND"
        ).length;

    const returned =
        items.filter(
            item => item.status === "RETURNED"
        ).length;

    const lostCount =
        document.getElementById("lostCount");

    const foundCount =
        document.getElementById("foundCount");

    const returnedCount =
        document.getElementById("returnedCount");

    if (lostCount) {
        lostCount.textContent = lost;
    }

    if (foundCount) {
        foundCount.textContent = found;
    }

    if (returnedCount) {
        returnedCount.textContent = returned;
    }

}


// ===============================
// SEARCH
// ===============================

async function searchItems() {

    const input =
        document.getElementById("searchInput");

    if (!input) return;

    const query =
        input.value.trim();

    if (!query) {

        const allItems =
            await apiRequest("/api/items");

        displayItems(
            allItems || [],
            "searchResults"
        );

        return;
    }

    try {

        const items =
            await apiRequest(
                `/api/items/search?keyword=${encodeURIComponent(query)}`
            );

        displayItems(
            items || [],
            "searchResults"
        );

    } catch (error) {

        console.error(error);

        alert("Search failed.");
    }

}


// ===============================
// INITIAL DASHBOARD LOAD
// ===============================

if (
    document.getElementById("itemContainer")
) {

    loadDashboardItems();

}


// ===============================
// INITIAL SEARCH LOAD
// ===============================

if (
    document.getElementById("searchResults")
) {

    apiRequest("/api/items")
        .then(items => {

            if (items) {

                displayItems(
                    items,
                    "searchResults"
                );

            }

        })
        .catch(error => {

            console.error(error);

        });

}