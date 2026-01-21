document.addEventListener("DOMContentLoaded", async () => {
    const spotlightsContainer = document.getElementById("spotlights");

    if (!spotlightsContainer) return;

    try {
        const response = await fetch("data/members.json");
        if (!response.ok) throw new Error("Failed to fetch members");

        const data = await response.json();
        const members = data.members;

        // Only Silver (2) and Gold (3) members
        const qualifiedMembers = members.filter(
            member => member.membershipLevel === 2 || member.membershipLevel === 3
        );

        // Shuffle and select up to 3 members
        const shuffled = qualifiedMembers.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        if (selected.length === 0) {
            spotlightsContainer.innerHTML =
                "<p>No spotlight members available.</p>";
            return;
        }

        spotlightsContainer.innerHTML = selected.map(member => `
            <article class="spotlight-card">
                <div class="spotlight-image">
                    <img
                        src="${member.image}"
                        alt="Logo of ${member.name}"
                        loading="lazy"
                        onerror="this.parentElement.innerHTML='<div class=\\'placeholder-spotlight\\'>${member.name.substring(0,2)}</div>'"
                    >
                </div>

                <div class="spotlight-content">
                    <h3>${member.name}</h3>
                    <div class="spotlight-category">${member.category}</div>
                    <p>${member.description}</p>

                    <div class="spotlight-contact">
                        <p>📞 ${member.phone}</p>
                        <p>
                            🌐 <a href="${member.website}" target="_blank" rel="noopener">
                                ${member.website.replace(/^https?:\/\//, "")}
                            </a>
                        </p>
                    </div>
                </div>
            </article>
        `).join("");

    } catch (error) {
        console.error("Spotlights error:", error);
        spotlightsContainer.innerHTML =
            "<p>Unable to load member spotlights.</p>";
    }
});

