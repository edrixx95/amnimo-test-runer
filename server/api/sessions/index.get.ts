import { getAggregatedReport } from '../../utils/reportUtils';
import { getLiveProgress } from '../../utils/liveProgressParser';
import { sessionManager } from '../../utils/sessionManager';

export default defineEventHandler(async (event) => {
  try {
    const sessions = await sessionManager.getSessions();
    
    // Evaluate true status based on aggregated reports
    await Promise.all(sessions.map(async (session) => {
      if (session.status === 'Completed' || session.status === 'Failed') {
        try {
          const aggregated = await getAggregatedReport(session.id, session);
          if (aggregated._meta.failed > 0) {
            session.status = 'Failed';
          } else {
            session.status = 'Completed';
          }
          session.meta = aggregated._meta as any;
        } catch (err) {
          // Keep existing status if aggregation fails
          console.error(`Failed to aggregate status for ${session.id}:`, err);
        }
      } else if (session.status === 'Running') {
        try {
          const liveMeta = await getLiveProgress(session.id);
          if (liveMeta) {
            session.meta = liveMeta;
          }
        } catch (err) {
          console.error(`Failed to parse live progress for ${session.id}:`, err);
        }
      }
    }));

    return sessions;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch sessions',
    });
  }
});
