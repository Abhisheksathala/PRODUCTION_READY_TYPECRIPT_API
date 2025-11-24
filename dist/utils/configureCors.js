import cors from 'cors';
const configureCors = () => {
    const corsOptionsDelegate = (req, callback) => {
        const allowedOrigins = ['http://localhost:5173'];
        const origin = req.header('Origin');
        let corsOptions;
        if (!origin || allowedOrigins.includes(origin)) {
            corsOptions = {
                origin: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Version'],
                exposedHeaders: ['X-Total-Count', 'Content-Range'],
                credentials: true,
                preflightContinue: false,
                maxAge: 600,
                optionsSuccessStatus: 204,
            };
        }
        else {
            corsOptions = { origin: false };
            console.log('this corse origin is not allowed bro ');
        }
        callback(null, corsOptions);
    };
    return cors(corsOptionsDelegate);
};
export { configureCors };
