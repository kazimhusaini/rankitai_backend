export const analyzeSEO = (content) => {
    const keywordCount = {};
    const words = content.toLowerCase().split(/\W+/);

    words.forEach((word) => {
        if (word.length > 3) {
            keywordCount[word] = (keywordCount[word] || 0) + 1;
        }
    });

    return Object.entries(keywordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10) // Get top 10 keywords
        .map(([keyword, count]) => ({ keyword, count }));
};
