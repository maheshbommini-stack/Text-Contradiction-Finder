const stopWords = new Set([
    "the",
    "a",
    "an",
    "is",
    "are",
    "was",
    "were",
    "am",
    "be",
    "been",
    "to",
    "of",
    "in",
    "on",
    "at",
    "for",
    "and",
    "or",
    "but",
    "with",
    "from",
    "by",
    "this",
    "that",
    "these",
    "those",
    "it",
    "they",
    "he",
    "she",
    "we",
    "you",
    "can",
    "will",
    "has",
    "have",
    "had"
]);


const oppositePairs = {

    "open": "closed",
    "opened": "closed",
    "close": "open",
    "closed": "open",

    "allow": "forbid",
    "allows": "forbids",
    "allowed": "forbidden",
    "forbidden": "allowed",

    "accept": "reject",
    "accepted": "rejected",
    "reject": "accept",

    "increase": "decrease",
    "increased": "decreased",
    "decrease": "increase",

    "high": "low",
    "higher": "lower",

    "easy": "difficult",
    "easier": "harder",

    "fast": "slow",
    "faster": "slower",

    "early": "late",
    "earlier": "later",

    "inside": "outside",
    "available": "unavailable",

    "yes": "no",
    "true": "false",

    "pass": "fail",
    "passed": "failed",

    "present": "absent",

    "start": "stop",
    "started": "stopped"
};


function cleanText(text) {

    return text
        .toLowerCase()
        .replace(/[.,!?;:()[\]{}"']/g, " ");
}


function getWords(text) {

    return cleanText(text)
        .split(/\s+/)
        .filter(word =>
            word.length > 2 &&
            !stopWords.has(word)
        );
}


function getCommonWords(words1, words2) {

    const set1 = new Set(words1);

    return [...new Set(words2.filter(word => set1.has(word)))];
}


function findOpposites(words1, words2) {

    const conflicts = [];

    for (const word1 of words1) {

        const opposite = oppositePairs[word1];

        if (opposite && words2.includes(opposite)) {

            conflicts.push(
                `${word1} ↔ ${opposite}`
            );
        }
    }

    return [...new Set(conflicts)];
}


function detectNegation(text) {

    const negations = [
        "not",
        "never",
        "no",
        "cannot",
        "can't",
        "doesn't",
        "don't",
        "isn't",
        "aren't",
        "wasn't",
        "weren't"
    ];

    return negations.some(word =>
        text.toLowerCase().includes(word)
    );
}


function findNumbers(text) {

    return text.match(/\b\d+(?:\.\d+)?\b/g) || [];
}


function analyzeStatements() {

    const statement1 =
        document.getElementById("statement1")
            .value.trim();

    const statement2 =
        document.getElementById("statement2")
            .value.trim();


    const result =
        document.getElementById("result");


    if (!statement1 || !statement2) {

        alert("Please enter both statements.");

        return;
    }


    const words1 = getWords(statement1);

    const words2 = getWords(statement2);


    const commonWords =
        getCommonWords(words1, words2);


    const conflicts =
        findOpposites(words1, words2);


    const negation1 =
        detectNegation(statement1);

    const negation2 =
        detectNegation(statement2);


    const numbers1 =
        findNumbers(statement1);

    const numbers2 =
        findNumbers(statement2);


    let relationship =
        "UNRELATED";

    let icon =
        "⚪";

    let description =
        "The statements do not contain enough evidence of agreement or contradiction.";

    let explanation =
        "The two statements appear to discuss different information.";


    /*
       DIRECT OPPOSITE DETECTION
    */

    if (conflicts.length > 0) {

        relationship =
            "CONTRADICTION";

        icon =
            "🔴";

        description =
            "The statements contain opposing terms.";

        explanation =
            "Opposing concepts were detected: " +
            conflicts.join(", ") +
            ".";
    }


    /*
       NEGATION DETECTION
    */

    else if (
        commonWords.length > 0 &&
        negation1 !== negation2
    ) {

        relationship =
            "CONTRADICTION";

        icon =
            "🔴";

        description =
            "The statements share a topic but differ through negation.";

        explanation =
            "Both statements discuss similar content, but one contains a negative form while the other does not.";
    }


    /*
       NUMBER CONFLICT
    */

    else if (
        numbers1.length > 0 &&
        numbers2.length > 0 &&
        numbers1[0] !== numbers2[0] &&
        commonWords.length >= 2
    ) {

        relationship =
            "POSSIBLE CONFLICT";

        icon =
            "🟠";

        description =
            "The statements discuss similar information but contain different numerical values.";

        explanation =
            `The statements mention ${numbers1[0]} and ${numbers2[0]}. These values may represent conflicting information.`;
    }


    /*
       AGREEMENT
    */

    else if (commonWords.length >= 2) {

        relationship =
            "RELATED / AGREEING";

        icon =
            "🟢";

        description =
            "The statements share important terms and appear to discuss the same idea.";

        explanation =
            "Several important words occur in both statements, suggesting that they are related and may express compatible information.";
    }


    /*
       UPDATE UI
    */

    document.getElementById("resultIcon")
        .textContent = icon;


    document.getElementById("resultTitle")
        .textContent = relationship;


    document.getElementById("resultDescription")
        .textContent = description;


    document.getElementById("commonWords")
        .textContent =
        commonWords.length > 0
            ? commonWords.join(", ")
            : "None detected";


    document.getElementById("conflicts")
        .textContent =
        conflicts.length > 0
            ? conflicts.join(", ")
            : "None detected";


    document.getElementById("explanationText")
        .textContent = explanation;


    result.classList.remove("hidden");
}
