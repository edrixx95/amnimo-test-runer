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
        } catch (err) {
          // Keep existing status if aggregation fails
          console.error(`Failed to aggregate status for ${session.id}:`, err);
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
