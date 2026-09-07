import { ref } from 'vue';

export function useReportViewers() {
  const showReportModal = ref(false);
  const reportSessionId = ref("");

  const showDataViewer = ref(false);
  const dataViewerUrl = ref("");
  const dataViewerSessionName = ref("");

  const showHtmlReport = ref(false);
  const htmlReportUrl = ref("");

  const openReport = (id: string, name?: string) => {
    dataViewerUrl.value = `/api/sessions/${id}/aggregated-report`;
    dataViewerSessionName.value = name || id;
    showDataViewer.value = true;
  };

  const openHtmlReportDialog = (url: string) => {
    htmlReportUrl.value = url;
    showHtmlReport.value = true;
  };

  return {
    showReportModal,
    reportSessionId,
    showDataViewer,
    dataViewerUrl,
    dataViewerSessionName,
    showHtmlReport,
    htmlReportUrl,
    openReport,
    openHtmlReportDialog
  };
}
