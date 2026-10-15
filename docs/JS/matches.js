const matchesContainer =
    document.getElementById(
        "matchesContainer"
    );

if (matchesContainer) {

    const items =
        JSON.parse(
            localStorage.getItem("campusItems")
        ) || [];

    const lostItems =
        items.filter(
            item => item.type === "LOST"
        );

    const foundItems =
        items.filter(
            item => item.type === "FOUND"
        );

    if (lostItems.length === 0 ||
        foundItems.length === 0) {

        matchesContainer.innerHTML = `
            <div class="match-card">
                <h3>No matches yet</h3>
                <p>
                    Matching results will appear when
                    similar found items are reported.
                </p>
            </div>
        `;

    } else {

        foundItems.forEach(found => {

            const lost =
                lostItems[0];

            const score =
                calculateScore(lost, found);

            if (score >= 40) {

                matchesContainer.innerHTML += `

                    <div class="match-card">

                        <div style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                        ">

                            <div>

                                <h3>
                                    ${found.icon}
                                    ${found.title}
                                </h3>

                                <p>
                                    📍 ${found.location}
                                </p>

                                <p>
                                    🏷️ ${found.category}
                                </p>

                            </div>

                            <div>

                                <div class="match-score">
                                    ${score}%
                                </div>

                                <small>
                                    Match Score
                                </small>

                            </div>

                        </div>

                        <br>

                        <button
                            class="btn primary"
                            onclick="contactFinder()"
                        >
                            Contact Finder
                        </button>

                    </div>

                `;

            }

        });

    }

}


// MATCH SCORE

function calculateScore(lost, found) {

    let score = 0;

    // Category

    if (
        lost.category ===
        found.category
    ) {

        score += 40;

    }

    // Location

    if (
        lost.location ===
        found.location
    ) {

        score += 30;

    }

    // Title keywords

    const lostWords =
        lost.title
            .toLowerCase()
            .split(" ");

    const foundText =
        (
            found.title +
            " " +
            found.keywords
        ).toLowerCase();

    lostWords.forEach(word => {

        if (
            word.length > 2 &&
            foundText.includes(word)
        ) {

            score += 10;

        }

    });

    return Math.min(score, 100);

}


// CONTACT FINDER

function contactFinder() {

    alert(
        "Contact functionality will be connected to the Spring Boot API."
    );

}