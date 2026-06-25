const asciiTarget = document.getElementById("ascii-art");

if (asciiTarget) {
    const signMessages = [
        "Hack The Planet",
        "Try Harder",
        "Trust But Verify",
        "Coffee > Sleep",
        "Hello Friend",
        "PWNED",
        "Works On My Box",
        "Knock Knock Neo",
        "admin:admin",
        "user:user",
        "Root and Scoot",
        "Toon World"
    ];

    function spaces(n) {
        return " ".repeat(Math.max(0, n));
    }

    function centerLine(content, totalWidth) {
        const left = Math.floor((totalWidth - content.length) / 2);
        return spaces(left) + content;
    }

    function buildAsciiPerson(message) {
        const padX = 2;
        const innerWidth = message.length + (padX * 2);
        const signWidth = innerWidth + 2;

        const top = " " + "_".repeat(innerWidth) + " ";
        const middle = "|" + spaces(padX) + message + spaces(padX) + "|";
        const bottom = "|" + "_".repeat(innerWidth) + "|";

        const head = "\\ (•◡•) /";
        const arms = "\\    /";
        const torso = "----";
        const waist = "|  |";
        const legs = "_|  |_";

        return [
            top,
            middle,
            bottom,
            centerLine(head, signWidth),
            centerLine(arms, signWidth),
            centerLine(torso, signWidth),
            centerLine(waist, signWidth),
            centerLine(legs, signWidth)
        ].join("\n");
    }

    const hour = new Date().getHours();
    const message = signMessages[hour % signMessages.length];
    asciiTarget.textContent = buildAsciiPerson(message);
}