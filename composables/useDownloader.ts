import toastFactory from '~/composables/toast';
import type { Metadata } from '~/store/v2/metadata';
import { Downloader } from '~/utils/download/Downloader';
import type { DownloaderStatus } from '~/utils/download/types';

export interface DownloadArticleOptions {
  // 文章内容下载成功回调
  onContent: (url: string) => void;

  // 文章状态异常回调(不含「已删除」)
  onStatusChange: (url: string, status: string) => void;

  // 文章被删除回调
  onDelete: (url: string) => void;

  // 文章阅读量抓取成功回调
  onMetadata: (url: string, metadata: Metadata) => void;

  // 文章留言抓取成功回调
  onComment: (url: string) => void;

  // 修复单篇文章下载的 fakeid 专用
  onFakeID: (url: string, fakeid: string) => void;
}

export default (options: Partial<DownloadArticleOptions> = {}) => {
  const toast = toastFactory();
  const { t } = useLocale();

  const loading = ref(false);
  const completed_count = ref(0);
  const total_count = ref(0);

  let downloader: Downloader | null = null;

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

  function logProgress(status: DownloaderStatus, includeDeleted = true) {
    console.debug(
      t(includeDeleted ? 'toast.downloadProgress' : 'toast.downloadProgressNoDeleted', {
        pending: status.pending.length,
        completed: status.completed.length,
        failed: status.failed.length,
        deleted: status.deleted.length,
      })
    );
  }

  // 抓取文章内容(html)
  async function downloadArticleHTML(urls: string[]) {
    if (urls.length === 0) {
      warnNoSelection();
      return;
    }

    try {
      loading.value = true;
      cleanupDownloader();

      downloader = new Downloader(urls);
      downloader.on('download:progress', (url: string, success: boolean, status: DownloaderStatus) => {
        logProgress(status);
        completed_count.value = status.completed.length;
        if (success && typeof options.onContent === 'function') {
          options.onContent(url);
        }
      });
      downloader.on('download:deleted', (url: string) => {
        if (typeof options.onDelete === 'function') {
          options.onDelete(url);
        }
      });
      downloader.on('download:exception', (url: string, msg: string) => {
        if (typeof options.onStatusChange === 'function') {
          options.onStatusChange(url, msg);
        }
      });
      downloader.on('download:begin', () => {
        console.debug('Start fetching article content...');
        completed_count.value = 0;
        total_count.value = urls.length;
      });
      downloader.on('download:finish', (seconds: number, status: DownloaderStatus) => {
        const elapsed = formatElapsed(seconds);
        console.debug('Elapsed:', elapsed);
        toast.success(
          t('toast.fetchComplete', { type: t('toast.typeContent') }),
          t('toast.fetchElapsed', {
            time: elapsed,
            completed: status.completed.length,
            failed: status.failed.length,
            deleted: status.deleted.length,
          })
        );
      });
      downloader.on('download:stop', () => {
        toast.info(t('toast.htmlStopped'));
      });

      await downloader.startDownload('html');
    } catch (error) {
      console.error(t('toast.fetchFailed', { type: t('toast.typeContent') }), error);
      alert((error as Error).message);
    } finally {
      loading.value = false;
      cleanupDownloader();
    }
  }

  // 抓取文章阅读量、点赞量等元数据
  async function downloadArticleMetadata(urls: string[]) {
    if (urls.length === 0) {
      warnNoSelection();
      return;
    }

    try {
      loading.value = true;
      cleanupDownloader();

      downloader = new Downloader(urls);
      downloader.on('download:progress', (url: string, success: boolean, status: DownloaderStatus) => {
        logProgress(status);
        completed_count.value = status.completed.length;
      });
      downloader.on('download:metadata', (url: string, metadata: Metadata) => {
        if (typeof options.onMetadata === 'function') {
          options.onMetadata(url, metadata);
        }
      });
      downloader.on('download:deleted', (url: string) => {
        if (typeof options.onDelete === 'function') {
          options.onDelete(url);
        }
      });
      downloader.on('download:exception', (url: string, msg: string) => {
        if (typeof options.onStatusChange === 'function') {
          options.onStatusChange(url, msg);
        }
      });
      downloader.on('download:begin', () => {
        console.debug('Start fetching reads...');
        completed_count.value = 0;
        total_count.value = urls.length;
      });
      downloader.on('download:finish', (seconds: number, status: DownloaderStatus) => {
        const elapsed = formatElapsed(seconds);
        console.debug('Elapsed:', elapsed);
        toast.success(
          t('toast.fetchComplete', { type: t('toast.typeMetadata') }),
          t('toast.fetchElapsed', {
            time: elapsed,
            completed: status.completed.length,
            failed: status.failed.length,
            deleted: status.deleted.length,
          })
        );
      });

      await downloader.startDownload('metadata');
    } catch (error) {
      console.error(t('toast.fetchFailed', { type: t('toast.typeMetadata') }), error);
      alert((error as Error).message);
    } finally {
      loading.value = false;
      cleanupDownloader();
    }
  }

  // 抓取文章留言数据
  async function downloadArticleComment(urls: string[]) {
    if (urls.length === 0) {
      warnNoSelection();
      return;
    }

    try {
      loading.value = true;
      cleanupDownloader();

      downloader = new Downloader(urls);
      downloader.on('download:progress', (url: string, success: boolean, status: DownloaderStatus) => {
        logProgress(status);
        completed_count.value = status.completed.length;
        if (success && typeof options.onComment === 'function') {
          options.onComment(url);
        }
      });
      downloader.on('download:begin', () => {
        console.debug('Start fetching comments...');
        completed_count.value = 0;
        total_count.value = urls.length;
      });
      downloader.on('download:finish', (seconds: number, status: DownloaderStatus) => {
        const elapsed = formatElapsed(seconds);
        console.debug('Elapsed:', elapsed);
        toast.success(
          t('toast.fetchComplete', { type: t('toast.typeComment') }),
          t('toast.fetchElapsedNoDeleted', {
            time: elapsed,
            completed: status.completed.length,
            failed: status.failed.length,
          })
        );
      });

      await downloader.startDownload('comments');
    } catch (error) {
      console.error(t('toast.fetchFailed', { type: t('toast.typeComment') }), error);
      alert((error as Error).message);
    } finally {
      loading.value = false;
      cleanupDownloader();
    }
  }

  // 修复单篇文章fakeid
  async function fixSingleFakeidTask(urls: string[]) {
    if (urls.length === 0) {
      warnNoSelection();
      return;
    }

    try {
      loading.value = true;
      cleanupDownloader();

      downloader = new Downloader(urls);
      downloader.on('download:progress', (url: string, success: boolean, status: DownloaderStatus) => {
        logProgress(status, false);
        completed_count.value = status.completed.length;
      });
      downloader.on('download:begin', () => {
        console.debug('Start fixing fakeid...');
        completed_count.value = 0;
        total_count.value = urls.length;
      });
      downloader.on('fix:fakeid', (url: string, fakeid: string) => {
        console.debug(`${url} fixed fakeid: ${fakeid}`);
        if (typeof options.onFakeID === 'function') {
          options.onFakeID(url, fakeid);
        }
      });
      downloader.on('download:finish', (seconds: number, status: DownloaderStatus) => {
        const elapsed = formatElapsed(seconds);
        console.debug('Elapsed:', elapsed);
        toast.success(
          t('toast.fetchComplete', { type: 'fakeid' }),
          t('toast.fixElapsed', {
            time: elapsed,
            completed: status.completed.length,
            failed: status.failed.length,
          })
        );
      });

      await downloader.startDownload('fakeid');
    } catch (error) {
      console.error(t('toast.fetchFailed', { type: 'fakeid' }), error);
      alert((error as Error).message);
    } finally {
      loading.value = false;
      cleanupDownloader();
    }
  }

  async function download(type: 'html' | 'metadata' | 'comment' | 'fakeid', urls: string[]) {
    if (type === 'html') {
      await downloadArticleHTML(urls);
    } else if (type === 'metadata') {
      await downloadArticleMetadata(urls);
    } else if (type === 'comment') {
      await downloadArticleComment(urls);
    } else if (type === 'fakeid') {
      await fixSingleFakeidTask(urls);
    }
  }

  function cleanupDownloader() {
    if (downloader) {
      downloader.removeAllListeners();
      downloader = null;
    }
  }

  function stop() {
    if (downloader) {
      downloader.stop();
      // 注意：不在此处清理监听器，等 download:stop 事件触发后由 finally 块清理
    }
  }

  return {
    loading,
    completed_count,
    total_count,
    download,
    stop,
  };
};
