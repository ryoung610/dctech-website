/**
 * H2 Database Manager Component
 * Provides UI for database management, backup, and restore
 */

import React, { useState, useEffect } from 'react';
import h2Database from '../lib/h2Database';
import H2ConsoleButton from './H2ConsoleButton';

interface DatabaseStats {
  tables: Record<string, number>;
  totalRecords: number;
  totalSize: number | string;
  availableSpace: number | string;
}

export function H2DatabaseManager() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const databaseStats = await h2Database.getStats();
      setStats(databaseStats);
    } catch (error) {
      console.error('Failed to load database stats:', error);
    }
  };

  const showMessage = (msg: string, isError: boolean = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      await h2Database.backupToLocalStorage();
      showMessage('Database backed up to localStorage successfully!');
    } catch (error) {
      showMessage(`Backup failed: ${error}`, true);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      await h2Database.restoreFromLocalStorage();
      showMessage('Database restored from localStorage successfully!');
      loadStats();
    } catch (error) {
      showMessage(`Restore failed: ${error}`, true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      await h2Database.downloadDatabase();
      showMessage('Database downloaded successfully!');
    } catch (error) {
      showMessage(`Download failed: ${error}`, true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      await h2Database.uploadDatabase(file);
      showMessage('Database uploaded successfully!');
      loadStats();
    } catch (error) {
      showMessage(`Upload failed: ${error}`, true);
    } finally {
      setLoading(false);
      if (fileInput) fileInput.value = '';
    }
  };

  const handleClearDatabase = async () => {
    if (!window.confirm('Are you sure you want to clear all database data? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await h2Database.clearDatabase();
      showMessage('Database cleared successfully!');
      loadStats();
    } catch (error) {
      showMessage(`Clear failed: ${error}`, true);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (typeof bytes !== 'number') return String(bytes);
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">H2 Database Manager</h2>
          <H2ConsoleButton />
        </div>

        {message && (
          <div className={`p-3 rounded mb-4 ${
            message.includes('failed') || message.includes('error') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Database Statistics */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Database Statistics</h3>
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-2xl font-bold text-blue-600">{stats.totalRecords}</div>
                <div className="text-sm text-gray-600">Total Records</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-2xl font-bold text-green-600">{Object.keys(stats.tables).length}</div>
                <div className="text-sm text-gray-600">Tables</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-2xl font-bold text-purple-600">
                  {typeof stats.totalSize === 'number' ? formatBytes(stats.totalSize) : stats.totalSize}
                </div>
                <div className="text-sm text-gray-600">Database Size</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-2xl font-bold text-orange-600">
                  {typeof stats.availableSpace === 'number' ? formatBytes(stats.availableSpace) : stats.availableSpace}
                </div>
                <div className="text-sm text-gray-600">Available Space</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Loading statistics...</div>
          )}
        </div>

        {/* Table Details */}
        {stats && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Table Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(stats.tables).map(([table, count]) => (
                <div key={table} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                  <span className="font-medium capitalize">{table}</span>
                  <span className="text-blue-600 font-bold">{count} records</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Backup & Restore */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Backup & Restore</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleBackup}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Backing up...' : 'Backup to Local'}
            </button>
            
            <button
              onClick={handleRestore}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Restoring...' : 'Restore from Local'}
            </button>
            
            <button
              onClick={handleDownload}
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Downloading...' : 'Download File'}
            </button>
            
            <label className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded cursor-pointer text-center disabled:opacity-50">
              {loading ? 'Uploading...' : 'Upload File'}
              <input
                ref={setFileInput}
                type="file"
                accept=".json"
                onChange={handleUpload}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>
        </div>

        {/* Database Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Database Actions</h3>
          <div className="flex space-x-4">
            <button
              onClick={loadStats}
              disabled={loading}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Refresh Stats
            </button>
            
            <button
              onClick={handleClearDatabase}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Clearing...' : 'Clear Database'}
            </button>
          </div>
        </div>

        {/* Console Info */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">H2 Console</h3>
          <p className="text-sm text-gray-600 mb-2">
            Access the H2 database console to run SQL commands, view data, and manage your database.
          </p>
          <div className="text-sm text-gray-500">
            <p>• Click the "H2 Console" button above</p>
            <p>• Or press <kbd className="bg-gray-200 px-1 rounded">Ctrl+Shift+H</kbd> to open</p>
            <p>• Type <code className="bg-gray-200 px-1 rounded">help</code> for available commands</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default H2DatabaseManager;
