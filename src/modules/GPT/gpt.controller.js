import axios from 'axios';
export const gpt = async(req, res) => {
    
            console.log('Received body:', req.body);
        
            const productName = req.body.productName;
            console.log(`Processing product: ${productName}`); 
        
            const requestBody = [
                {
                    content: `Give me names of dishes that can be made with ${productName}`,
                    role: 'user'
                }
            ];
        
            const options = {
                method: 'POST',
                url: 'https://chatgpt-api8.p.rapidapi.com/',
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': 'e8948516a6msh53bc343e189f9cbp1d6f54jsn150b0eb09380', // استخدم المفتاح الجديد هنا
                    'X-RapidAPI-Host': 'chatgpt-api8.p.rapidapi.com'
                },
                data: requestBody,
            };
        
            try {
                console.log('Sending request to the API...'); 
                const response = await axios(options);
                console.log('Received response:', response.data);
                return res.json(response.data);
            } catch (error) {
                console.error('Error sending request:', error.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

}