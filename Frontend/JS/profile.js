
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profileForm");
    const message = document.getElementById("profileMessage");

    const fields = {
        fullName: document.getElementById("fullName"),
        email: document.getElementById("email"),
        studentId: document.getElementById("studentId"),
        department: document.getElementById("department"),
        phone: document.getElementById("phone")
    };

    // Try to find the existing logged-in user's information.
    function getSavedUser() {
        const keys = ["campusFindUser", "currentUser", "user"];

        for (const key of keys) {
            try {
                const value = JSON.parse(localStorage.getItem(key));
                if (value && typeof value === "object" && !Array.isArray(value)) {
                    return { ...value, _storageKey: key };
                }
            } catch (error) {
                // Ignore invalid or missing JSON.
            }
        }

        return {};
    }

    const user = getSavedUser();
    const storageKey = user._storageKey || "campusFindUser";

    function firstValue(...values) {
        return values.find(value =>
            value !== undefined && value !== null && value !== ""
        ) ?? "";
    }

    function showUser() {
        fields.fullName.value = firstValue(
            user.fullName, user.name, user.username
        );

        fields.email.value = firstValue(user.email);
        fields.studentId.value = firstValue(
            user.studentId, user.rollNumber
        );
        fields.department.value = firstValue(user.department);
        fields.phone.value = firstValue(user.phone, user.phoneNumber);

        document.getElementById("displayName").textContent =
            fields.fullName.value || "Student Name";

        document.getElementById("displayEmail").textContent =
            fields.email.value || "Add your email address";

        document.getElementById("avatar").textContent =
            (fields.fullName.value.trim().charAt(0) || "S").toUpperCase();

        document.getElementById("memberSince").textContent =
            user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "CampusFind member";
    }

    showUser();

    form.addEventListener("submit", event => {
        event.preventDefault();

        const updatedUser = {
            ...user,
            fullName: fields.fullName.value.trim(),
            email: fields.email.value.trim(),
            studentId: fields.studentId.value.trim(),
            department: fields.department.value,
            phone: fields.phone.value.trim()
        };

        delete updatedUser._storageKey;

        try {
            localStorage.setItem(storageKey, JSON.stringify(updatedUser));
            Object.assign(user, updatedUser);
            showUser();

            message.textContent = "Profile updated successfully!";
            message.classList.remove("error");
        } catch (error) {
            message.textContent = "Could not save changes in this browser.";
            message.classList.add("error");
        }
    });

    form.addEventListener("reset", () => {
        setTimeout(() => {
            showUser();
            message.textContent = "";
            message.classList.remove("error");
        }, 0);
    });

    // Only use arrays that exist in the browser's stored data.
    function getStoredArray(keys) {
        for (const key of keys) {
            try {
                const value = JSON.parse(localStorage.getItem(key));
                if (Array.isArray(value)) return value;
                if (value && Array.isArray(value.items)) return value.items;
            } catch (error) {
                // Ignore invalid JSON.
            }
        }
        return [];
    }

    const items = getStoredArray(["items", "lostFoundItems", "allItems"]);

    const lost = items.filter(item =>
        /lost/i.test(String(item.type || item.status || ""))
    );

    const found = items.filter(item =>
        /found/i.test(String(item.type || item.status || ""))
    );

    const matches = getStoredArray(["matches", "itemMatches"]);

    document.getElementById("lostCount").textContent = lost.length;
    document.getElementById("foundCount").textContent = found.length;
    document.getElementById("matchCount").textContent = matches.length;
});
