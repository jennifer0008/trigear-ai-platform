interface LogLevel {
  ERROR: 'ERROR';
  WARN: 'WARN';
  INFO: 'INFO';
  DEBUG: 'DEBUG';
}

interface LogEntry {
  timestamp: string;
  level: keyof LogLevel;
  category: string;
  message: string;
  data?: any;
  error?: Error;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // 最大保存日志条数
  
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private createLogEntry(
    level: keyof LogLevel,
    category: string,
    message: string,
    data?: any,
    error?: Error
  ): LogEntry {
    return {
      timestamp: this.formatTimestamp(),
      level,
      category,
      message,
      data: data ? JSON.parse(JSON.stringify(data)) : undefined,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } as any : undefined
    };
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // 安全地输出到控制台
    try {
      const consoleMessage = `[${entry.timestamp}] [${entry.level}] [${entry.category}] ${entry.message}`;
      
      switch (entry.level) {
        case 'ERROR':
          if (console.error) {
            console.error(consoleMessage, entry.data || '', entry.error || '');
          }
          break;
        case 'WARN':
          if (console.warn) {
            console.warn(consoleMessage, entry.data || '');
          }
          break;
        case 'INFO':
          if (console.info) {
            console.info(consoleMessage, entry.data || '');
          }
          break;
        case 'DEBUG':
          if (console.debug) {
            console.debug(consoleMessage, entry.data || '');
          }
          break;
      }
    } catch (consoleError) {
      // 如果控制台输出失败，静默处理，不影响日志记录
    }
  }

  error(category: string, message: string, data?: any, error?: Error): void {
    this.addLog(this.createLogEntry('ERROR', category, message, data, error));
  }

  warn(category: string, message: string, data?: any): void {
    this.addLog(this.createLogEntry('WARN', category, message, data));
  }

  info(category: string, message: string, data?: any): void {
    this.addLog(this.createLogEntry('INFO', category, message, data));
  }

  debug(category: string, message: string, data?: any): void {
    this.addLog(this.createLogEntry('DEBUG', category, message, data));
  }

  // 获取所有日志
  getAllLogs(): LogEntry[] {
    return [...this.logs];
  }

  // 按类别筛选日志
  getLogsByCategory(category: string): LogEntry[] {
    return this.logs.filter(log => log.category === category);
  }

  // 按级别筛选日志
  getLogsByLevel(level: keyof LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  // 清空日志
  clearLogs(): void {
    this.logs = [];
  }

  // 导出日志为JSON字符串
  exportLogsAsJSON(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // 导出日志为文本格式
  exportLogsAsText(): string {
    return this.logs.map(log => {
      let line = `[${log.timestamp}] [${log.level}] [${log.category}] ${log.message}`;
      
      if (log.data) {
        line += `\nData: ${JSON.stringify(log.data, null, 2)}`;
      }
      
      if (log.error) {
        line += `\nError: ${log.error.name}: ${log.error.message}`;
        if (log.error.stack) {
          line += `\nStack: ${log.error.stack}`;
        }
      }
      
      return line;
    }).join('\n\n');
  }

  // 下载日志文件
  downloadLogs(format: 'json' | 'txt' = 'txt'): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `dify-logs-${timestamp}.${format}`;
    
    let content: string;
    let mimeType: string;
    
    if (format === 'json') {
      content = this.exportLogsAsJSON();
      mimeType = 'application/json';
    } else {
      content = this.exportLogsAsText();
      mimeType = 'text/plain';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    this.info('LOGGER', `日志文件已下载: ${filename}`);
  }

  // 获取日志统计信息
  getLogStats(): {
    total: number;
    byLevel: Record<keyof LogLevel, number>;
    byCategory: Record<string, number>;
  } {
    const stats = {
      total: this.logs.length,
      byLevel: { ERROR: 0, WARN: 0, INFO: 0, DEBUG: 0 } as Record<keyof LogLevel, number>,
      byCategory: {} as Record<string, number>
    };

    this.logs.forEach(log => {
      stats.byLevel[log.level]++;
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;
    });

    return stats;
  }
}

// 创建全局日志实例
export const logger = new Logger();

// 导出类型
export type { LogEntry, LogLevel };