import toastFactory from '~/composables/toast';
import { Exporter } from '~/utils/download/Exporter';
import type { ExporterStatus } from '~/utils/download/types';

export default () => {
  const toast = toastFactory();
  const { t } = useLocale();

  const loading = ref(false);
  const phase = ref(t('toast.phaseExporting'));
  const completed_count = ref(0);
  const total_count = ref(0);

  function formatElapsed(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let result = '';
    if (hours > 0) result += t('toast.elapsedHours', { count: hours });
    if (minutes > 0) result += t('toast.elapsedMinutes', { count: minutes });
    if (secs > 0 || result === '') result += t('toast.elapsedSeconds', { count: secs });
    return result;
  }

  function warnNoSelection() {
    toast.warning(t('common.tip'), t('toast.selectArticle'));
  }

  function notifyExportDone(type: string, seconds: number) {
    const elapsed = formatElapsed(seconds);
    console.debug('Elapsed:', elapsed);
    toast.success(t('toast.exportDone', { type }), t('toast.exportElapsed', { time: elapsed }));
  }

  // 导出 excel
  async function export2excel(urls: string[]) {
    if (urls.length === 0) {
      warnNoSelection();
      return;
    }

    const manager = new Exporter(urls);
    manager.on('export:begin', () => {
      phase.value = t('toast.phaseExporting');
      completed_count.value = 0;
      total_count.value = 0;
    });
    manager.on('export:total', (total: number) => {
      total_count.value = total;
    });
    manager.on('export:progress', (num: number) => {
      completed_count.value = num;
    });
    manager.on('export:finish', (seconds: number) => {
      notifyExportDone('Excel', seconds);
    });

    try {
      loading.value = true;
      await manager.startExport('excel');
    } catch (error) {
      console.error(t('toast.taskFailed'), error);
      alert((error as Error).message);
    } finally {
      loading.value = false;
    }
  }

  // 导出 json
  async function export2json(urls: string[]) {
    if (urls.length === 0) {
      warnNoSelection();
      return;
    }

    const manager = new Exporter(urls);
    manager.on('export:begin', () => {
      phase.value = t('toast.phaseExporting');
      completed_count.value = 0;
      total_count.value = 0;
    });
    manager.on('export:total', (total: number) => {
      total_count.value = total;
    });
    manager.on('export:progress', (num: number) => {
      completed_count.value = num;
    });
    manager.on('export:finish', (seconds: number) => {
      notifyExportDone('JSON', seconds);
    });

    try {
      loading.value = true;
      await manager.startExport('json');
    } catch (error) {
      console.error(t('toast.taskFailed'), error);
      alert((error as Error).message);
    } finally {
      loading.value = false;
    }
  }

  // 导出 html
  async function export2html(urls: string[]) {
    if (urls.length === 0) {
      warnNoSelection();
      return;
    }

    const manager = new Exporter(urls);
    manager.on('export:begin', () => {
      phase.value = t('toast.phaseParsingResources');
      completed_count.value = 0;
      total_count.value = 0;
    });
    manager.on('export:download', (total: number) => {
      phase.value = t('toast.phaseDownloadingResources');
      completed_count.value = 0;
      total_count.value = total;
    });
    manager.on('export:download:progress', (url: string, success: boolean, status: ExporterStatus) => {
      completed_count.value = status.completed.length;
    });
    manager.on('export:write', (total: number) => {
      phase.value = t('toast.phaseWritingFiles');
      completed_count.value = 0;
      total_count.value = total;
    });
    manager.on('export:write:progress', (index: number) => {
      completed_count.value = index;
    });
    manager.on('export:finish', (seconds: number) => {
      notifyExportDone('HTML', seconds);
    });

    try {
      loading.value = true;
      await manager.startExport('html');
    } catch (error) {
      console.error(t('toast.taskFailed'), error);
      alert((error as Error).message);
    } finally {
      loading.value = false;
    }
  }

  // 导出 txt
  async function export2txt(urls: string[]) {
    if (urls.length === 0) {
      warnNoSelection();
      return;
    }

    const manager = new Exporter(urls);
    manager.on('export:begin', () => {
      phase.value = t('toast.phaseParsingResources');
      completed_count.value = 0;
      total_count.value = 0;
    });
    manager.on('export:total', (total: number) => {
      phase.value = t('toast.phaseExporting');
      completed_count.value = 0;
      total_count.value = total;
    });
    manager.on('export:progress', (index: number) => {
      completed_count.value = index;
    });
    manager.on('export:finish', (seconds: number) => {
      notifyExportDone('Txt', seconds);
    });

    try {
      loading.value = true;
      await manager.startExport('txt');
    } catch (error) {
      console.error(t('toast.taskFailed'), error);
      alert((error as Error).message);
    } finally {
      loading.value = false;
    }
  }

  // 导出 markdown
  async function export2markdown(urls: string[]) {
    if (urls.length === 0) {
      warnNoSelection();
      return;
    }

    const manager = new Exporter(urls);
    manager.on('export:begin', () => {
      phase.value = t('toast.phaseParsingResources');
      completed_count.value = 0;
      total_count.value = 0;
    });
    manager.on('export:total', (total: number) => {
      phase.value = t('toast.phaseExporting');
      completed_count.value = 0;
      total_count.value = total;
    });
    manager.on('export:progress', (index: number) => {
      completed_count.value = index;
    });
    manager.on('export:finish', (seconds: number) => {
      notifyExportDone('Markdown', seconds);
    });

    try {
      loading.value = true;
      await manager.startExport('markdown');
    } catch (error) {
      console.error(t('toast.taskFailed'), error);
      alert((error as Error).message);
    } finally {
      loading.value = false;
    }
  }

  // 导出 word
  async function export2word(urls: string[]) {
    if (urls.length === 0) {
      warnNoSelection();
      return;
    }

    const manager = new Exporter(urls);
    manager.on('export:begin', () => {
      phase.value = t('toast.phaseParsingResources');
      completed_count.value = 0;
      total_count.value = 0;
    });
    manager.on('export:total', (total: number) => {
      phase.value = t('toast.phaseExporting');
      completed_count.value = 0;
      total_count.value = total;
    });
    manager.on('export:progress', (index: number) => {
      completed_count.value = index;
    });
    manager.on('export:finish', (seconds: number) => {
      notifyExportDone('Word', seconds);
    });

    try {
      loading.value = true;
      await manager.startExport('word');
    } catch (error) {
      console.error(t('toast.taskFailed'), error);
      alert((error as Error).message);
    } finally {
      loading.value = false;
    }
  }

  // 导出 pdf（与 HTML 导出类似，需先下载资源再生成 PDF）
  async function export2pdf(urls: string[]) {
    if (urls.length === 0) {
      warnNoSelection();
      return;
    }

    const manager = new Exporter(urls);
    manager.on('export:begin', () => {
      phase.value = t('toast.phaseParsingResources');
      completed_count.value = 0;
      total_count.value = 0;
    });
    manager.on('export:download', (total: number) => {
      phase.value = t('toast.phaseDownloadingResources');
      completed_count.value = 0;
      total_count.value = total;
    });
    manager.on('export:download:progress', (url: string, success: boolean, status: ExporterStatus) => {
      completed_count.value = status.completed.length;
    });
    manager.on('export:write', (total: number) => {
      phase.value = t('toast.phaseGeneratingPdf');
      completed_count.value = 0;
      total_count.value = total;
    });
    manager.on('export:write:progress', (index: number) => {
      completed_count.value = index;
    });
    manager.on('export:finish', (seconds: number) => {
      notifyExportDone('PDF', seconds);
    });

    try {
      loading.value = true;
      await manager.startExport('pdf');
    } catch (error) {
      console.error(t('toast.taskFailed'), error);
      alert((error as Error).message);
    } finally {
      loading.value = false;
    }
  }

  const needsContentFormats = new Set(['html', 'text', 'markdown', 'word', 'pdf']);

  function exportFile(
    type: 'excel' | 'json' | 'html' | 'text' | 'markdown' | 'word' | 'pdf',
    urls: string[],
    contentNotDownloadedCount?: number
  ) {
    if (needsContentFormats.has(type) && contentNotDownloadedCount) {
      toast.warning(t('common.tip'), t('toast.contentNotDownloaded', { count: contentNotDownloadedCount }));
      return;
    }

    switch (type) {
      case 'excel':
        return export2excel(urls);
      case 'json':
        return export2json(urls);
      case 'html':
        return export2html(urls);
      case 'text':
        return export2txt(urls);
      case 'markdown':
        return export2markdown(urls);
      case 'word':
        return export2word(urls);
      case 'pdf':
        return export2pdf(urls);
    }
  }

  return {
    loading,
    phase,
    completed_count,
    total_count,
    exportFile,
  };
};
