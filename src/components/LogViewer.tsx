import React, { useState, useEffect } from 'react';
import { X, Download, Trash2, Filter, Search, RefreshCw } from 'lucide-react';
import { logger, LogEntry } from '../utils/logger';

interface LogViewerProps {
  onClose: () => void;
}

const LogViewer: React.FC<LogViewerProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // 刷新日志
  const refreshLogs = () => {
    const allLogs = logger.getAllLogs();
    setLogs(allLogs);
  };

  // 初始加载和自动刷新
  useEffect(() => {
    refreshLogs();
    
    if (autoRefresh) {
      const interval = setInterval(refreshLogs, 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // 过滤日志
  useEffect(() => {
    let filtered = logs;

    // 按级别过滤
    if (selectedLevel !== 'ALL') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }

    // 按类别过滤
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }

    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(term) ||
        log.category.toLowerCase().includes(term) ||
        (log.data && JSON.stringify(log.data).toLowerCase().includes(term))
      );
    }

    setFilteredLogs(filtered);
  }, [logs, selectedLevel, selectedCategory, searchTerm]);

  // 获取统计信息
  const stats = logger.getLogStats();
  
  // 获取所有类别
  const categories = ['ALL', ...Object.keys(stats.byCategory)];
  
  // 获取级别颜色
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-600 bg-red-50';
      case 'WARN': return 'text-yellow-600 bg-yellow-50';
      case 'INFO': return 'text-blue-600 bg-blue-50';
      case 'DEBUG': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // 清空日志
  const handleClearLogs = () => {
    if (confirm('确定要清空所有日志吗？')) {
      logger.clearLogs();
      refreshLogs();
    }
  };

  // 下载日志
  const handleDownloadLogs = (format: 'json' | 'txt') => {
    logger.downloadLogs(format);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Dify 接口日志</h3>
              <p className="text-sm text-gray-500">
                总计 {stats.total} 条日志 | 错误 {stats.byLevel.ERROR} | 警告 {stats.byLevel.WARN}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-xl transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={autoRefresh ? '停止自动刷新' : '开启自动刷新'}
            >
              <RefreshCw className={`h-5 w-5 ${autoRefresh ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={refreshLogs}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              title="手动刷新"
            >
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={handleClearLogs}
              className="p-2 hover:bg-red-100 rounded-xl transition-colors"
              title="清空日志"
            >
              <Trash2 className="h-5 w-5 text-red-600" />
            </button>
            <button
              onClick={() => handleDownloadLogs('txt')}
              className="p-2 hover:bg-blue-100 rounded-xl transition-colors"
              title="下载文本格式"
            >
              <Download className="h-5 w-5 text-blue-600" />
            </button>
            <button
              onClick={() => handleDownloadLogs('json')}
              className="p-2 hover:bg-green-100 rounded-xl transition-colors"
              title="下载JSON格式"
            >
              <Download className="h-5 w-5 text-green-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center gap-4">
            {/* 搜索框 */}
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="搜索日志内容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 级别过滤 */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">所有级别</option>
              <option value="ERROR">错误</option>
              <option value="WARN">警告</option>
              <option value="INFO">信息</option>
              <option value="DEBUG">调试</option>
            </select>

            {/* 类别过滤 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'ALL' ? '所有类别' : category}
                </option>
              ))}
            </select>

            <span className="text-sm text-gray-600">
              显示 {filteredLogs.length} / {logs.length} 条
            </span>
          </div>
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>没有找到匹配的日志</p>
            </div>
          ) : (
            filteredLogs.map((log, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {log.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-900 mb-2">{log.message}</p>
                
                {log.data && (
                  <details className="mb-2">
                    <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                      查看数据
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs overflow-x-auto">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </details>
                )}
                
                {log.error && (
                  <details className="mb-2">
                    <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800">
                      查看错误详情
                    </summary>
                    <div className="mt-2 p-3 bg-red-50 rounded-lg text-xs">
                      <p className="font-medium text-red-800">{log.error.name}: {log.error.message}</p>
                      {log.error.stack && (
                        <pre className="mt-2 text-red-700 whitespace-pre-wrap">
                          {log.error.stack}
                        </pre>
                      )}
                    </div>
                  </details>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LogViewer;