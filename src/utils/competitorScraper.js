import axios from 'axios';
import cheerio from 'cheerio';

export const scrapeCompetitorData = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const title = $('head title').text();
        const description = $('meta[name="description"]').attr('content');
        const keywords = $('meta[name="keywords"]').attr('content');

        return { title, description, keywords };
    } catch (error) {
        console.error('Error scraping competitor data:', error);
        return null;
    }
};
