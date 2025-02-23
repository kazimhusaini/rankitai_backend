export const generateBusinessName = async (req, res) => {
    try {
        const { keywords } = req.body;
        const businessName = `AI-${keywords.join('-')}`;
        res.json({ businessName });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// businessController.js

// export const generateBusinessName = async (req, res) => {
//     try {
//         const { keywords } = req.body;
//         const businessName = `AI-${keywords.join('-')}`;
//         res.json({ businessName });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// Add the missing function for domain availability
export const checkDomainAvailability = async (req, res) => {
    try {
        const { domain } = req.body;
        
        // Here, you could add logic to check the availability of the domain.
        // This is just a simple placeholder response.
        const isAvailable = true; // Replace with actual domain check logic
        
        if (isAvailable) {
            res.json({ message: 'Domain is available!' });
        } else {
            res.status(400).json({ message: 'Domain is already taken.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
