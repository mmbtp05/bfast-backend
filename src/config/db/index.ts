import { PrismaClient } from "../../../generated/prisma/client";
import logger from "../../utils/logger";

const prisma = new PrismaClient({
    log: [
        { level: 'warn', emit: 'event' },
        { level: 'info', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'query', emit: 'event' }
    ],
});

prisma.$on('query', async (e) => {
    logger.log('query' ,{
        level: 'query',
        query: e.query,
        params: e.params,
        duration: e.duration,  
        target: e.target,
        timestamp: e.timestamp
    });
});

export default prisma;