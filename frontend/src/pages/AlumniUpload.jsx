import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiUpload, FiDownload, FiUsers, FiBriefcase, FiCalendar, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const AlumniUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/alumni/stats');
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please select an Excel file (.xlsx or .xls)');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setUploadResult(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/alumni/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadResult(response.data.results);
      setFile(null);
      
      // Refresh stats
      fetchStats();

      // Reset file input
      document.getElementById('file-input').value = '';

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await api.get('/alumni/template', {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'SMVDU_Alumni_Template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      setError('Failed to download template');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Data Management</h1>
        <p className="text-gray-600">
          Upload and manage SMVDU CSE alumni information for networking
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alumni</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <FiUsers className="text-4xl text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Company</p>
                <p className="text-xl font-bold text-green-600">
                  {stats.byCompany[0]?._id || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  {stats.byCompany[0]?.count || 0} alumni
                </p>
              </div>
              <FiBriefcase className="text-4xl text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Latest Batch</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.byYear[0]?._id || 'N/A'}
                </p>
              </div>
              <FiCalendar className="text-4xl text-purple-600 opacity-20" />
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Alumni Data</h2>

        {/* Template Download */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <FiDownload className="text-blue-600 mt-1 mr-3" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">First time uploading?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Download our Excel template to see the required format. Fill it with your alumni data and upload.
              </p>
              <button
                onClick={downloadTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                <FiDownload className="inline mr-2" />
                Download Template
              </button>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Excel File
          </label>
          <input
            id="file-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {file && (
            <p className="mt-2 text-sm text-green-600 flex items-center">
              <FiCheckCircle className="mr-1" />
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <FiAlertCircle className="text-red-600 mt-0.5 mr-3" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
        >
          <FiUpload className="mr-2" />
          {uploading ? 'Uploading...' : 'Upload Alumni Data'}
        </button>
      </div>

      {/* Upload Results */}
      {uploadResult && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Rows</p>
              <p className="text-2xl font-bold text-blue-600">{uploadResult.total}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Imported</p>
              <p className="text-2xl font-bold text-green-600">{uploadResult.imported}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Updated</p>
              <p className="text-2xl font-bold text-yellow-600">{uploadResult.updated}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{uploadResult.failed}</p>
            </div>
          </div>

          {/* Errors */}
          {uploadResult.errors && uploadResult.errors.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Errors ({uploadResult.errors.length})</h3>
              <div className="max-h-64 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Row</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Error</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {uploadResult.errors.map((error, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 text-sm text-gray-900">{error.row}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{error.name || '-'}</td>
                        <td className="px-4 py-2 text-sm text-red-600">{error.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Department Breakdown */}
      {stats && stats.byDepartment && stats.byDepartment.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Alumni by Department</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.byDepartment.map((dept, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg text-center">
                <p className="text-sm font-medium text-gray-600">{dept._id || 'Unknown'}</p>
                <p className="text-2xl font-bold text-blue-600">{dept.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniUpload;
